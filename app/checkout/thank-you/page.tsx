import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Order received", path: "/checkout/thank-you", noIndex: true });

/**
 * Paystack's callback_url — reached after the customer finishes on
 * Paystack's hosted page, whether the charge actually succeeded or not.
 * This is deliberately generic and never claims the order is confirmed:
 * the real confirmation is the webhook-triggered email (see
 * app/api/paystack/webhook/route.ts), which is the only thing this site
 * trusts to mean payment succeeded. Someone who abandoned payment and
 * lands here anyway just sees a reassuring, non-committal message
 * instead of a false "you're all set."
 */
export default function CheckoutThankYouPage() {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-[70vh] flex-col items-center justify-center bg-surface px-gutter py-room text-center">
      <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">Thank you.</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-text-subdued">
        If your payment went through, a confirmation email is on its way to you now. If you don&rsquo;t see it shortly,
        check your spam folder before reaching out.
      </p>
      <Link
        href="/books"
        className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-gold-ink underline decoration-gold-ink/40 underline-offset-4 transition-colors duration-150 ease-gallery-standard hover:text-text"
      >
        Back to The Library
      </Link>
    </main>
  );
}
