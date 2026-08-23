"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { HERO_LINE } from "./study-content";

/**
 * The Blueprint opens on a portrait, then pulls back — a slow dolly-out,
 * not a cut. Two separate crops, one per breakpoint (adeseun-about-hero.jpg
 * desktop, adeseun-about-hero-mobile.jpg mobile — both AI-generated per
 * direct instruction, same flag as HeroPortrait's own doc comment), for
 * the same reason Home's hero uses two: a landscape crop composed for a
 * wide frame and a tall portrait composed for a narrow one aren't the
 * same photo cropped differently, they're different source images. Both
 * are dark and moody throughout, not the lighter desk photo this section
 * used before, so the bottom scrim now fades to a dark tone
 * (--color-hero-ground) instead of the page's light ground, and the
 * caption is set in light text-on-dark — real feedback: black text over
 * this image read as illegible, since the old light-fading scrim assumed
 * a photo that was mostly light to begin with. The section's own
 * background (`bg-ground`) is unchanged as a fallback for whatever the
 * image and scrim don't cover; this is a photographic dark moment
 * layered on the page, not a second page-level dark theme (Page Theme
 * Lock, taste-skill 4.11, still reserves that for the home hero and
 * persistent chrome).
 *
 * The zoom is a scale transform, not a width/height change — and it's
 * ease-in-out, not ease-out: this is on-screen movement (a camera
 * pulling back), emil-design-eng's second category, not an element
 * entering from nothing. It's applied to the wrapping div, not the
 * <Image> itself — unlike HeroPortrait's mask/filter treatment, nothing
 * here needs its own Motion-driven style on the image, so a plain
 * next/image inside an animated wrapper is enough.
 *
 * Sentence arrives only once the pull-back has mostly resolved:
 * documentary pacing is image first, caption second, never both at once.
 */

const ZOOM_DURATION = 3.6;
const LINE_DELAY = 2.2;

export function StudyHero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] w-full items-end overflow-hidden bg-ground">
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-20"
        initial={reduced ? false : { scale: 1.35 }}
        animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : ZOOM_DURATION, ease: [0.77, 0, 0.175, 1] }}
      >
        <Image
          src="/images/adeseun-about-hero-mobile.jpg"
          alt="Adeseun Oyeneye"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_10%] lg:hidden"
        />
        <Image
          src="/images/adeseun-about-hero.jpg"
          alt="Adeseun Oyeneye"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-[62%_15%] lg:block"
        />
      </motion.div>

      {/* Bottom-weighted scrim fading to the dark hero-ground tone, for
          white-text legibility against a photo that's dark throughout —
          see this file's own doc comment for why this changed from a
          light-fading scrim. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsla(160,28%,6%,0) 0%, hsla(160,28%,6%,0.25) 45%, hsla(160,28%,6%,0.88) 88%, hsl(160,28%,6%) 100%)",
        }}
      />

      <div className="relative z-10 w-full px-gutter pb-20 sm:px-10 lg:px-16">
        <motion.p
          className="mx-auto max-w-3xl text-balance text-center font-display text-3xl font-semibold leading-tight text-text-on-dark sm:text-5xl"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: reduced ? 0 : LINE_DELAY, ease: [0.23, 1, 0.32, 1] }}
        >
          {HERO_LINE}
        </motion.p>
      </div>
    </section>
  );
}
