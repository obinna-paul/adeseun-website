import { NextResponse } from "next/server";
import { BOOKS, CURRENCY } from "@/components/sections/library/library-content";
import { initializeTransaction, PaystackNotConfiguredError } from "@/lib/paystack";
import { createPendingOrder } from "@/lib/orders";

/**
 * Starts a book purchase: looks up the book's (currently placeholder —
 * see library-content.ts) price, opens a Paystack transaction for it,
 * and hands back the hosted payment page URL to redirect the customer
 * to. This never touches card details itself — Paystack's own page
 * collects those. Fulfillment (the three order emails) does NOT happen
 * here; it only happens once Paystack confirms payment via webhook (see
 * app/api/paystack/webhook/route.ts) — this route only ever *starts* a
 * transaction, it can't know yet whether the customer actually pays.
 */

type CheckoutPayload = {
  bookId?: unknown;
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

export async function POST(request: Request) {
  let body: CheckoutPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const bookId = asTrimmedString(body.bookId);
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const address = {
    line1: asTrimmedString(body.address?.line1),
    city: asTrimmedString(body.address?.city),
    state: asTrimmedString(body.address?.state),
  };

  if (!name || !email || !phone || !address.line1 || !address.city || !address.state) {
    return NextResponse.json({ error: "Name, email, phone, and a full delivery address are required." }, { status: 400 });
  }

  const book = BOOKS.find((b) => b.id === bookId);
  if (!book) {
    return NextResponse.json({ error: "That book couldn't be found." }, { status: 404 });
  }

  const origin = new URL(request.url).origin;

  try {
    const transaction = await initializeTransaction({
      email,
      amountNaira: book.price,
      currency: CURRENCY,
      callbackUrl: `${origin}/checkout/thank-you`,
      metadata: {
        bookId: book.id,
        bookTitle: book.title,
        customerName: name,
        customerPhone: phone,
        address,
      },
    });

    // Best-effort — see lib/orders.ts's own comment on why this never blocks checkout.
    await createPendingOrder({
      reference: transaction.reference,
      bookId: book.id,
      bookTitle: book.title,
      priceNaira: book.price,
      currency: CURRENCY,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address,
    });

    return NextResponse.json({ authorizationUrl: transaction.authorizationUrl });
  } catch (err) {
    if (err instanceof PaystackNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Payments are not set up yet. Please try again later." }, { status: 500 });
    }
    console.error("Paystack initialize failed:", err);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}
