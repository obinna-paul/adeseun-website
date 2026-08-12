"use client";

import { motion } from "motion/react";
import { useLenis } from "@/components/scroll/SmoothScroll";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Not an arrow. A thin line extends downward on load (scaleY, not
 * height — per emil-design-eng, height triggers layout; scaleY is
 * compositor-only), then a small dot loops slowly along it. Reads as
 * "flow downward" rather than "click this chevron."
 *
 * A real, operable control — `aria-label` and an actual click handler
 * that scrolls to the next section via the shared Lenis instance — not
 * decoration pretending to be one.
 */
export function ScrollCue({ targetId }: { targetId: string }) {
  const reduced = usePrefersReducedMotion();
  const lenis = useLenis();

  function handleClick() {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to explore"
      className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: reduced ? 0 : 2.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="relative h-10 w-px overflow-hidden bg-text-on-dark/25">
        <motion.span
          className="absolute inset-x-0 top-0 h-full origin-top bg-gold"
          initial={reduced ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.9, delay: reduced ? 0 : 2.3, ease: [0.77, 0, 0.175, 1] }}
        />
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold"
            animate={{ y: [0, 34, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1], delay: 3.2 }}
          />
        )}
      </span>
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-text-on-dark/60 transition-colors group-hover:text-gold">
        Enter
      </span>
    </motion.button>
  );
}
