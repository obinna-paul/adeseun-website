"use client";

import { motion } from "motion/react";
import { HeroPortrait } from "./HeroPortrait";
import { HeroCanvas } from "./HeroCanvas";
import { ScrollCue } from "./ScrollCue";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileDetect } from "@/components/ui/MobileDetect";
import { heroLine, heroLineGroup, heroSubhead, heroActions, heroAction } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Act I — The Arrival (see The Walkthrough). The site's cold open: dark,
 * commanding, wordless for its first beat. Everything after this section
 * warms up — Act III is where "light breaks in for the first time."
 *
 * ── Timing choreography ──────────────────────────────────────────────
 * All delays below are relative to mount (t=0). Durations from
 * lib/motion.ts / lib/design-tokens.ts; written out here as seconds so
 * the sequence reads as a score, not a scavenger hunt through imports.
 *
 *   t=0.00  Canvas grain + motes start their ambient loop (no delay —
 *           the room is already "on" before anything else happens).
 *   t=0.00  Portrait mask starts opening (iris, ~2.0s) and its filter
 *           sweep starts (brightness/blur, ~1.7–2.2s) — see HeroPortrait.
 *   t=0.65  Headline line 1 begins its blur-in (heroLineGroup's
 *           `delayChildren`). Starts once the portrait is roughly
 *           40–50% revealed — the room is lighting up, THEN the words
 *           arrive, not both at once.
 *   t=0.87  Headline line 2 begins (220ms after line 1 — heroLineGroup's
 *           `staggerChildren`). That gap is much wider than the 30–80ms
 *           taste-skill prescribes for list-item stagger; that guidance
 *           is for micro-UI (rows, cards), not a two-line cinematic
 *           headline where each line is itself a ~1s event. A quick
 *           succession here would read as a glitch, not a reveal.
 *   ~t=1.85 Line 2's blur-in finishes (starts 0.87 + runs ~1.0s).
 *   t=2.10  Subhead fades up (heroSubhead), a clear beat after the
 *           headline settles — never competing with it for attention.
 *   t=2.10  CTA row becomes visible (currently one button — see the note
 *           on the removed second CTA below; the 120ms child stagger in
 *           heroActions still applies whenever a second action returns).
 *   t=2.30  Scroll cue's line begins extending (scaleY); the traveling
 *           dot's loop starts at t=3.2, after the line has finished
 *           extending — nothing about the cue competes with the CTAs
 *           settling in.
 *
 * Total settle time ~2.6s. Long for a UI interaction, correct for a
 * once-per-visit hero (emil-design-eng: "marketing/explanatory: can be
 * longer" — this is that category, not a dropdown).
 *
 * Reduced motion: every animated element still renders its FINAL state
 * immediately (no motion, no delay) via `usePrefersReducedMotion()` gating
 * below — nothing is hidden or broken, the choreography is just skipped.
 */

// Deliberately her own real book titles, not invented copy — see
// library-content.ts for the research this is grounded in. Author-first
// framing per direct instruction: the hero's one big statement is what
// she actually wrote, not an invented executive-ascent narrative.
const HEADLINE_LINES = ["Think before you speak.", "Live beyond the mundane."];

export function HeroSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="foyer-hero"
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-hero-ground lg:block"
    >
      {/*
       * Mobile/tablet art direction (below `lg`): the desktop composition
       * — portrait full-bleed behind the whole section, headline overlaid
       * at the bottom — puts the headline directly across her face on a
       * narrow, tall viewport; there's no horizontal room to keep text
       * beside the face the way the wide desktop crop does. Below `lg`,
       * portrait and text become two stacked, non-overlapping blocks
       * instead: portrait in its own contained top block (not full-bleed),
       * headline below it in normal flow. Both blocks stay on the same
       * dark hero-ground so the section still reads as one register top to
       * bottom (Page Theme Lock, 4.11) rather than flipping tone mid-stack.
       * At `lg`+, both blocks revert to absolute-positioned overlays,
       * restoring the original full-bleed composition exactly.
       */}
      <div className="relative h-[42vh] min-h-[280px] w-full shrink-0 lg:absolute lg:inset-0 lg:h-full lg:min-h-0">
        <HeroPortrait src="/images/adeseun-threesixty.jpg" alt="Adeseun Oyeneye" />
      </div>
      <MobileDetect>
        <HeroCanvas />
      </MobileDetect>

      <div className="relative z-10 flex w-full flex-1 flex-col justify-center px-gutter py-10 sm:px-10 lg:absolute lg:inset-0 lg:flex-none lg:justify-end lg:px-16 lg:py-0 lg:pb-24">
        <div className="mx-auto w-full max-w-frame">
          <div className="max-w-2xl">
            {/* h1 is the real, single, SEO-bearing heading — its two visual
                lines are block-level (not letter-split), so assistive tech
                and search crawlers read the full sentence in order. */}
            <motion.h1
              className="text-balance font-display text-4xl font-semibold text-text-on-dark sm:text-6xl lg:text-7xl"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : heroLineGroup}
            >
              {HEADLINE_LINES.map((line) => (
                <motion.span
                  key={line}
                  className="block"
                  variants={reduced ? undefined : heroLine}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-md text-lg text-text-on-dark/80"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : heroSubhead}
            >
              Adeseun Oyeneye — author of Think Before You Speak, Beyond the
              Mundane, and Tranquility.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : heroActions}
            >
              {/* A second CTA ("Watch the Introduction" → /screening-room)
                  lived here until the pre-deploy audit — it pointed at a
                  route with no page behind it, a real dead link on the
                  site's most prominent button. Removed rather than greyed
                  out: a two-button hero row with one button visibly inert
                  reads worse than a clean single CTA, and the honest-
                  placeholder pattern used everywhere else on this site
                  (see library-content.ts) is to not ship something not
                  real, not disguise it. Restore it once The Screening Room
                  has an actual page and a real video to introduce. */}
              <motion.div variants={reduced ? undefined : heroAction}>
                <MagneticButton href="/library" variant="primary">
                  Enter the Library
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <ScrollCue targetId="act-ii" />
    </section>
  );
}
