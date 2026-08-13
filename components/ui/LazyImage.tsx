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
 */

type LazyImageProps = {
  src?: string;
  alt: string;
  caption?: string;
  tone?: "gold" | "indigo";
  className?: string;
  sizes?: string;
};

const PLACEHOLDER_GRADIENTS: Record<"gold" | "indigo", string> = {
  gold: "radial-gradient(ellipse 80% 80% at 30% 20%, hsl(42 45% 88%) 0%, hsl(42 30% 94%) 55%, hsl(220 14% 91%) 100%)",
  indigo: "radial-gradient(ellipse 80% 80% at 70% 25%, hsl(243 22% 90%) 0%, hsl(230 18% 93%) 55%, hsl(220 14% 91%) 100%)",
};

export function LazyImage({
  src,
  alt,
  caption,
  tone = "gold",
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      data-cursor="image"
      className={cn("relative w-full overflow-hidden rounded-frame bg-surface-sunken", className)}
    >
      {/* Placeholder — always present under the real image, visible
          permanently when there is no src at all. */}
      <div
        aria-hidden={!!src}
        className="absolute inset-0 flex items-end p-4"
        style={{ background: PLACEHOLDER_GRADIENTS[tone] }}
      >
        {!src && caption && (
          <span className="font-mono text-[0.65rem] uppercase tracking-wide text-text-faint">{caption}</span>
        )}
      </div>

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
            className="object-cover"
            onLoad={() => setLoaded(true)}
          />
        </motion.div>
      )}
    </div>
  );
}
