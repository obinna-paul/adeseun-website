import { NextResponse } from "next/server";
import {
  canSendReaderAccessEmail,
  createReaderAccessToken,
  getReaderBookIds,
  normalizeEmail,
  releaseReaderAccessEmailRateLimit,
} from "@/lib/ebooks";
import { fulfillOrder } from "@/lib/order-fulfillment";
import { findRecentSuccessfulTransactionReferences } from "@/lib/paystack";
import { sendEmail, EmailNotConfiguredError, FROM_ADDRESS } from "@/lib/resend";
import { RedisNotConfiguredError } from "@/lib/redis";

type AccessRequest = {
  email?: unknown;
  nextPath?: unknown;
};

function safeNextPath(value: unknown): string {
  return typeof value === "string" && value.startsWith("/read") && !value.startsWith("//") ? value : "/read";
}

function siteUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  const url = new URL(request.url);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  return isLocal ? url.origin : `https://${url.host}`;
}

export async function POST(request: Request) {
  let body: AccessRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = normalizeEmail(typeof body.email === "string" ? body.email : "");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter the email used for your purchase." }, { status: 400 });
  }

  try {
    const canSend = await canSendReaderAccessEmail(email);
    if (!canSend) {
      return NextResponse.json({
        ok: true,
        message: "If that email has an e-book purchase, a private sign-in link is on its way.",
      });
    }

    let bookIds = await getReaderBookIds(email);
    let recoveryEmailSent = false;

    // If the payment webhook never granted the entitlement, reconcile this
    // email against Paystack's successful transactions. Every candidate is
    // independently verified inside fulfillOrder before access is granted.
    if (bookIds.length === 0) {
      const references = await findRecentSuccessfulTransactionReferences(email);
      const recoveries = await Promise.allSettled(references.map((reference) => fulfillOrder(reference)));

      recoveryEmailSent = recoveries.some(
        (recovery) =>
          recovery.status === "fulfilled" &&
          recovery.value.state === "confirmed" &&
          recovery.value.order.format === "ebook" &&
          recovery.value.order.customerEmail === email &&
          recovery.value.emailStatus.customer === "sent",
      );
      bookIds = await getReaderBookIds(email);
    }

    // Always return the same public response so this endpoint cannot be
    // used to discover whether an email address has purchased a book.
    if (bookIds.length > 0 && !recoveryEmailSent) {
      const token = await createReaderAccessToken({ email, nextPath: safeNextPath(body.nextPath) });
      const link = `${siteUrl(request)}/api/reader/access/${encodeURIComponent(token)}`;
      const { error } = await sendEmail({
        from: FROM_ADDRESS.library,
        to: email,
        subject: "Your private Library sign-in link",
        text: [
          "Use this private link to open your e-book library:",
          "",
          link,
          "",
          "The link expires in 15 minutes. You can request another whenever you need it.",
        ].join("\n"),
      });
      if (error) {
        console.error("Reader access email failed:", error);
        await releaseReaderAccessEmailRateLimit(email).catch(() => undefined);
        return NextResponse.json(
          { error: "We could not send the sign-in email right now. Please try again." },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({
      ok: true,
      message: "If that email has an e-book purchase, a private sign-in link is on its way.",
    });
  } catch (err) {
    await releaseReaderAccessEmailRateLimit(email).catch(() => undefined);
    if (err instanceof RedisNotConfiguredError || err instanceof EmailNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Reader access is not configured yet." }, { status: 503 });
    }
    console.error("Reader access request failed:", err);
    return NextResponse.json({ error: "Could not send a sign-in link. Please try again." }, { status: 500 });
  }
}
