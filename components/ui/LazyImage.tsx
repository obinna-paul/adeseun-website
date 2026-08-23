"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Blur-up lazy image, portable to whatever eventually serves real
 * photos (Sanity's CDN, per ARCHITECTURE.md) — not dependent on a
 * build-time `blurDataURL`, which only works for statically imported
 * local files. Instead: a soft gradient placeholder shows first, and on
 * the real `<img>`'s load event, it fades out while the sharp image
 * fades in. next/image already lazy-loads by default (no `priority`
 * prop here), so the network fetch itself is deferred until the image
 * nears the viewport — this only adds the perceptual blur-up on top.
 *
 * No `src` yet? Renders the placeholder permanently, with an honest
 * caption rather than pretending to be a real photo — see study-content.ts.
 *
 * `fit="cover"` (default) is right for a photo of her — cropping the
 * edges to fill the frame reads fine when the subject is a face/figure.
 * A book cover is different: it's a fixed composition with real text
 * baked in at the top and bottom (title, her name), and `cover`-cropping
 * a portrait-aspect jacket into a square or 4:3 frame slices that text
 * off. `fit="contain"` letterboxes it instead — the whole cover stays
 * legible, padded by the wrapper's own `bg-surface-sunken` rather than
 * cropped.
 *
 * `shape="frame"` (default) is the site's ordinary flat-corner treatment.
 * `shape="arch"` swaps in the doorway-arch top (`.frame-arch`, globals.css)
 * — see tokens.css's radius comment for when that's the right call.
 */

type LazyImageProps = {
  src?: string;
  alt: string;
  caption?: string;
  tone?: "gold" | "indigo";
  className?: string;
  sizes?: string;
  fit?: "cover" | "contain";
  shape?: "frame" | "arch";
};

const PLACEHOLDER_GRADIENTS: Record<"gold" | "indigo", string> = {
  gold: "radial-gradient(ellipse 80% 80% at 30% 20%, hsl(38 40% 88%) 0%, hsl(38 30% 94%) 55%, hsl(36 26% 91%) 100%)",
  indigo: "radial-gradient(ellipse 80% 80% at 70% 25%, hsl(243 22% 90%) 0%, hsl(230 18% 93%) 55%, hsl(36 26% 91%) 100%)",
};

export function LazyImage({
  src,
  alt,
  caption,
  tone = "gold",
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  fit = "cover",
  shape = "frame",
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      data-cursor="image"
      className={cn(
        "relative w-full overflow-hidden bg-surface-sunken",
        shape === "arch" ? "frame-arch" : "rounded-frame",
        className,
      )}
    >
      {/* Placeholder — always present under the real image, visible
          permanently when there is no src at all. Skipped entirely in
          "contain" mode: that mode always ships with a real src (a book
          cover, not a photo awaiting one), and `object-contain` leaves
          transparent letterbox gaps around it — this gradient sitting
          underneath would bleed through those gaps instead of the
          wrapper's own neutral bg-surface-sunken. */}
      {fit !== "contain" && (
        <div
          aria-hidden={!!src}
          className="absolute inset-0 flex items-end p-4"
          style={{ background: PLACEHOLDER_GRADIENTS[tone] }}
        >
          {!src && caption && (
            <span className="font-mono text-[0.65rem] uppercase tracking-wide text-text-faint">{caption}</span>
          )}
        </div>
      )}

      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={fit === "contain" ? "object-contain" : "object-cover"}
            onLoad={() => setLoaded(true)}
          />
        </motion.div>
      )}
    </div>
  );
}
