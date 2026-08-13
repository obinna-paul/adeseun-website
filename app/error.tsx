"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-segment error boundary — there wasn't one anywhere in the app
 * before this. Without it, an uncaught render/hydration error on any
 * page had no defined fallback: Next just stops rendering that segment,
 * which can look like a blank page with nothing to recover from short
 * of a manual reload (reported real-world behavior on The Library and
 * The Screening Room that couldn't be reproduced locally — this doesn't
 * fix whatever the underlying trigger is, but it turns "blank, reload a
 * few times" into "a real message with a working retry button" for
 * whatever does throw, here or on any other page).
 *
 * `reset()` re-renders the segment in place without a full navigation —
 * the first thing worth trying, since most causes (a flaky fetch, a
 * transient state issue) don't need a hard reload to clear.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 bg-ground px-gutter py-room text-center text-text"
    >
      <div className="flex max-w-prose-gallery flex-col items-center">
        <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
          Something didn&rsquo;t load right.
        </h1>
        <p className="mt-4 max-w-md text-lg text-text-subdued">
          This page ran into a problem rendering. Try again, or head back to the Foyer.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-control bg-gold-fill px-8 py-3.5 font-mono text-sm text-text-on-dark shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-shadow duration-150 ease-gallery-out hover:shadow-glow-gold active:scale-[0.97]"
        >
          Try again
        </button>
        <Link
          href="/"
          data-cursor="link"
          className="rounded-control border border-line-standard px-8 py-3.5 font-mono text-sm text-text transition-colors duration-150 ease-gallery-standard hover:border-gold"
        >
          Return to the Foyer
        </Link>
      </div>
    </main>
  );
}
