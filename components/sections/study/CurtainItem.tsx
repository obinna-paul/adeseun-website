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
 * `tall` photos ("desk-detail", "headies-desk") are portrait real
 * photos of her and get the doorway-arch shape at a matching portrait
 * aspect; the one non-tall photo ("shelf," the four-books product shot)
 * is landscape and keeps the ordinary flat frame at a wider aspect
 * matching its actual source — see tokens.css's radius comment for why
 * the arch is scoped to portraits of her specifically, not every photo.
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
          shape={item.tall ? "arch" : "frame"}
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
