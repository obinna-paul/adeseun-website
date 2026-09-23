"use client";

import { useState, type FormEvent } from "react";
import { FloatingField } from "@/components/sections/invitation/FloatingField";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ReaderAccessForm({ nextPath = "/read" }: { nextPath?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reader/access/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), nextPath }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not send a sign-in link.");
      setStatus("success");
      setMessage(data.message ?? "Check your email for a private sign-in link.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not send a sign-in link.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-md">
      <FloatingField label="Purchase email" name="email" type="email" required autoComplete="email" />
      <div className="mt-6">
        <MagneticButton type="submit" variant="primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending link…" : "Email my sign-in link"}
        </MagneticButton>
      </div>
      <p
        aria-live="polite"
        className={`mt-4 min-h-6 text-sm leading-relaxed ${status === "error" ? "text-garnet" : "text-text-subdued"}`}
      >
        {message}
      </p>
    </form>
  );
}
