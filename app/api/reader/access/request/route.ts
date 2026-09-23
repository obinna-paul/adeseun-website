import { NextResponse } from "next/server";
import {
  canSendReaderAccessEmail,
  createReaderAccessToken,
  getReaderBookIds,
  normalizeEmail,
} from "@/lib/ebooks";
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
    const [bookIds, canSend] = await Promise.all([getReaderBookIds(email), canSendReaderAccessEmail(email)]);

    // Always return the same public response so this endpoint cannot be
    // used to discover whether an email address has purchased a book.
    if (bookIds.length > 0 && canSend) {
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
      if (error) console.error("Reader access email failed:", error);
    }

    return NextResponse.json({
      ok: true,
      message: "If that email has an e-book purchase, a private sign-in link is on its way.",
    });
  } catch (err) {
    if (err instanceof RedisNotConfiguredError || err instanceof EmailNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Reader access is not configured yet." }, { status: 503 });
    }
    console.error("Reader access request failed:", err);
    return NextResponse.json({ error: "Could not send a sign-in link. Please try again." }, { status: 500 });
  }
}
