"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gentleReveal, staggerChildren } from "@/lib/motion";
import { TOPICS, PAGE_EYEBROW, PAGE_HEADLINE, PAGE_INTRO, CTA_LABEL, CTA_HREF } from "./speaking-content";

/**
 * Light register throughout, like every other non-home page — the dark
 * `bg-hero-ground` is Home's one sanctioned dark moment (taste-skill
 * 4.11's Page Theme Lock; see app/styles/tokens.css), not a treatment to
 * reuse anywhere a portrait needs drama.
 */
export function SpeakingSection() {
  return (
    <section className="relative overflow-hidden bg-ground px-gutter py-room" aria-label="The Podium">
      <div className="mx-auto flex max-w-frame flex-col items-center gap-12 lg:flex-row-reverse lg:items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={gentleReveal}
          className="w-full max-w-xs shrink-0 overflow-hidden rounded-frame shadow-elevation-card lg:max-w-sm"
        >
          <Image
            src="/images/adeseun-portrait-speaking.jpg"
            alt="Adeseun Oyeneye speaking"
            width={392}
            height={834}
            className="h-auto w-full object-cover"
            priority
          />
        </motion.div>

        <div className="max-w-xl">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
            {PAGE_HEADLINE}
          </h1>
          <p className="mt-6 text-lg text-text-subdued">{PAGE_INTRO}</p>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerChildren(60)}
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
          >
            {TOPICS.map((topic) => (
              <motion.li key={topic} variants={gentleReveal} className="border-t border-line-whisper pt-3 text-base text-text-subdued">
                {topic}
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-10">
            <MagneticButton href={CTA_HREF} variant="primary">
              {CTA_LABEL}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
