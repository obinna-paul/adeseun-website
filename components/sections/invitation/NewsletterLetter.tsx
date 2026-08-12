"use client";

import { useState, type FormEvent } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { FloatingField } from "./FloatingField";
import { NEWSLETTER_HEADLINE, NEWSLETTER_BODY } from "./invitation-content";

/**
 * Deliberately the quiet sibling of InvitationForm's success moment —
 * one confetti burst per page is the celebratory beat; a second one
 * here for a newsletter signup would cheapen both. A single settled
 * line is the right amount of feedback for "you're on the list."
 */
export function NewsletterLetter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No mailing-list backend wired up yet — see InvitationForm's
    // matching comment; same placeholder reasoning applies here.
    setSubscribed(true);
  }

  return (
    <div className="rounded-frame border border-line-whisper bg-surface-elevated p-8 shadow-elevation-card sm:p-10">
      <p className="font-display text-2xl italic text-text sm:text-3xl">{NEWSLETTER_HEADLINE}</p>
      <p className="mt-3 max-w-sm text-text-subdued">{NEWSLETTER_BODY}</p>

      {subscribed ? (
        <p className="mt-6 font-display text-lg italic text-gold-ink">You&rsquo;re on the list.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <FloatingField label="Email" name="newsletter-email" type="email" required autoComplete="email" />
          </div>
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-start rounded-full border border-line text-text-subdued transition-colors duration-150 ease-gallery-standard hover:border-gold hover:text-gold-ink sm:self-auto"
          >
            <PaperPlaneTilt size={18} weight="light" />
          </button>
        </form>
      )}
    </div>
  );
}
