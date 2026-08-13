"use client";

import Image from "next/image";
import { motion, type MotionValue } from "motion/react";

/**
 * Sticky on desktop (`lg:sticky lg:top-20 lg:h-[calc(100dvh-5rem)]`) so it
 * holds in place while the right column's form and below-fold content
 * scroll past it — the parallax offset (`y`, passed down from
 * InvitationSection's `useScroll`) then reads as the image drifting
 * slightly within that fixed frame, the classic two-speed parallax read.
 * On mobile there's no room for a held full-height column, so it
 * collapses to a shorter, non-sticky banner instead (declared explicitly
 * here, not left to chance — taste-skill 4.7's mobile-collapse rule).
 *
 * `lg:top-20` / `calc(100dvh-5rem)`, not `top-0` / `h-dvh` (real bug,
 * fixed via screenshot): the persistent `fixed` Header (h-20) has no way
 * to know this column is sticky underneath it, so at `top-0` it sat
 * right on top of her face with zero clearance — reserving the header's
 * own height in the sticky offset instead means it never overlaps the
 * photo on desktop. Mobile's non-sticky banner gets the same clearance a
 * different way: the outer box keeps its original footprint, but the
 * inner image layer is inset from `top-20` instead of the container's
 * true top, so the header floats over plain background instead of her
 * face there too — that split (image inset on mobile, whole box
 * repositioned on desktop) is because the mobile box isn't sticky/
 * repositionable the way the desktop one is.
 */
export function InvitationPortrait({ y }: { y: MotionValue<number> }) {
  return (
    <div className="relative h-[52vh] w-full overflow-hidden lg:sticky lg:top-20 lg:h-[calc(100dvh-5rem)] lg:w-1/2">
      <motion.div className="absolute inset-x-[-4%] bottom-[-4%] top-20 lg:inset-[-4%]" style={{ y }}>
        <Image
          src="/images/adeseun-invitation.jpg"
          alt="Adeseun Oyeneye"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[50%_18%]"
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
