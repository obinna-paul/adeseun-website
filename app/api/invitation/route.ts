import { NextResponse } from "next/server";
import { INTERESTS, type Interest } from "@/components/sections/invitation/invitation-content";
import { sendEmail, EmailNotConfiguredError, FROM_ADDRESS } from "@/lib/resend";

/**
 * Backend for The Reception's contact form (InvitationForm.tsx), which
 * previously only simulated a submission with a setTimeout — nothing was
 * ever sent anywhere. This sends every submission to her inbox via Resend,
 * with the submitter set as reply-to so she can respond directly from
 * her own email client. Email sending itself lives in lib/resend.ts,
 * shared with the checkout order emails (app/api/paystack/webhook).
 */
const TO_EMAIL = "adeseun05@gmail.com";

type InvitationPayload = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  interest?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: InvitationPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const organization = asTrimmedString(body.organization);
  const message = asTrimmedString(body.message);
  const interest = INTERESTS.includes(body.interest as Interest) ? (body.interest as Interest) : null;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  try {
    const { error } = await sendEmail({
      from: FROM_ADDRESS.reception,
      to: TO_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${interest ? ` — ${interest}` : ""}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        organization ? `Organization: ${organization}` : null,
        interest ? `Interested in: ${interest}` : null,
        "",
        message,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json({ error: "Could not send your message. Please try again." }, { status: 502 });
    }
  } catch (err) {
    if (err instanceof EmailNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json({ error: "Email is not configured yet. Please try again later." }, { status: 500 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
