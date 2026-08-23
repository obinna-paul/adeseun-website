"use client";

import { motion } from "motion/react";
import { gentleReveal, staggerChildren } from "@/lib/motion";
import { CREDENTIAL_GROUPS } from "@/components/sections/study/study-content";

const RECOGNITION = CREDENTIAL_GROUPS.find((group) => group.label === "Recognition")?.items ?? [];

const PAGE_EYEBROW = "The Hall";
const PAGE_HEADLINE = "Honours & recognition.";
const PAGE_INTRO = "A record kept in one place, not scattered across bios and press mentions.";

/**
 * Same real, already-verified list as study-content.ts's `CREDENTIAL_GROUPS`
 * (its "Recognition" group) — reused here rather than duplicated, so the
 * two pages can never drift onto two different lists of the same facts.
 */
export function AwardsSection() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="The Hall">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">{PAGE_HEADLINE}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-text-subdued">{PAGE_INTRO}</p>
      </div>

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren(80)}
        className="mx-auto mt-16 flex max-w-2xl flex-col gap-6"
      >
        {RECOGNITION.map((item, i) => (
          <motion.li
            key={item}
            variants={gentleReveal}
            className="flex items-baseline gap-5 border-t border-line-whisper pt-6"
          >
            <span className="font-display text-2xl text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-lg text-text">{item}</span>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
