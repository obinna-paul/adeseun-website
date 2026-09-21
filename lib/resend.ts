import { Resend } from "resend";

/**
 * Shared Resend client + a `sendEmail` wrapper. Every route that sends
 * mail — the contact form, and the three order emails a paid checkout
 * fires (customer/her/printer) — needs the same "fail closed with a
 * clear error if RESEND_API_KEY isn't set" behavior; this is that
 * behavior in one place instead of repeated per route (it used to live
 * only in app/api/invitation/route.ts).
 */

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("RESEND_API_KEY is not set — email is not configured.");
    this.name = "EmailNotConfiguredError";
  }
}

let client: Resend | null = null;

function getClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new EmailNotConfiguredError();
  if (!client) client = new Resend(apiKey);
  return client;
}

export type SendEmailInput = {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

/**
 * Throws `EmailNotConfiguredError` if RESEND_API_KEY is missing —
 * callers should catch that specifically to return a clear "not
 * configured" response. A genuine Resend delivery failure is returned
 * as `{ error }` instead of thrown, so a caller sending several emails
 * for one event (see the checkout webhook) can let one recipient's
 * failure not block the others.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ error: unknown }> {
  const resend = getClient();
  const { error } = await resend.emails.send({
    from: input.from,
    to: input.to,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
  });
  return { error };
}

/**
 * Resend's shared dev sender — can only deliver to the Resend account's
 * own verified address until a sending domain is verified on that
 * account. Swap for something like "hello@adeseunoyeneye.com" once one
 * is verified; see app/api/invitation/route.ts's own note.
 */
export const FROM_ADDRESS = {
  reception: "The Reception <onboarding@resend.dev>",
  library: "The Library <onboarding@resend.dev>",
} as const;
