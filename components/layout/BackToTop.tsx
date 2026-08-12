"use client";

import { useLenis } from "@/components/scroll/SmoothScroll";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * "A tiny ring that circles a dot": a fixed center dot with a small
 * satellite dot orbiting it, at rest only on hover/focus — an idle,
 * always-looping animation in a footer would be exactly the kind of
 * "infinite loop nobody asked for" taste-skill warns against, but a
 * hover-gated one is motivated feedback (emil-design-eng: hover = state
 * indication) and doubles as the "ascending" cue via the lift on hover.
 *
 * Scrolls through Lenis (see SmoothScroll's own context), not
 * `window.scrollTo`, so it eases with the same curve as the rest of the
 * site's scrolling rather than fighting it — falls back to an instant
 * jump when Lenis is off (reduced motion), per the documented
 * no-competing-smooth-scroll constraint in globals.css.
 */
export function BackToTop() {
  const lenis = useLenis();
  const reducedMotion = usePrefersReducedMotion();

  function handleClick() {
    if (lenis) {
      lenis.scrollTo(0, reducedMotion ? { immediate: true } : { duration: 1.4 });
    } else {
      window.scrollTo(0, 0);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex h-11 w-11 items-center justify-center transition-transform duration-300 ease-gallery-out hover:-translate-y-1.5"
      aria-label="Back to top"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
      {!reducedMotion && (
        <span
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:animate-[spin_2.4s_linear_infinite] group-focus-visible:animate-[spin_2.4s_linear_infinite]"
        >
          <span className="absolute left-1/2 top-0 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
        </span>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-current/25"
      />
    </button>
  );
}
