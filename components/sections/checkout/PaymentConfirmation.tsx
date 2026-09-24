"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatNaira } from "@/lib/utils";

type ConfirmedOrder = {
  reference: string;
  bookId: string;
  bookTitle: string;
  format: "ebook" | "paperback";
  priceNaira: number;
  currency: string;
  maskedEmail: string;
};

type ConfirmationState =
  | { status: "verifying"; reference: string | null }
  | { status: "missing" }
  | { status: "pending"; reference: string; message: string }
  | { status: "error"; reference: string | null; message: string }
  | {
      status: "confirmed";
      order: ConfirmedOrder;
      emailStatus: "sent" | "failed" | "skipped";
      fulfillmentStatus: "complete" | "processing";
      sessionReady: boolean;
    };

type ConfirmationResponse = {
  state?: "confirmed" | "pending";
  reference?: string;
  message?: string;
  error?: string;
  order?: ConfirmedOrder;
  emailStatus?: "sent" | "failed" | "skipped";
  fulfillmentStatus?: "complete" | "processing";
  sessionReady?: boolean;
};

const STORED_REFERENCE_KEY = "adeseun_checkout_reference";

export function PaymentConfirmation({ initialReference }: { initialReference: string | null }) {
  const [state, setState] = useState<ConfirmationState>({
    status: "verifying",
    reference: initialReference,
  });
  const requestId = useRef(0);

  const confirmPayment = useCallback(async (reference: string) => {
    const currentRequest = ++requestId.current;
    await Promise.resolve();
    if (currentRequest !== requestId.current) return;
    setState({ status: "verifying", reference });

    try {
      const response = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = (await response.json().catch(() => ({}))) as ConfirmationResponse;
      if (currentRequest !== requestId.current) return;

      if (response.status === 202 || data.state === "pending") {
        setState({
          status: "pending",
          reference,
          message: data.message ?? "Paystack has not confirmed this payment yet.",
        });
        return;
      }

      if (!response.ok || data.state !== "confirmed" || !data.order) {
        throw new Error(data.error ?? "We could not confirm the payment right now.");
      }

      sessionStorage.removeItem(STORED_REFERENCE_KEY);
      setState({
        status: "confirmed",
        order: data.order,
        emailStatus: data.emailStatus ?? "skipped",
        fulfillmentStatus: data.fulfillmentStatus ?? "processing",
        sessionReady: data.sessionReady === true,
      });
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setState({
        status: "error",
        reference,
        message: error instanceof Error ? error.message : "We could not confirm the payment right now.",
      });
    }
  }, []);

  useEffect(() => {
    const reference = initialReference ?? sessionStorage.getItem(STORED_REFERENCE_KEY);
    const timer = window.setTimeout(() => {
      if (reference) {
        void confirmPayment(reference);
      } else {
        setState({ status: "missing" });
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [confirmPayment, initialReference]);

  if (state.status === "verifying") {
    return (
      <ConfirmationShell>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-emerald-ink">Checking with Paystack</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          Confirming your payment.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-subdued" role="status" aria-live="polite">
          Keep this page open for a moment. We are verifying the payment and preparing your order.
        </p>
        {state.reference && <Reference value={state.reference} />}
      </ConfirmationShell>
    );
  }

  if (state.status === "confirmed") {
    const isEbook = state.order.format === "ebook";
    return (
      <ConfirmationShell>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-emerald-ink">Payment confirmed</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          {isEbook && state.sessionReady ? "Your book is ready." : "Your order is confirmed."}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-subdued">
          {isEbook && state.sessionReady
            ? `${state.order.bookTitle} is now in your private reading room. This device has been signed in for you.`
            : isEbook
              ? `${state.order.bookTitle} is now in your private reading room. Use the private email link to sign in.`
            : `${state.order.bookTitle} is being prepared for delivery.`}
        </p>

        <dl className="mt-9 grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-text-faint">Amount paid</dt>
            <dd className="mt-2 font-display text-2xl font-semibold text-text">
              {formatNaira(state.order.priceNaira)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-text-faint">Payment reference</dt>
            <dd className="mt-2 break-all font-mono text-sm text-text">{state.order.reference}</dd>
          </div>
        </dl>

        <div className="mt-8 max-w-xl border-t border-line-whisper pt-6 text-sm leading-relaxed text-text-subdued">
          {state.emailStatus === "sent" ? (
            <p>A confirmation and private sign-in link were sent to {state.order.maskedEmail}.</p>
          ) : state.emailStatus === "failed" ? (
            <p role="alert" className="text-garnet">
              {state.sessionReady
                ? "Your payment and access are secure, but the email could not be sent. Use the button below now. You can request a fresh sign-in link later."
                : "Your payment is secure, but the sign-in email could not be sent. Try My e-books again shortly or contact The Library with the payment reference below."}
            </p>
          ) : (
            <p>
              Your order is confirmed. The email notification is still being prepared, but you can continue now.
            </p>
          )}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-5">
          <Link
            href={isEbook && state.sessionReady ? `/read/${state.order.bookId}` : isEbook ? "/read" : "/books"}
            className="rounded-control bg-emerald-fill px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-text-on-dark transition-colors duration-150 ease-gallery-standard hover:bg-emerald-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
          >
            {isEbook && state.sessionReady
              ? "Start reading"
              : isEbook
                ? "Open My e-books"
                : "Return to The Library"}
          </Link>
          {isEbook && (
            <Link
              href="/read"
              className="font-mono text-xs uppercase tracking-[0.12em] text-gold-ink underline decoration-gold-ink/40 underline-offset-4 transition-colors duration-150 ease-gallery-standard hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
            >
              View my e-books
            </Link>
          )}
        </div>
      </ConfirmationShell>
    );
  }

  if (state.status === "pending") {
    return (
      <ConfirmationShell>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-gold-ink">Confirmation pending</p>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          Paystack is still processing this payment.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-subdued" role="status" aria-live="polite">
          {state.message} If you completed the charge, wait a moment and check again. You will not be charged twice.
        </p>
        <Reference value={state.reference} />
        <ConfirmationActions onRetry={() => void confirmPayment(state.reference)} />
      </ConfirmationShell>
    );
  }

  return (
    <ConfirmationShell>
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-garnet">Confirmation needs attention</p>
      <h1 className="mt-4 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
        We could not confirm this payment yet.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-subdued" role="alert" aria-live="assertive">
        {state.status === "missing"
          ? "The Paystack reference was missing from the return link. If you completed payment, open My e-books and use the same purchase email to recover access."
          : state.message}
      </p>
      {state.status === "error" && state.reference && <Reference value={state.reference} />}
      <ConfirmationActions
        onRetry={
          state.status === "error" && state.reference ? () => void confirmPayment(state.reference!) : undefined
        }
      />
    </ConfirmationShell>
  );
}

function ConfirmationShell({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-[78dvh] bg-surface-sunken px-gutter py-room">
      <div className="mx-auto max-w-frame-narrow">{children}</div>
    </main>
  );
}

function Reference({ value }: { value: string }) {
  return (
    <p className="mt-8 max-w-xl border-t border-line pt-5 text-sm text-text-subdued">
      Payment reference <span className="ml-2 break-all font-mono text-text">{value}</span>
    </p>
  );
}

function ConfirmationActions({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-5">
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-control bg-emerald-fill px-5 py-3 font-mono text-xs uppercase tracking-[0.12em] text-text-on-dark transition-colors duration-150 ease-gallery-standard hover:bg-emerald-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
        >
          Check payment again
        </button>
      )}
      <Link
        href="/read"
        className="font-mono text-xs uppercase tracking-[0.12em] text-gold-ink underline decoration-gold-ink/40 underline-offset-4 transition-colors duration-150 ease-gallery-standard hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
      >
        Open My e-books
      </Link>
      <a
        href="mailto:order@adeseunoyeneye.com"
        className="font-mono text-xs uppercase tracking-[0.12em] text-text-subdued underline decoration-line underline-offset-4 transition-colors duration-150 ease-gallery-standard hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
      >
        Contact The Library
      </a>
    </div>
  );
}
