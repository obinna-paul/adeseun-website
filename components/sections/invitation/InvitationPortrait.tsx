"use client";

import Image from "next/image";
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
        <Image
          src="/images/adeseun-invitation.jpg"
          alt="Adeseun Oyeneye"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
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
