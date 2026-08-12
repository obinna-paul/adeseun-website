"use client";

import { motion, type MotionValue } from "motion/react";

/**
 * Sticky on desktop (`lg:sticky lg:top-0 lg:h-dvh`) so it holds in place
 * while the right column's form and below-fold content scroll past it —
 * the parallax offset (`y`, passed down from InvitationSection's
 * `useScroll`) then reads as the image drifting slightly within that
 * fixed frame, the classic two-speed parallax read. On mobile there's no
 * room for a held full-height column, so it collapses to a shorter,
 * non-sticky banner instead (declared explicitly here, not left to
 * chance — taste-skill 4.7's mobile-collapse rule).
 */
export function InvitationPortrait({ y }: { y: MotionValue<number> }) {
  return (
    <div className="relative h-[52vh] w-full overflow-hidden lg:sticky lg:top-0 lg:h-dvh lg:w-1/2">
      <motion.div className="absolute inset-[-10%]" style={{ y }}>
        {/* No portrait photo exists yet — an honest placeholder, same
            treatment as the Foyer hero's, not a stock photo standing in
            for her. Swap the gradient for a real <Image> the moment one
            lands; the parallax wrapper above doesn't need to change. */}
        <div
          role="img"
          aria-label="Portrait of Adeseun Oyeneye speaking"
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse 65% 60% at 50% 40%, hsl(42 35% 28%) 0%, hsl(230 22% 12%) 58%, hsl(230 26% 7%) 100%)",
          }}
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(180deg, hsla(230,26%,5%,0.1) 0%, transparent 30%, hsla(230,26%,5%,0.35) 100%)",
        }}
      />
    </div>
  );
}
