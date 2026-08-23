"use client";

import { motion } from "motion/react";
import { HeroPortrait } from "./HeroPortrait";
import { HeroCanvas } from "./HeroCanvas";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileDetect } from "@/components/ui/MobileDetect";
import { heroLine, heroLineGroup, heroSubhead, heroActions, heroAction } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The Entrance — Home's cold open: dark, commanding, wordless for its
 * first beat. Rewritten executive-first per the ADESEUN OYENEYE WEBSITE
 * SCOPE BLUEPRINT's recommended hero structure (her name, then a
 * one-paragraph positioning statement) — replacing the earlier
 * author-first "Live beyond the mundane" tagline hero. The blueprint's
 * own recommended role line ("Entrepreneur · Media Executive ·
 * Architect · ...") was tried directly under her name and then removed
 * per direct instruction — read as visual clutter between the name and
 * the positioning line, not as a second beat worth its own space. The
 * portrait is now two separate crops, one per breakpoint — see
 * HeroPortrait's own doc comment for why one image can't serve both
 * shapes, and for the (per direct instruction) AI-generated desktop
 * image's own flag.
 *
 * ── One layout, every breakpoint ─────────────────────────────────────
 * Mobile and desktop used to be two different compositions (stacked
 * non-overlapping blocks below `lg`, full-bleed overlay above it) — that
 * split existed only because overlaying text on the photo looked bad on
 * a narrow, tall crop. Direct feedback reversed that: the photo is dark
 * enough that text-on-photo reads fine on mobile too, so there's now
 * exactly one composition, and the mobile-only stacked variant is gone.
 *
 * ── Clearing the persistent Header (real bug, fixed via screenshot) ──
 * The Header is `fixed` at `h-20` covering the top of every page (see
 * Header.tsx). Both the portrait and the text content reserve `top-20`
 * of clearance at every breakpoint — the photo starts *below* the header
 * rather than underneath its translucent bar, and the header floats over
 * plain `bg-hero-ground` instead of ever sitting on top of her face. This
 * is what "her head starts after the nav" (mobile) and the headline no
 * longer reading as clipped (desktop) both come from — one fix, not two.
 *
 * ── Taming the zoom on wide screens (real bug, fixed via screenshot) ──
 * The mobile source photo (adeseun-hero-mobile.jpg — AI-generated, like
 * the desktop image; see HeroPortrait's own doc comment) is a tall,
 * narrow portrait (926×1698). Forcing that to `object-cover` edge-to-edge
 * on an
 * ultra-wide short viewport (2560×1080, or even a maximized 1920-wide
 * laptop window) demands cropping almost all of it away — there's no
 * object-position that fixes that; the geometry itself is the problem.
 * This is exactly why `lg`+ now renders a *different* image
 * (adeseun-hero-desktop.jpg, 1448×1086) rather than reusing the mobile
 * crop at a larger size — but the width cap below is still worth keeping
 * even with a better-matched desktop source, since it bounds the crop to
 * a known-good range instead of trusting every possible monitor width.
 * Past `lg`, the portrait is right-aligned and width-capped
 * (`lg:max-w-[1300px]`) instead of stretching the full section width, so
 * the required crop stays reasonable at any viewport width — typical
 * laptop widths (≤1300px content) render exactly as before, only truly
 * ultra-wide screens are affected. HeroPortrait's own left-edge scrim
 * blends the cap's edge into `bg-hero-ground` so there's no seam, and
 * gives the left-anchored text a darker backdrop to sit on at every size.
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
 *   t=0.65  Headline begins its blur-in (heroLineGroup's `delayChildren`).
 *           Starts once the portrait is roughly 40–50% revealed — the
 *           room is lighting up, THEN the words arrive, not both at once.
 *   t=2.10  Subhead fades up (heroSubhead), a clear beat after the
 *           headline settles — never competing with it for attention.
 *   t=2.10  CTA row becomes visible; its own children (the two buttons)
 *           stagger 120ms apart starting here, so the primary button
 *           settles first and the secondary a beat later.
 *
 * Reduced motion: every animated element still renders its FINAL state
 * immediately (no motion, no delay) via `usePrefersReducedMotion()` gating
 * below — nothing is hidden or broken, the choreography is just skipped.
 */

// Her name, split across two lines for the same reason the old
// "Live beyond / the mundane" headline was hardcoded rather than left to
// `text-balance`: an exact, browser-independent break point, not one that
// depends on container width and font metrics at render time.
const HEADLINE_LINES = ["Adeseun", "Oyeneye"];

const POSITIONING_LINE =
  "Building businesses, shaping spaces, and telling African stories — creating institutions designed to outlive their founder.";

export function HeroSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="home-hero"
      className="relative min-h-[100dvh] w-full overflow-x-hidden bg-hero-ground"
    >
      <div className="absolute inset-x-0 bottom-0 top-20 lg:flex lg:justify-end">
        <div className="relative h-full w-full lg:max-w-[1300px]">
          <HeroPortrait
            mobileSrc="/images/adeseun-hero-mobile.jpg"
            desktopSrc="/images/adeseun-hero-desktop.jpg"
            alt="Adeseun Oyeneye"
          />
        </div>
      </div>
      <MobileDetect>
        <HeroCanvas />
      </MobileDetect>

      <div className="absolute inset-x-0 bottom-0 top-20 z-10 flex flex-col justify-end px-gutter pb-8 sm:px-10 lg:px-16 lg:pb-16">
        <div className="mx-auto w-full max-w-frame">
          <div className="max-w-3xl">
            {/* h1 is the real, single, SEO-bearing heading — its two visual
                lines are block-level (not letter-split), so assistive tech
                and search crawlers read the full sentence in order. */}
            <motion.h1
              className="font-display text-5xl font-semibold text-text-on-dark sm:text-7xl"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : heroLineGroup}
            >
              {HEADLINE_LINES.map((line) => (
                <motion.span key={line} className="block" variants={reduced ? undefined : heroLine}>
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
              {POSITIONING_LINE}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-row flex-wrap items-center gap-2 sm:gap-4"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : heroActions}
            >
              <motion.div variants={reduced ? undefined : heroAction}>
                <MagneticButton href="/about" variant="primary" dense>
                  Read My Story
                </MagneticButton>
              </motion.div>
              <motion.div variants={reduced ? undefined : heroAction}>
                <MagneticButton href="/contact" variant="secondary" onDark dense>
                  Work With Me
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
