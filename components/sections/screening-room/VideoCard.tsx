"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { gentleReveal, viewportOnce } from "@/lib/motion";
import type { ScreeningRoomVideo } from "./screening-room-content";

/**
 * A lite-embed, not an always-on `<iframe>` — with up to 19 clips on one
 * page, mounting 19 concurrent YouTube players on load would be a real
 * performance cost for a page nobody's watched yet. The thumbnail
 * (YouTube's own CDN, no API key needed) is all that loads until a
 * visitor actually presses play; only then does the real embed mount,
 * one at a time.
 *
 * `youtube-nocookie.com`, not `youtube.com`, for the embed itself —
 * YouTube's own privacy-enhanced domain, which doesn't set tracking
 * cookies until the visitor actually presses play inside the frame.
 *
 * No frame-arch here (see tokens.css's radius comment) — that shape is
 * scoped to Study's timeline specifically; a grid of video thumbnails
 * isn't the "portrait of her" case it was built for, and it already
 * didn't survive being tried in Behind the Curtain's grid either.
 *
 * Deliberately no fabricated caption beyond the honest `label` —
 * see screening-room-content.ts for why.
 */
export function VideoCard({ video }: { video: ScreeningRoomVideo }) {
  const [playing, setPlaying] = useState(false);
  const isShort = video.format === "short";

  return (
    <motion.div
      className="mb-6 break-inside-avoid"
      variants={gentleReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-frame bg-surface-sunken",
          isShort ? "aspect-[9/16]" : "aspect-video",
        )}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.label}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video — ${video.label}`}
            data-cursor="link"
            data-cursor-text="Play"
            className="group absolute inset-0 h-full w-full"
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt=""
              fill
              sizes={isShort ? "(min-width: 1024px) 20vw, 45vw" : "(min-width: 1024px) 33vw, 100vw"}
              className="object-cover transition-transform duration-500 ease-gallery-out group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-hero-ground/10 transition-colors duration-300 ease-gallery-standard group-hover:bg-hero-ground/25"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-text shadow-elevation-card backdrop-blur transition-transform duration-300 ease-gallery-out group-hover:scale-110 group-active:scale-95"
            >
              <Play size={22} weight="fill" className="ml-0.5" />
            </span>
          </button>
        )}
      </div>
      <span className="mt-3 block font-mono text-xs uppercase tracking-[0.12em] text-text-faint">{video.label}</span>
    </motion.div>
  );
}
