"use client";

import { motion, useScroll } from "motion/react";

/**
 * A thin gold line across the top of the viewport that fills with
 * scroll position — `scaleX` on `scrollYProgress` directly, no spring:
 * this is a status readout, not a decorative gesture, so it should
 * track the scroll position exactly, not trail it. Motion's `useScroll`
 * (no `target`) reads real window scroll, which Lenis drives natively
 * (see SmoothScroll's own doc comment) — no extra wiring needed.
 *
 * Left on under `prefers-reduced-motion`: it's informational feedback,
 * not decoration — reduced motion means fewer/gentler *animations*, not
 * the removal of a direct, non-animated value binding.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-40 h-[2px] w-full origin-left bg-gold"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
