"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { authoritativeEntrance, gentleReveal, staggerChildren } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { SITE_PAGES } from "@/lib/navigation";

export default function NotFound() {
  const reduced = usePrefersReducedMotion();
  const entrance = reduced ? {} : { initial: "hidden", animate: "visible", variants: authoritativeEntrance };
  const listStagger = reduced ? {} : { initial: "hidden", animate: "visible", variants: staggerChildren(60) };
  const rowReveal = reduced ? {} : { variants: gentleReveal };

  return (
    <main id="main-content" tabIndex={-1} className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-ground px-gutter py-room text-text">
      {/* Decorative ghost numeral — backdrop, not a functional label. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[28rem] font-medium leading-none text-line-whisper"
      >
        404
      </span>

      <motion.div className="mx-auto flex max-w-frame-narrow flex-col items-center text-center" {...entrance}>
        <h1 className="text-balance font-display text-6xl font-semibold tracking-tight text-text sm:text-7xl">
          This room isn&rsquo;t in the blueprint.
        </h1>
        <p className="mt-6 max-w-prose-gallery text-lg text-text-subdued">
          Every room that&rsquo;s been built is listed below. The one you
          were looking for isn&rsquo;t one of them &mdash; yet.
        </p>

        <Link
          href="/"
          data-cursor="link"
          data-cursor-text="Home"
          className="mt-10 inline-flex items-center gap-2 rounded-control bg-emerald-fill px-8 py-3.5 font-mono text-sm text-text-on-dark shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-shadow duration-150 ease-gallery-out hover:shadow-glow-emerald active:scale-[0.97]"
        >
          Back to the entrance
        </Link>
      </motion.div>

      <motion.nav
        aria-label="Every built room"
        className="mt-16 grid w-full max-w-frame grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3"
        {...listStagger}
      >
        {SITE_PAGES.map((page) => (
          <motion.div key={page.href} {...rowReveal}>
            <Link
              href={page.href}
              data-cursor="link"
              data-cursor-text="Explore"
              className="group flex flex-col border-t border-line-whisper py-3 transition-colors duration-150 ease-gallery-standard hover:border-gold"
            >
              <span className="link-gradient font-display text-lg">{page.name}</span>
              <span className="font-mono text-xs uppercase tracking-wide text-text-faint">{page.note}</span>
            </Link>
          </motion.div>
        ))}
      </motion.nav>
    </main>
  );
}
