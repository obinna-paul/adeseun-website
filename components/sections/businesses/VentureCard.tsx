"use client";

import { motion } from "motion/react";
import { LazyImage } from "@/components/ui/LazyImage";
import { gentleReveal } from "@/lib/motion";
import type { Venture } from "./businesses-content";

/**
 * A plain reveal-on-scroll card, not a click-to-modal pattern like The
 * Library's BookCard — per businesses-content.ts's own doc comment, this
 * page introduces each company rather than opening a deep detail view,
 * so there's nothing here that needs a second layer to expand into.
 */
export function VentureCard({ venture }: { venture: Venture }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={gentleReveal}
      className="flex flex-col gap-4"
    >
      <LazyImage
        src={venture.image}
        alt={venture.name}
        caption={venture.name}
        fit={venture.imageFit ?? "cover"}
        className="aspect-[4/3]"
        sizes="(min-width: 1024px) 30vw, 90vw"
      />
      <div>
        <h3 className="font-display text-xl font-semibold text-text">{venture.name}</h3>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-gold-ink">{venture.role}</p>
        <p className="mt-2 text-base text-text-subdued">{venture.blurb}</p>
      </div>
    </motion.article>
  );
}
