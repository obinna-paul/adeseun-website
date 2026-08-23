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
      {/* `contain`, not `cover` — several of these are real slides/photos
          with real content baked in edge-to-edge (a description, a
          collage, real logos); cropping them to fill a fixed box cut off
          exactly that content (real feedback, reported live). A portrait
          box fits most of what's here without letterboxing badly. */}
      <LazyImage
        src={venture.image}
        alt={venture.name}
        caption={venture.name}
        fit={venture.imageFit ?? "contain"}
        className="aspect-[3/4]"
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
