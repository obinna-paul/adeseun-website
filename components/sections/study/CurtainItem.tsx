"use client";

import { motion } from "motion/react";
import { LazyImage } from "@/components/ui/LazyImage";
import { gentleReveal, viewportOnce } from "@/lib/motion";
import type { CurtainItem as CurtainItemType } from "./study-content";

/**
 * Renders whichever of the three kinds it's given — the masonry grid
 * doesn't know or care which, it just maps and lets each item decide
 * its own look. Notes get a faint rotation, like something pinned to a
 * board rather than laid flat; snippets read as index cards.
 *
 * Photos stay on the ordinary flat frame here, arch or not — tried the
 * doorway-arch (Study's timeline shape, tokens.css's radius comment) on
 * this grid's `tall` photos too and it didn't read right against the
 * note/snippet cards sitting right next to them in the same masonry;
 * flat keeps the whole grid one consistent shape language. `tall`
 * still controls the aspect ratio (portrait 3:4 for real photos of her
 * vs. landscape 3:2 for "shelf," the four-books product shot) — only
 * the corner shape reverted.
 */
export function CurtainItem({ item, rotate }: { item: CurtainItemType; rotate: number }) {
  return (
    <motion.div
      className="mb-6 break-inside-avoid"
      variants={gentleReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {item.kind === "photo" && (
        <LazyImage
          src={item.image}
          alt={item.caption}
          caption={item.caption}
          tone={rotate > 0 ? "gold" : "indigo"}
          className={item.tall ? "aspect-[3/4]" : "aspect-[3/2]"}
        />
      )}

      {item.kind === "note" && (
        <div
          className="rounded-frame border border-line-whisper bg-surface p-6 shadow-elevation-card"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <p className="font-display text-lg italic leading-snug text-text">&ldquo;{item.text}&rdquo;</p>
        </div>
      )}

      {item.kind === "snippet" && (
        <div className="rounded-frame border border-line-whisper bg-surface-elevated p-6 shadow-elevation-card">
          <span className="font-mono text-[0.65rem] uppercase tracking-wide text-text-faint">{item.label}</span>
          <p className="mt-3 font-body text-base leading-relaxed text-text-subdued">{item.text}</p>
        </div>
      )}
    </motion.div>
  );
}
