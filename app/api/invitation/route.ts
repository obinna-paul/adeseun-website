import { NextResponse } from "next/server";
import { Resend } from "resend";
import { INTERESTS, type Interest } from "@/components/sections/invitation/invitation-content";

/**
 * Backend for The Reception's contact form (InvitationForm.tsx), which
 * previously only simulated a submission with a setTimeout — nothing was
 * ever sent anywhere. This sends every submission to her inbox via Resend,
 * with the submitter set as reply-to so she can respond directly from
 * her own email client.
 *
 * TO_EMAIL is not the site's own domain — Resend's shared dev sender
 * (onboarding@resend.dev) can only deliver to the Resend account's own
 * verified address until a sending domain is verified on that account.
 * Once one is, swap the `from` below for something like
 * "The Reception <hello@adeseunoyeneye.com>" so the message doesn't
 * arrive from a resend.dev address.
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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set — cannot send invitation emails.");
    return NextResponse.json({ error: "Email is not configured yet. Please try again later." }, { status: 500 });
  }

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

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "The Reception <onboarding@resend.dev>",
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

  return NextResponse.json({ ok: true });
}
