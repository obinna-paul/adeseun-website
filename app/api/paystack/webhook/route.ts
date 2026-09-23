import { NextResponse } from "next/server";
import { BOOKS, CURRENCY } from "@/components/sections/library/library-content";
import { verifyWebhookSignature, verifyTransaction, PaystackNotConfiguredError } from "@/lib/paystack";
import { getOrder, claimOrderForFulfillment, markOrderFulfilled, type EmailOutcome } from "@/lib/orders";
import { sendEmail, EmailNotConfiguredError, FROM_ADDRESS } from "@/lib/resend";
import { formatNaira } from "@/lib/utils";
import {
  createReaderAccessToken,
  getEbookPublication,
  grantEbookEntitlement,
} from "@/lib/ebooks";
import type { BookFormat } from "@/lib/ebook-types";

/**
 * The one thing that actually triggers a fulfilled order. The redirect
 * back to app/checkout/thank-you after payment is UI only — a closed
 * tab, a network hiccup, or someone hand-crafting a request to that page
 * proves nothing. This webhook is server-to-server from Paystack, its
 * signature is checked before anything in the body is trusted, and the
 * transaction is re-verified directly against Paystack's own API before
 * any of the three order emails goes out.
 *
 * Order-of-truth for what actually gets emailed: the transaction's own
 * `metadata` (bookId, customer name/phone/address) — the same object
 * app/api/checkout set at Paystack.initialize — not the Redis order
 * log. That log (lib/orders.ts) is used only for idempotency and as a
 * browsable history; a genuine, signature-verified webhook is
 * self-contained and shouldn't depend on a side store that might not be
 * configured yet to actually fulfill an order.
 *
 * ── Why fulfillment is claimed before it runs ────────────────────────
 * Paystack retries deliveries and can overlap them, so the order log's
 * `status === "fulfilled"` check alone is check-then-act: two concurrent
 * deliveries could both read "not fulfilled" and both send the full set
 * of emails — which for the printer means two copies printed against one
 * paid order. `claimOrderForFulfillment` makes winning the right to
 * fulfill a single atomic Redis operation, so exactly one run proceeds.
 * It's taken *after* all validation, so a rejected webhook (bad amount,
 * unknown book) doesn't burn the claim and block a corrected retry.
 */

type ChargeMetadata = {
  bookId?: string;
  bookTitle?: string;
  format?: BookFormat;
  priceNaira?: number;
  customerName?: string;
  customerPhone?: string;
  address?: { line1?: string; city?: string; state?: string };
};

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://adeseunoyeneye.com").replace(/\/+$/, "");
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  let signatureValid: boolean;
  try {
    signatureValid = verifyWebhookSignature(rawBody, signature);
  } catch (err) {
    if (err instanceof PaystackNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Payments are not set up yet." }, { status: 500 });
    }
    throw err;
  }

  if (!signatureValid) {
    console.error("Paystack webhook: invalid signature — ignoring.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    // Ack anything else (Paystack sends more than one event type) so it doesn't retry — we just don't act on it.
    return NextResponse.json({ ok: true });
  }

  const data = event.data ?? {};
  const reference = String(data.reference ?? "");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  // Idempotency: a retried webhook for an order we already fulfilled is a no-op.
  const existing = await getOrder(reference);
  if (existing?.status === "fulfilled") {
    return NextResponse.json({ ok: true, alreadyFulfilled: true });
  }

  let verified;
  try {
    verified = await verifyTransaction(reference);
  } catch (err) {
    if (err instanceof PaystackNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Payments are not set up yet." }, { status: 500 });
    }
    console.error("Paystack verify failed:", err);
    return NextResponse.json({ error: "Could not verify transaction." }, { status: 502 });
  }

  if (verified.status !== "success") {
    console.error(`Paystack webhook: verify status for ${reference} was "${verified.status}", not "success" — skipping.`);
    return NextResponse.json({ ok: true });
  }

  const metadata = (verified.metadata ?? {}) as ChargeMetadata;
  const book = BOOKS.find((b) => b.id === metadata.bookId);

  if (!book) {
    console.error(`Paystack webhook: order ${reference} has no matching book for metadata.bookId="${metadata.bookId}" — cannot fulfill automatically.`);
    return NextResponse.json({ ok: true });
  }

  const format: BookFormat = metadata.format === "ebook" ? "ebook" : "paperback";
  const ebookPublication = format === "ebook" ? await getEbookPublication(book.id) : null;
  if (format === "ebook" && !ebookPublication?.manifestKey) {
    console.error(`Paystack webhook: e-book publication for ${book.id} is not available. Retrying later.`);
    return NextResponse.json({ error: "E-book publication is unavailable." }, { status: 503 });
  }

  // The verified Paystack transaction preserves the server-calculated
  // checkout price. This lets an already-open checkout complete safely
  // even if the publisher changes the catalog price before its webhook
  // arrives. Older transactions fall back to the current catalog price.
  const metadataPrice = Number(metadata.priceNaira);
  const currentPrice = format === "ebook" ? ebookPublication!.priceNaira : book.price;
  const priceNaira = Number.isFinite(metadataPrice) && metadataPrice > 0 ? metadataPrice : currentPrice;
  const expectedAmountKobo = Math.round(priceNaira * 100);
  if (verified.amount !== expectedAmountKobo || verified.currency !== CURRENCY) {
    console.error(
      `Paystack webhook: AMOUNT MISMATCH for ${reference} — paid ${verified.amount} ${verified.currency}, expected ${expectedAmountKobo} ${CURRENCY} for "${book.title}" (${format}). Not fulfilling automatically; check this order manually in the Paystack dashboard.`,
    );
    return NextResponse.json({ ok: true });
  }

  // Claimed only now that the order is known-good, so a rejected webhook doesn't lock out a corrected retry.
  const claimed = await claimOrderForFulfillment(reference);
  if (!claimed) {
    console.warn(`Paystack webhook: ${reference} is already being fulfilled by another delivery — standing down.`);
    return NextResponse.json({ ok: true, alreadyClaimed: true });
  }

  const customerName = metadata.customerName ?? "";
  const customerPhone = metadata.customerPhone ?? "";
  const customerEmail = verified.customerEmail;
  const address = {
    line1: metadata.address?.line1 ?? "",
    city: metadata.address?.city ?? "",
    state: metadata.address?.state ?? "",
  };

  const addressBlock = `${address.line1}\n${address.city}, ${address.state}`;
  const emailStatus: { customer: EmailOutcome; owner: EmailOutcome; printer: EmailOutcome } = {
    customer: "skipped",
    owner: "skipped",
    printer: "skipped",
  };

  let readerAccessUrl: string | null = null;
  if (format === "ebook") {
    if (!customerEmail) {
      console.error(`Order ${reference}: Paystack returned no customer email, so e-book access cannot be granted.`);
      return NextResponse.json({ error: "Customer email is missing." }, { status: 500 });
    }

    try {
      await grantEbookEntitlement({
        bookId: book.id,
        customerEmail,
        customerName,
        orderReference: reference,
        grantedAt: new Date().toISOString(),
      });
      const token = await createReaderAccessToken({
        email: customerEmail,
        name: customerName,
        nextPath: `/read/${book.id}`,
      });
      readerAccessUrl = `${siteUrl()}/api/reader/access/${encodeURIComponent(token)}`;
    } catch (err) {
      console.error(`Order ${reference}: could not grant e-book access:`, err);
      return NextResponse.json({ error: "Could not grant e-book access yet." }, { status: 500 });
    }
  }

  // The first send tells us whether email is configured at all — if not, fail closed (500, so Paystack retries once it's fixed) rather than silently skipping a paid order's notifications.
  if (!customerEmail) {
    console.error(`Order ${reference}: Paystack returned no customer email — cannot send the buyer their confirmation.`);
  } else {
    try {
      const { error } = await sendEmail({
        from: FROM_ADDRESS.library,
        to: customerEmail,
        subject: format === "ebook" ? `Read ${book.title} online` : `Your order — ${book.title}`,
        text:
          format === "ebook"
            ? [
                `Thank you for your order, ${customerName || "there"}.`,
                "",
                `E-book: ${book.title}`,
                `Amount paid: ${formatNaira(priceNaira)}`,
                `Order reference: ${reference}`,
                "",
                "Open your private reading room:",
                readerAccessUrl ?? `${siteUrl()}/read`,
                "",
                "This sign-in link expires in 15 minutes. You can request a fresh link from the reading room at any time.",
              ].join("\n")
            : [
                `Thank you for your order, ${customerName || "there"}.`,
                "",
                `Book: ${book.title}`,
                `Amount paid: ${formatNaira(priceNaira)}`,
                `Order reference: ${reference}`,
                "",
                "Delivery address on file:",
                addressBlock,
                "",
                "Your copy is being prepared for print. Please allow 7-10 business days for delivery. Thank you for your patience.",
              ].join("\n"),
      });
      if (error) {
        emailStatus.customer = "failed";
        console.error(`Order ${reference}: customer email failed to send:`, error);
      } else {
        emailStatus.customer = "sent";
      }
    } catch (err) {
      if (err instanceof EmailNotConfiguredError) {
        console.error(err.message);
        return NextResponse.json({ error: "Email is not configured yet." }, { status: 500 });
      }
      emailStatus.customer = "failed";
      console.error(`Order ${reference}: customer email threw:`, err);
    }
  }

  try {
    const { error } = await sendEmail({
      from: FROM_ADDRESS.library,
      to: "adeseun05@gmail.com",
      subject: `New ${format === "ebook" ? "e-book" : "paperback"} order — ${book.title}`,
      text: [
        `Book: ${book.title}`,
        `Format: ${format === "ebook" ? "E-book" : "Paperback"}`,
        `Amount: ${formatNaira(priceNaira)}`,
        `Order reference: ${reference}`,
        "",
        `Customer: ${customerName}`,
        `Email: ${customerEmail}`,
        format === "paperback" ? `Phone: ${customerPhone}` : null,
        format === "paperback" ? "Delivery address:" : null,
        format === "paperback" ? addressBlock : null,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });
    if (error) {
      emailStatus.owner = "failed";
      console.error(`Order ${reference}: notification email to adeseun05@gmail.com failed to send:`, error);
    } else {
      emailStatus.owner = "sent";
    }
  } catch (err) {
    emailStatus.owner = "failed";
    console.error(`Order ${reference}: notification email threw:`, err);
  }

  // Not hardcoded — needs PRINTER_EMAIL set as an env var (locally and in Vercel) before this can reach them.
  const printerEmail = process.env.PRINTER_EMAIL;
  if (format === "ebook") {
    emailStatus.printer = "skipped";
  } else if (!printerEmail) {
    console.error(`Order ${reference}: PRINTER_EMAIL is not set — the printer was not notified. Set this env var once you have the printer's real address.`);
  } else {
    try {
      const { error } = await sendEmail({
        from: FROM_ADDRESS.library,
        to: printerEmail,
        subject: `New print job — ${book.title} (Qty: 1)`,
        text: [
          `New order to print — reference ${reference}.`,
          "",
          `Book: ${book.title}`,
          `Quantity: 1`,
          `Page count: ${book.printSpecs.pageCount ?? "unconfirmed"}`,
          `Trim size: ${book.printSpecs.trimSize}`,
          `Binding: ${book.printSpecs.binding}`,
          book.printSpecs.notes ? `Notes: ${book.printSpecs.notes}` : null,
          "",
          "Ship to:",
          customerName,
          addressBlock,
          `Phone: ${customerPhone}`,
        ]
          .filter((line): line is string => line !== null)
          .join("\n"),
      });
      if (error) {
        emailStatus.printer = "failed";
        console.error(`Order ${reference}: printer email failed to send:`, error);
      } else {
        emailStatus.printer = "sent";
      }
    } catch (err) {
      emailStatus.printer = "failed";
      console.error(`Order ${reference}: printer email threw:`, err);
    }
  }

  // The printer is the one who actually ships, so their notification not going out means a paid order that nobody is producing — worth its own unmissable line rather than being buried among the per-send logs above.
  if (format === "paperback" && emailStatus.printer !== "sent") {
    console.error(
      `ACTION REQUIRED — order ${reference} ("${book.title}", ${formatNaira(priceNaira)}) was paid for but the printer was NOT notified (${emailStatus.printer}). Forward this order to the printer manually.`,
    );
  }

  await markOrderFulfilled(reference, {
    reference,
    bookId: book.id,
    bookTitle: book.title,
    format,
    priceNaira,
    currency: CURRENCY,
    customerName,
    customerEmail,
    customerPhone,
    address,
    emailStatus,
  });

  return NextResponse.json({ ok: true });
}
