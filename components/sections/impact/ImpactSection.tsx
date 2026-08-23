"use client";

import { motion } from "motion/react";
import { gentleReveal, staggerChildren } from "@/lib/motion";
import { IMPACT_THREADS, PAGE_EYEBROW, PAGE_HEADLINE, PAGE_INTRO } from "./impact-content";

export function ImpactSection() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="The Foundation">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">{PAGE_HEADLINE}</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-text-subdued">{PAGE_INTRO}</p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren(80)}
        className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2"
      >
        {IMPACT_THREADS.map((thread) => (
          <motion.div key={thread.title} variants={gentleReveal} className="border-t border-line-whisper pt-6">
            <h2 className="font-display text-xl font-semibold text-text">{thread.title}</h2>
            <p className="mt-2 text-base text-text-subdued">{thread.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
