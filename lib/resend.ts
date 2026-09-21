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
 * adeseunoyeneye.com is verified in Resend (per direct instruction), so
 * both senders now live on it — this replaces the earlier
 * `onboarding@resend.dev` shared dev sender, which could only ever
 * deliver to the Resend account's own address and would have silently
 * rejected mail to a paying customer or the printer. `order@` for both,
 * also per direct instruction, rather than splitting reception/library
 * onto separate addresses — easy to split later if that's ever wanted.
 */
export const FROM_ADDRESS = {
  reception: "The Reception <order@adeseunoyeneye.com>",
  library: "The Library <order@adeseunoyeneye.com>",
} as const;
