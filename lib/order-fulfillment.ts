import { BOOKS, CURRENCY } from "@/components/sections/library/library-content";
import {
  createReaderAccessToken,
  getEbookPublication,
  grantEbookEntitlement,
  normalizeEmail,
} from "@/lib/ebooks";
import { claimOrderForFulfillment, getOrder, markOrderFulfilled, type EmailOutcome } from "@/lib/orders";
import { verifyTransaction } from "@/lib/paystack";
import { EmailNotConfiguredError, FROM_ADDRESS, sendEmail } from "@/lib/resend";
import { customerOrderEmail, ownerOrderEmail, printerOrderEmail } from "@/lib/email-templates";
import type { BookFormat } from "@/lib/ebook-types";
import { formatNaira } from "@/lib/utils";

type ChargeMetadata = {
  bookId?: string;
  bookTitle?: string;
  format?: BookFormat;
  priceNaira?: number;
  customerName?: string;
  customerPhone?: string;
  address?: { line1?: string; city?: string; state?: string };
};

export type ConfirmedOrder = {
  reference: string;
  bookId: string;
  bookTitle: string;
  format: BookFormat;
  priceNaira: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: { line1: string; city: string; state: string };
};

export type OrderFulfillmentResult =
  | {
      state: "pending";
      reference: string;
      paymentStatus: string;
    }
  | {
      state: "confirmed";
      order: ConfirmedOrder;
      emailStatus: {
        customer: EmailOutcome;
        owner: EmailOutcome;
        printer: EmailOutcome;
      };
      fulfillmentStatus: "complete" | "processing";
    };

export type OrderConfirmationErrorCode =
  | "invalid_reference"
  | "unknown_order"
  | "invalid_order"
  | "amount_mismatch"
  | "ebook_unavailable"
  | "missing_email";

export class OrderConfirmationError extends Error {
  constructor(
    public readonly code: OrderConfirmationErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "OrderConfirmationError";
  }
}

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://adeseunoyeneye.com").replace(/\/+$/, "");
}

async function sendWithOutcome(
  reference: string,
  recipient: string,
  input: Parameters<typeof sendEmail>[0],
): Promise<EmailOutcome> {
  try {
    const { error } = await sendEmail(input);
    if (error) {
      console.error(`Order ${reference}: ${recipient} email failed to send:`, error);
      return "failed";
    }
    return "sent";
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      console.error(error.message);
    } else {
      console.error(`Order ${reference}: ${recipient} email threw:`, error);
    }
    return "failed";
  }
}

/**
 * Verifies a Paystack reference, grants durable access, and sends the order
 * notifications exactly once. Both the webhook and the customer callback use
 * this path, so a delayed or misconfigured webhook cannot strand a buyer who
 * has returned from a successful payment.
 */
export async function fulfillOrder(referenceInput: string): Promise<OrderFulfillmentResult> {
  const reference = referenceInput.trim();
  if (!reference || reference.length > 100 || !/^[A-Za-z0-9.=-]+$/.test(reference)) {
    throw new OrderConfirmationError("invalid_reference", "The payment reference is invalid.", 400);
  }

  const verified = await verifyTransaction(reference);
  if (verified.status !== "success") {
    return { state: "pending", reference, paymentStatus: verified.status };
  }

  const metadata = (verified.metadata ?? {}) as ChargeMetadata;
  const book = BOOKS.find((candidate) => candidate.id === metadata.bookId);
  if (!book) {
    throw new OrderConfirmationError("unknown_order", "This payment is not linked to a Library book.", 422);
  }

  if (metadata.format !== "ebook" && metadata.format !== "paperback") {
    throw new OrderConfirmationError("invalid_order", "This payment is missing its book format.", 422);
  }
  const format = metadata.format;

  const ebookPublication = format === "ebook" ? await getEbookPublication(book.id) : null;
  if (format === "ebook" && !ebookPublication?.manifestKey) {
    throw new OrderConfirmationError(
      "ebook_unavailable",
      "The e-book is temporarily unavailable. Your payment has not been lost.",
      503,
    );
  }

  const metadataPrice = Number(metadata.priceNaira);
  const currentPrice = format === "ebook" ? ebookPublication!.priceNaira : book.price;
  const priceNaira = Number.isFinite(metadataPrice) && metadataPrice > 0 ? metadataPrice : currentPrice;
  const expectedAmountKobo = Math.round(priceNaira * 100);
  if (verified.amount !== expectedAmountKobo || verified.currency !== CURRENCY) {
    throw new OrderConfirmationError(
      "amount_mismatch",
      "The payment amount needs a manual review before this order can be released.",
      422,
    );
  }

  const customerEmail = normalizeEmail(verified.customerEmail);
  if (!customerEmail || !customerEmail.includes("@")) {
    throw new OrderConfirmationError("missing_email", "Paystack did not return the purchase email.", 422);
  }

  const order: ConfirmedOrder = {
    reference,
    bookId: book.id,
    bookTitle: book.title,
    format,
    priceNaira,
    currency: CURRENCY,
    customerName: metadata.customerName?.trim() ?? "",
    customerEmail,
    customerPhone: metadata.customerPhone?.trim() ?? "",
    address: {
      line1: metadata.address?.line1?.trim() ?? "",
      city: metadata.address?.city?.trim() ?? "",
      state: metadata.address?.state?.trim() ?? "",
    },
  };

  // Entitlement writes are idempotent. Do this before the fulfillment claim so
  // the returning buyer can enter the reader even if the webhook currently owns
  // the email-notification work.
  if (format === "ebook") {
    await grantEbookEntitlement({
      bookId: order.bookId,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      orderReference: order.reference,
      grantedAt: new Date().toISOString(),
    });
  }

  const existing = await getOrder(reference);
  if (existing?.status === "fulfilled") {
    return {
      state: "confirmed",
      order,
      emailStatus: existing.emailStatus ?? { customer: "skipped", owner: "skipped", printer: "skipped" },
      fulfillmentStatus: "complete",
    };
  }

  const claimed = await claimOrderForFulfillment(reference);
  if (!claimed) {
    return {
      state: "confirmed",
      order,
      emailStatus: { customer: "skipped", owner: "skipped", printer: "skipped" },
      fulfillmentStatus: "processing",
    };
  }

  const addressBlock = `${order.address.line1}\n${order.address.city}, ${order.address.state}`;
  let readerAccessUrl: string | null = null;
  if (format === "ebook") {
    const token = await createReaderAccessToken({
      email: order.customerEmail,
      name: order.customerName,
      nextPath: `/read/${order.bookId}`,
    });
    readerAccessUrl = `${siteUrl()}/api/reader/access/${encodeURIComponent(token)}`;
  }

  const customerEmailContent = customerOrderEmail({
    bookTitle: order.bookTitle,
    customerName: order.customerName,
    amount: formatNaira(order.priceNaira),
    reference: order.reference,
    format,
    readerAccessUrl: readerAccessUrl ?? undefined,
    libraryUrl: `${siteUrl()}/read`,
    coverUrl: book.coverImage ? `${siteUrl()}${book.coverImage}` : undefined,
    address: format === "paperback" ? addressBlock : undefined,
  });

  const customerPromise = sendWithOutcome(reference, "customer", {
    from: FROM_ADDRESS.library,
    to: order.customerEmail,
    ...customerEmailContent,
  });

  const ownerEmail = ownerOrderEmail({
    bookTitle: order.bookTitle,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    amount: formatNaira(order.priceNaira),
    reference: order.reference,
    format,
    libraryUrl: `${siteUrl()}/read`,
    address: format === "paperback" ? addressBlock : undefined,
  });
  const ownerPromise = sendWithOutcome(reference, "owner notification", {
    from: FROM_ADDRESS.library,
    to: "adeseun05@gmail.com",
    ...ownerEmail,
  });

  let printerPromise: Promise<EmailOutcome> = Promise.resolve("skipped");
  if (format === "paperback") {
    const printerEmail = process.env.PRINTER_EMAIL;
    if (!printerEmail) {
      console.error(`Order ${reference}: PRINTER_EMAIL is not set. The printer was not notified.`);
    } else {
      const printerEmailContent = printerOrderEmail({
        bookTitle: order.bookTitle,
        reference: order.reference,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        address: addressBlock,
        pageCount: String(book.printSpecs.pageCount ?? "Unconfirmed"),
        trimSize: book.printSpecs.trimSize,
        binding: book.printSpecs.binding,
        notes: book.printSpecs.notes,
      });
      printerPromise = sendWithOutcome(reference, "printer", {
        from: FROM_ADDRESS.library,
        to: printerEmail,
        ...printerEmailContent,
      });
    }
  }

  const [customer, owner, printer] = await Promise.all([customerPromise, ownerPromise, printerPromise]);
  const emailStatus = { customer, owner, printer };

  if (format === "paperback" && printer !== "sent") {
    console.error(
      `ACTION REQUIRED: order ${reference} (${order.bookTitle}, ${formatNaira(order.priceNaira)}) was paid for but the printer was not notified (${printer}).`,
    );
  }

  await markOrderFulfilled(reference, {
    ...order,
    emailStatus,
  });

  return {
    state: "confirmed",
    order,
    emailStatus,
    fulfillmentStatus: "complete",
  };
}
