"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { FloatingField } from "./FloatingField";
import { InterestRadioGroup } from "./InterestRadioGroup";
import { ConfettiBurst } from "./ConfettiBurst";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { SUCCESS_HEADLINE, SUCCESS_BODY, type Interest } from "./invitation-content";

type Status = "idle" | "submitting" | "success";

export function InvitationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [interest, setInterest] = useState<Interest | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // No backend is wired up yet — this simulates the round trip so the
    // success state (confetti + thank-you) can be built and reviewed.
    // Swap for a real POST to an API route (e.g. via Resend, or a form
    // service) once one exists; the UI below doesn't need to change.
    window.setTimeout(() => setStatus("success"), 900);
  }

  if (status === "success") {
    return (
      <div className="relative flex min-h-[26rem] flex-col items-center justify-center text-center">
        {!reducedMotion && <ConfettiBurst active />}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="font-display text-5xl italic text-text sm:text-6xl">{SUCCESS_HEADLINE}</p>
          {/* A hand-drawn flourish, not a new script font — see the doc
              comment on why introducing a fourth typeface for one moment
              would break the site's type-system discipline. */}
          <svg width="130" height="16" viewBox="0 0 130 16" className="mx-auto mt-2 text-gold" aria-hidden="true">
            <path
              d="M2 10c22-10 44-10 63-4s42 6 63-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="mx-auto mt-6 max-w-sm text-lg text-text-subdued">{SUCCESS_BODY}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-9">
      <div className="grid gap-9 sm:grid-cols-2">
        <FloatingField label="Full name" name="name" required autoComplete="name" />
        <FloatingField label="Email" name="email" type="email" required autoComplete="email" />
      </div>
      <FloatingField label="Organization (optional)" name="organization" autoComplete="organization" />
      <InterestRadioGroup value={interest} onValueChange={setInterest} />
      <FloatingField label="Your message" name="message" required multiline />
      <div>
        <MagneticButton type="submit" variant="primary" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Sending…" : "Send the Invitation"}
        </MagneticButton>
      </div>
    </form>
  );
}
