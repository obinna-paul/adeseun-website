"use client";

import { useState, type FormEvent } from "react";
import { FloatingField } from "@/components/sections/invitation/FloatingField";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Collects delivery details and starts a Paystack transaction — reuses
 * FloatingField from the Reception's contact form rather than a second
 * copy of the same floating-label input, since the visual language and
 * behavior (grows for the textarea, floats on focus/content) are
 * identical here. Nigeria-only address (line 1 / city / state as plain
 * text, no country field) per direct instruction — see
 * app/api/checkout/route.ts's own comment.
 *
 * On submit: POST to /api/checkout, then a full page redirect
 * (`window.location.href`, not client-side routing) to Paystack's own
 * hosted payment page — that's `authorizationUrl` from the response.
 * We never collect card details ourselves. If checkout can't even be
 * started (Paystack not configured yet, book not found, etc.), the
 * error from that POST is shown in place rather than redirecting to a
 * dead end.
 */
export function CheckoutForm({ bookId }: { bookId: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: {
            line1: formData.get("addressLine1"),
            city: formData.get("city"),
            state: formData.get("state"),
          },
        }),
      });

      const data: { authorizationUrl?: string; error?: string } = await response.json().catch(() => ({}));

      if (!response.ok || !data.authorizationUrl) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <FloatingField label="Full name" name="name" required autoComplete="name" />
        <FloatingField label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <FloatingField label="Phone number" name="phone" type="tel" required autoComplete="tel" />
      <FloatingField label="Delivery address" name="addressLine1" required autoComplete="address-line1" />
      <div className="grid gap-9 sm:grid-cols-2">
        <FloatingField label="City" name="city" required autoComplete="address-level2" />
        <FloatingField label="State" name="state" required autoComplete="address-level1" />
      </div>
      <div>
        <MagneticButton type="submit" variant="primary" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Redirecting to Paystack…" : "Proceed to payment"}
        </MagneticButton>
        {status === "error" && errorMessage && <p className="mt-3 text-sm text-garnet">{errorMessage}</p>}
      </div>
    </form>
  );
}
