import { NextResponse } from "next/server";
import { fulfillOrder, OrderConfirmationError } from "@/lib/order-fulfillment";
import { PaystackNotConfiguredError, verifyWebhookSignature } from "@/lib/paystack";

/**
 * Paystack's signed server-to-server confirmation. The same fulfillment
 * service is also called when the buyer returns from Paystack, which makes
 * the customer path resilient to a delayed or incorrectly configured webhook.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  let signatureValid: boolean;
  try {
    signatureValid = verifyWebhookSignature(rawBody, signature);
  } catch (error) {
    if (error instanceof PaystackNotConfiguredError) {
      console.error(error.message);
      return NextResponse.json({ error: "Payments are not set up yet." }, { status: 500 });
    }
    throw error;
  }

  if (!signatureValid) {
    console.error("Paystack webhook: invalid signature. Ignoring the event.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    return NextResponse.json({ ok: true });
  }

  const reference = String(event.data?.reference ?? "");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  try {
    const result = await fulfillOrder(reference);
    if (result.state === "pending") {
      console.error(`Paystack webhook: ${reference} verified as ${result.paymentStatus}, not success.`);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof OrderConfirmationError) {
      console.error(`Paystack webhook: ${reference} could not be fulfilled (${error.code}):`, error.message);

      // Temporary publication/storage failures should be retried. Permanent
      // order-validation failures need manual review and should not create an
      // endless Paystack retry loop.
      if (error.code === "ebook_unavailable") {
        return NextResponse.json({ error: error.message }, { status: error.status });
      }
      return NextResponse.json({ ok: true, requiresReview: true });
    }

    if (error instanceof PaystackNotConfiguredError) {
      console.error(error.message);
      return NextResponse.json({ error: "Payments are not set up yet." }, { status: 500 });
    }

    console.error(`Paystack webhook: ${reference} fulfillment failed:`, error);
    return NextResponse.json({ error: "Could not fulfill the order yet." }, { status: 500 });
  }
}
