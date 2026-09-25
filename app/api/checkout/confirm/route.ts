import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CHECKOUT_INTENT_COOKIE } from "@/lib/checkout-intent";
import { maskReaderEmail } from "@/lib/ebooks";
import { fulfillOrder, OrderConfirmationError } from "@/lib/order-fulfillment";
import { PaystackNotConfiguredError } from "@/lib/paystack";
import { setReaderSession } from "@/lib/reader-auth";

type ConfirmPayload = {
  reference?: unknown;
};

export async function POST(request: Request) {
  let body: ConfirmPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const reference = typeof body.reference === "string" ? body.reference.trim() : "";

  try {
    const result = await fulfillOrder(reference);
    if (result.state === "pending") {
      return NextResponse.json(
        {
          state: "pending",
          reference: result.reference,
          paymentStatus: result.paymentStatus,
          message: "Paystack has not confirmed this payment yet.",
        },
        { status: 202 },
      );
    }

    const cookieStore = await cookies();
    const checkoutMatches = cookieStore.get(CHECKOUT_INTENT_COOKIE)?.value === result.order.reference;
    const sessionReady = result.order.format === "ebook" && checkoutMatches;

    if (sessionReady) {
      await setReaderSession(result.order.customerEmail, result.order.customerName);
    }
    if (checkoutMatches) {
      cookieStore.delete(CHECKOUT_INTENT_COOKIE);
    }

    return NextResponse.json({
      state: "confirmed",
      order: {
        reference: result.order.reference,
        bookId: result.order.bookId,
        bookTitle: result.order.bookTitle,
        format: result.order.format,
        priceNaira: result.order.priceNaira,
        quantity: result.order.quantity,
        totalNaira: result.order.totalNaira,
        currency: result.order.currency,
        maskedEmail: maskReaderEmail(result.order.customerEmail),
      },
      emailStatus: result.emailStatus.customer,
      fulfillmentStatus: result.fulfillmentStatus,
      sessionReady,
    });
  } catch (error) {
    if (error instanceof OrderConfirmationError) {
      return NextResponse.json(
        { error: error.message, code: error.code, reference },
        { status: error.status },
      );
    }

    if (error instanceof PaystackNotConfiguredError) {
      console.error(error.message);
      return NextResponse.json({ error: "Payment confirmation is not configured yet." }, { status: 503 });
    }

    console.error(`Checkout confirmation failed for ${reference || "missing reference"}:`, error);
    return NextResponse.json(
      { error: "We could not confirm the payment right now. Please try again." },
      { status: 502 },
    );
  }
}
