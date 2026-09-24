import { NextResponse } from "next/server";
import { BOOKS, CURRENCY } from "@/components/sections/library/library-content";
import { CHECKOUT_INTENT_COOKIE, CHECKOUT_INTENT_SECONDS } from "@/lib/checkout-intent";
import { initializeTransaction, PaystackNotConfiguredError } from "@/lib/paystack";
import { createPendingOrder } from "@/lib/orders";
import { getEbookPublication } from "@/lib/ebooks";
import type { BookFormat } from "@/lib/ebook-types";

/**
 * Starts a book purchase: looks up the book's (currently placeholder —
 * see library-content.ts) price, opens a Paystack transaction for it,
 * and hands back the hosted payment page URL to redirect the customer
 * to. This never touches card details itself. Paystack's own page
 * collects those. This route only starts a transaction; fulfillment is
 * performed after a server-side verification by either the signed webhook
 * or the customer's verified return callback.
 */

type CheckoutPayload = {
  bookId?: unknown;
  format?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: {
    line1?: unknown;
    city?: unknown;
    state?: unknown;
  };
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Where Paystack sends the customer back to after paying. Deliberately
 * NOT derived from the `Origin` header — that's fully caller-controlled,
 * and feeding it to Paystack as a redirect target would let anyone
 * bounce a paying customer to a site of their choosing. `request.url`'s
 * host comes from the platform rather than the request body, but its
 * *protocol* can arrive as plain http behind a proxy even on an https
 * deployment, which would hand Paystack a callback the customer can't
 * reach — hence forcing https for anything that isn't local dev.
 *
 * NEXT_PUBLIC_SITE_URL overrides both, for when the canonical domain
 * differs from whatever host the request happened to come in on.
 */
function resolveOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");

  const url = new URL(request.url);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  return isLocal ? url.origin : `https://${url.host}`;
}

export async function POST(request: Request) {
  let body: CheckoutPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const bookId = asTrimmedString(body.bookId);
  const requestedFormat = asTrimmedString(body.format);
  const format: BookFormat = requestedFormat === "ebook" ? "ebook" : "paperback";
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const address = {
    line1: asTrimmedString(body.address?.line1),
    city: asTrimmedString(body.address?.city),
    state: asTrimmedString(body.address?.state),
  };

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  if (format === "paperback" && (!phone || !address.line1 || !address.city || !address.state)) {
    return NextResponse.json(
      { error: "Phone and a full delivery address are required for a paperback." },
      { status: 400 },
    );
  }

  const book = BOOKS.find((candidate) => candidate.id === bookId);
  const ebookPublication = await getEbookPublication(bookId);
  const standaloneEbook = !book && ebookPublication?.standalone && ebookPublication.manifestKey;
  if (!book && !standaloneEbook) {
    return NextResponse.json({ error: "That book couldn't be found." }, { status: 404 });
  }

  if (format === "paperback" && !book) {
    return NextResponse.json({ error: "This title is available only as an e-book." }, { status: 409 });
  }
  if (format === "ebook" && !ebookPublication?.manifestKey) {
    return NextResponse.json({ error: "The e-book is not available yet." }, { status: 409 });
  }

  const title = ebookPublication?.title?.trim() || book?.title || "Untitled e-book";
  const priceNaira = format === "ebook" ? ebookPublication!.priceNaira : book!.price;

  const origin = resolveOrigin(request);

  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: priceNaira,
      currency: CURRENCY,
      callbackUrl: `${origin}/checkout/thank-you?format=${format}`,
      metadata: {
        bookId,
        bookTitle: title,
        format,
        priceNaira,
        customerName: name,
        customerPhone: phone,
        address,
      },
    });

    // Best-effort — see lib/orders.ts's own comment on why this never blocks checkout.
    await createPendingOrder({
      reference: transaction.reference,
      bookId,
      bookTitle: title,
      format,
      priceNaira,
      currency: CURRENCY,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address,
    });

    const response = NextResponse.json({
      authorizationUrl: transaction.authorizationUrl,
      reference: transaction.reference,
    });
    response.cookies.set(CHECKOUT_INTENT_COOKIE, transaction.reference, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CHECKOUT_INTENT_SECONDS,
    });
    return response;
  } catch (err) {
    if (err instanceof PaystackNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Payments are not set up yet. Please try again later." }, { status: 500 });
    }
    console.error("Paystack initialize failed:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
