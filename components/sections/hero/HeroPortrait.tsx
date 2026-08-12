"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "motion/react";

const MotionImage = motion.create(Image);

/**
 * The portrait "emerging from the dark": a radial mask that irises open
 * from roughly where her eyes would be, timed together with a filter
 * sweep (dim/soft/desaturated → full contrast) — closer to a photograph
 * developing than a generic fade-in.
 *
 * `mask-image` can't be driven by Motion's `variants` the normal way
 * (it's a derived string, not a single animatable number), so this
 * builds one motion value (`reveal`, 0→100) and feeds it into a
 * `useMotionTemplate` radial-gradient — the same "reactive CSS string"
 * technique as MagneticButton's glow. `animate()` drives that one value
 * imperatively on mount; everything downstream updates on the
 * compositor, not via React re-renders.
 */

type HeroPortraitProps = {
  /** Swap in the real photo once it exists — see the placeholder note below. */
  src?: string;
  alt: string;
};

const REVEAL_ORIGIN = "50% 38%"; // roughly eye-height in a head-and-shoulders crop

export function HeroPortrait({ src, alt }: HeroPortraitProps) {
  const reduced = useReducedMotion();
  const reveal = useMotionValue(reduced ? 100 : 0);
  const brightness = useMotionValue(reduced ? 1 : 0.28);
  const blur = useMotionValue(reduced ? 0 : 7);
  const started = useRef(false);

  // Soft-edged iris, not a hard-cut circle: the inner (opaque) stop trails
  // ~38 points behind the outer (transparent) stop as `reveal` grows, so
  // there's always a feathered gradient band between them.
  const revealInner = useTransform(reveal, (v) => Math.max(0, v - 38));
  const maskImage = useMotionTemplate`radial-gradient(circle at ${REVEAL_ORIGIN}, black ${revealInner}%, transparent ${reveal}%)`;
  const filter = useMotionTemplate`brightness(${brightness}) contrast(1.12) saturate(0.95) blur(${blur}px)`;

  useEffect(() => {
    if (reduced || started.current) return;
    started.current = true;
    // Slightly different durations so the mask "opens" a beat ahead of
    // the image fully sharpening — the shape arrives before the detail,
    // like eyes adjusting to a lit room.
    animate(reveal, 130, { duration: 2.0, ease: [0.23, 1, 0.32, 1] });
    animate(brightness, 1, { duration: 2.2, ease: [0.23, 1, 0.32, 1] });
    animate(blur, 0, { duration: 1.7, ease: [0.23, 1, 0.32, 1] });
  }, [reduced, reveal, brightness, blur]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Motion components, not plain divs: passing a MotionValue-derived
          string into React's native `style` prop only type-checks (and
          only updates on the compositor instead of via re-renders) on
          `motion.*` elements — that's why this and the image below are
          MotionImage/motion.div rather than <Image>/<div>. */}
      <motion.div className="absolute inset-0" style={{ maskImage, WebkitMaskImage: maskImage }}>
        {src ? (
          <MotionImage
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_30%]"
            style={{ filter }}
          />
        ) : (
          // Placeholder: no photo asset exists yet. This still lets the
          // reveal/filter choreography be seen and reviewed, honestly
          // labeled rather than faked as a stock photo standing in for
          // her. Swap for a real <Image src="..."> the moment one lands.
          <motion.div
            role="img"
            aria-label={alt}
            className="h-full w-full"
            style={{
              filter,
              background:
                "radial-gradient(ellipse 60% 70% at 50% 32%, hsl(42 40% 30%) 0%, hsl(230 24% 10%) 62%, hsl(230 26% 6%) 100%)",
            }}
          />
        )}
      </motion.div>

      {/* Permanent vignette — not part of the reveal, always present, for text legibility against whatever's under it. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsla(230,26%,5%,0.15) 0%, hsla(230,26%,5%,0.05) 35%, hsla(230,26%,5%,0.55) 78%, hsla(230,26%,5%,0.86) 100%)",
        }}
      />
    </div>
  );
}
