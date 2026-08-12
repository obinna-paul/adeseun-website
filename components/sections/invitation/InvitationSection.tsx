"use client";

import { useRef } from "react";
import { useScroll, useTransform, useMotionValue } from "motion/react";
import { InvitationPortrait } from "./InvitationPortrait";
import { InvitationForm } from "./InvitationForm";
import { LocationBlock } from "./LocationBlock";
import { NewsletterLetter } from "./NewsletterLetter";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { PAGE_EYEBROW, PAGE_HEADLINE, PAGE_INTRO } from "./invitation-content";

/**
 * `useScroll`'s `target` tracks this component's own two-column wrapper
 * (not the whole document) with `offset: ["start start", "end end"]` —
 * progress 0 when the wrapper's top hits the viewport top, 1 when its
 * bottom hits the viewport bottom. That maps the parallax to exactly
 * this section's own scrollable height, footer included afterward
 * without skewing the range.
 */
export function InvitationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-48, 48]);
  const staticY = useMotionValue(0);

  return (
    <div ref={ref} className="relative flex flex-col lg:flex-row">
      <InvitationPortrait y={reducedMotion ? staticY : parallaxY} />

      <div className="w-full px-gutter py-16 lg:w-1/2 lg:py-room">
        <div className="mx-auto max-w-lg">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-ink">{PAGE_EYEBROW}</span>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-text sm:text-5xl">
            {PAGE_HEADLINE}
          </h1>
          <p className="mt-4 max-w-md text-lg text-text-subdued">{PAGE_INTRO}</p>

          <div className="mt-12">
            <InvitationForm />
          </div>

          <div className="mt-16 flex flex-col gap-16">
            <LocationBlock />
            <NewsletterLetter />
          </div>
        </div>
      </div>
    </div>
  );
}
