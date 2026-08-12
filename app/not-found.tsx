"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { authoritativeEntrance, gentleReveal, staggerChildren } from "@/lib/motion";

const ROOMS = [
  { name: "The Foyer", href: "/", note: "Home" },
  { name: "The Library", href: "/library", note: "Books" },
  { name: "The Screening Room", href: "/screening-room", note: "Videos & Media" },
  { name: "The Boardroom", href: "/boardroom", note: "Executive" },
  { name: "The Study", href: "/study", note: "Voice & Philosophy" },
  { name: "The Table", href: "/table", note: "Contact" },
] as const;

export default function NotFound() {
  const reduced = useReducedMotion();
  const entrance = reduced ? {} : { initial: "hidden", animate: "visible", variants: authoritativeEntrance };
  const listStagger = reduced ? {} : { initial: "hidden", animate: "visible", variants: staggerChildren(60) };
  const rowReveal = reduced ? {} : { variants: gentleReveal };

  return (
    <main className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-ground px-gutter py-room text-text">
      {/* Decorative ghost numeral — backdrop, not a functional label. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[28rem] font-medium leading-none text-line-whisper"
      >
        404
      </span>

      <motion.div className="mx-auto flex max-w-frame-narrow flex-col items-center text-center" {...entrance}>
        <h1 className="text-balance font-display text-6xl font-semibold tracking-tight text-text sm:text-7xl">
          This room doesn&rsquo;t exist.
        </h1>
        <p className="mt-6 max-w-prose-gallery text-lg text-text-subdued">
          Every room in this house is listed below. The one you were looking
          for isn&rsquo;t one of them &mdash; yet.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-control bg-gold-fill px-8 py-3.5 font-mono text-sm text-text-on-dark shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-shadow duration-150 ease-gallery-out hover:shadow-glow-gold active:scale-[0.97]"
        >
          Return to the Foyer
        </Link>
      </motion.div>

      <motion.nav
        aria-label="All rooms"
        className="mt-16 grid w-full max-w-frame grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3"
        {...listStagger}
      >
        {ROOMS.map((room) => (
          <motion.div key={room.href} {...rowReveal}>
            <Link
              href={room.href}
              className="group flex flex-col border-t border-line-whisper py-3 transition-colors duration-150 ease-gallery-standard hover:border-gold"
            >
              <span className="font-display text-lg text-text group-hover:text-gold-ink">{room.name}</span>
              <span className="font-mono text-xs uppercase tracking-wide text-text-faint">{room.note}</span>
            </Link>
          </motion.div>
        ))}
      </motion.nav>
    </main>
  );
}
