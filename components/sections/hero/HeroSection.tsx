"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroPortrait } from "./HeroPortrait";
import { HeroCanvas } from "./HeroCanvas";
import { ScrollCue } from "./ScrollCue";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { heroLine, heroLineGroup, heroSubhead, heroActions, heroAction } from "@/lib/motion";

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
 *   t=2.10  CTA row becomes visible; its own children (the two buttons)
 *           stagger 120ms apart starting here, so the primary button
 *           settles first and the secondary a beat later.
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
 * immediately (no motion, no delay) via `useReducedMotion()` gating
 * below — nothing is hidden or broken, the choreography is just skipped.
 */

const HEADLINE_LINES = ["She built the room.", "Then she wrote the book about it."];

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="foyer-hero"
      className="relative flex min-h-[100dvh] w-full items-end overflow-hidden bg-hero-ground"
    >
      <HeroPortrait alt="Adeseun Oyeneye" />
      <HeroCanvas />

      <div className="relative z-10 w-full px-gutter pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <div className="mx-auto max-w-frame">
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
              Adeseun Oyeneye — Managing Director. Author of six. Not in
              that order of importance.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : heroActions}
            >
              <motion.div variants={reduced ? undefined : heroAction}>
                <MagneticButton href="/library" variant="primary">
                  Enter the Library
                </MagneticButton>
              </motion.div>
              <motion.div variants={reduced ? undefined : heroAction}>
                <MagneticButton href="/screening-room" variant="secondary">
                  Watch the Introduction
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
