"use client";

import { motion } from "motion/react";
import { LazyImage } from "@/components/ui/LazyImage";
import { viewportOnce } from "@/lib/motion";
import type { Milestone } from "./study-content";

/**
 * One milestone. Reveal is Motion's `whileInView` — Motion's own
 * implementation is IntersectionObserver under the hood, which is
 * exactly the tool asked for here; GSAP ScrollTrigger (used for the
 * Manifesto's pin/scrub) would be reaching for a heavier mechanism than
 * a plain "slide in once when scrolled into view" needs.
 *
 * Slow and deliberate on purpose — 900ms, not a UI-speed 200ms — this
 * is a documentary beat, not a dropdown. The image settles first, the
 * story text follows ~150ms behind it: image resolves, then the
 * caption, never both landing in the same instant.
 */
export function TimelineCard({ milestone, side }: { milestone: Milestone; side: "left" | "right" }) {
  const fromX = side === "left" ? -32 : 32;

  return (
    <div
      className={`relative flex flex-col gap-6 pl-16 lg:w-1/2 lg:pl-0 ${
        side === "left" ? "lg:mr-auto lg:pr-16 lg:text-right" : "lg:ml-auto lg:pl-16"
      }`}
    >
      {/* Node on the line — mobile: always at the left-edge line. Desktop:
          on the card's edge nearest the centered line (right edge for a
          'left'-side card, left edge for a 'right'-side card), so it
          always sits exactly on top of the line regardless of side. */}
      <span
        aria-hidden="true"
        className={`absolute top-2 h-3 w-3 rounded-full border-2 border-gold bg-ground ${
          side === "left"
            ? "left-6 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-1/2"
            : "left-6 -translate-x-1/2 lg:left-0 lg:-translate-x-1/2"
        }`}
      />

      <motion.div
        initial={{ opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
      >
        <LazyImage src={milestone.image} alt={milestone.title} caption={milestone.title} tone={side === "left" ? "gold" : "indigo"} className="aspect-[4/3]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: fromX }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{milestone.era}</span>
        <h3 className="mt-2 text-balance font-display text-2xl font-semibold text-text sm:text-3xl">
          {milestone.title}
        </h3>
        <p className="mt-3 text-text-subdued">{milestone.story}</p>
      </motion.div>
    </div>
  );
}
