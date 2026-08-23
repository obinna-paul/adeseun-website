"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { HERO_LINE } from "./study-content";

/**
 * The Study opens on her desk, then pulls back to reveal her in
 * thought — a slow dolly-out, not a cut. Deliberately the light
 * Alabaster Gallery palette, not the Foyer's dark hero-ground: the
 * Foyer's cold open is this site's one sanctioned dark moment (see
 * ManifestoSection's own notes on Page Theme Lock); The Study is the
 * intimate, warm-lit register The Walkthrough originally gave it, and
 * reusing the stark dark treatment here would dilute what makes the
 * Foyer's opening land.
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
          src="/images/adeseun-study-desk.jpg"
          alt="Adeseun Oyeneye"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_10%]"
        />
      </motion.div>

      {/* Bottom-weighted scrim in the page's own light tones, for text legibility — not a dark vignette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsla(38,30%,96%,0) 0%, hsla(38,30%,96%,0.15) 45%, hsla(38,30%,96%,0.92) 88%, hsl(38,30%,96%) 100%)",
        }}
      />

      <div className="relative z-10 w-full px-gutter pb-20 sm:px-10 lg:px-16">
        <motion.p
          className="mx-auto max-w-3xl text-balance text-center font-display text-3xl font-semibold leading-tight text-text sm:text-5xl"
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
