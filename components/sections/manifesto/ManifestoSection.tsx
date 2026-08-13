"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useScroll, useTransform, type MotionValue } from "motion/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useMobileDetect } from "@/lib/use-mobile-detect";
import { gentleReveal, viewportOnce } from "@/lib/motion";
import { ManifestoBackground } from "./ManifestoBackground";
import { ValueIcon } from "./ValueIcon";
import { MANIFESTO_BEATS, CLOSING_LINE, JOURNEY_HREF, type Beat } from "./manifesto-content";

/**
 * Act IV — The Values Manifesto. See The Walkthrough for the original
 * spec; ARCHITECTURE.md reserved GSAP specifically for this section's
 * scroll-pin/scrub pattern, following taste-skill's canonical Sticky-
 * Stack skeleton (5.A): `start: "top top"` (not "top center" — that's
 * the skeleton's named common failure, where the trigger fires mid-
 * scroll instead of pinning cleanly at the viewport top), `pin`, and
 * `scrub` on a timeline built from the section's own ScrollTrigger.
 *
 * ── How the pin works, and why it doesn't jump ──────────────────────
 * The outer <section> is tall (`BEATS.length * 100vh`) — that height
 * *is* the scroll distance the pin consumes; GSAP's default
 * `pinSpacing: true` accounts for it in document flow automatically,
 * which is what prevents the page jumping when the pin engages or
 * releases. The inner pinned element is a fixed `h-[100dvh]`, never
 * resized by its content, so nothing about the animation itself can
 * push layout around. Every scrubbed tween animates only `opacity`,
 * `transform`, and `filter` — never a layout-triggering property.
 *
 * ── Timeline shape ───────────────────────────────────────────────────
 * One "unit" of scrub-time per beat (9 beats: 5 values + 4 breathing
 * quotes). Within each unit: enter over the first 30%, hold flat
 * through the middle, exit over the final 30% — exit and the next
 * beat's enter meet exactly at the unit boundary, so there's a beat of
 * pure background between them. That's deliberate, not a gap to close:
 * the brief asks for "breathing moments," and a held instant of just
 * the ink drifting, with nothing to read, is one. `ease: "none"` on
 * every scrubbed tween, per the canonical skeleton — `scrub`'s own
 * smoothing already supplies the feel; stacking a second easing curve
 * on top of it fights the scrub rather than reading as decoration.
 *
 * Reduced motion: no pin, no ScrollTrigger, no canvas. Every beat
 * renders as an ordinary stacked block in document flow, with a plain
 * opacity-only reveal on scroll into view — motion removed, nothing
 * hidden (emil-design-eng: reduced motion means fewer, gentler
 * animations, not zero, and never less content).
 *
 * Mobile art direction: narrow/touch viewports (`useMobileDetect`) get
 * their own `ManifestoMobile` (below), not the GSAP pin. A `pin: true`
 * full-viewport takeover is architecturally risky on mobile browsers
 * specifically — dynamic address-bar chrome resizes the real viewport
 * mid-scroll, which GSAP's pin math doesn't see happen.
 *
 * `ManifestoMobile` uses CSS `position: sticky` instead of a pin to get
 * the same visual result GSAP's `pin` gives desktop — the beat stack
 * holds still on screen while its own scroll distance passes, only
 * opacity/y/blur cross-fading between beats — without pin's fragility:
 * `sticky` is computed by the browser from the *current* viewport every
 * frame, so it can't desync the way a cached pin offset can when chrome
 * resizes. (An earlier version gave each beat its own independent
 * `useScroll({ target })`, outside a sticky container — that made every
 * beat visibly scroll past with the page instead of holding in place,
 * which is a different, weaker effect than what this replaces: real
 * feedback wanted mobile to match desktop's "fixed at the center,
 * statements fade in and out" feel exactly, not just avoid the earlier
 * "piling all the text" flaw.) One `useScroll` over the whole tall
 * wrapper drives every beat's opacity/y/blur from a shared progress
 * value, with each beat's enter/hold/exit window mapped to the same
 * ENTER/EXIT_START fractions as the desktop timeline below — the two
 * should read as the same choreography, just driven by a different
 * mechanism. `ManifestoStatic` (below) is reserved for
 * `prefers-reduced-motion` only — a real, motion-free fallback, not
 * reused as a mobile substitute.
 */

const UNIT = 1;
const ENTER = 0.3;
const EXIT_START = 0.7;

export function ManifestoSection() {
  const reduced = usePrefersReducedMotion();
  const lowPower = useMobileDetect();
  const useGsapPin = !reduced && !lowPower;
  const wrapperRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!useGsapPin || !wrapperRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      const beatEls = gsap.utils.toArray<HTMLElement>(".manifesto-beat");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      beatEls.forEach((el, i) => {
        const t = i * UNIT;
        const textEl = el.querySelector("[data-beat-text]");
        const iconPaths = el.querySelectorAll(".manifesto-icon-path");

        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: ENTER }, t).to(
          el,
          { autoAlpha: 0, duration: UNIT - EXIT_START },
          t + EXIT_START,
        );

        if (textEl) {
          tl.fromTo(
            textEl,
            { y: 18, filter: "blur(10px)" },
            { y: 0, filter: "blur(0px)", duration: ENTER },
            t,
          ).to(textEl, { y: -18, filter: "blur(10px)", duration: UNIT - EXIT_START }, t + EXIT_START);
        }

        if (iconPaths.length) {
          tl.fromTo(
            iconPaths,
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: ENTER * 0.85, stagger: 0.04 },
            t + 0.03,
          );
        }
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [useGsapPin]);

  if (reduced) {
    return <ManifestoStatic />;
  }

  if (lowPower) {
    return <ManifestoMobile />;
  }

  return (
    <>
      {/*
       * ManifestoClose is a genuine sibling AFTER this section, not an
       * absolutely-positioned child living inside it. It was originally
       * built as a child, anchored to the wrapper's own bottom edge, on
       * the assumption that "the pin's release point" and "the page's
       * last scrollable pixel" were the same place. They're not: at the
       * true end of the page, GSAP's pin was still `position: fixed`
       * with computed opacity 1, permanently covering the close block
       * underneath it — verified via computed-style inspection, not
       * assumption. The pin needs scrollable room *after* its release
       * point to hand off into; when the pinned section is the last
       * thing on the page, there is none unless the next section is a
       * real sibling that adds its own page height.
       */}
      <section
        ref={wrapperRef}
        aria-label="Her values"
        className="relative"
        style={{ height: `${MANIFESTO_BEATS.length * 100}vh` }}
      >
        <div ref={pinRef} className="relative h-[100dvh] w-full overflow-hidden bg-hero-ground">
          <ManifestoBackground progressRef={progressRef} />
          <div className="relative z-10 flex h-full w-full items-center justify-center px-gutter">
            {MANIFESTO_BEATS.map((beat, i) => (
              <div
                key={i}
                className="manifesto-beat pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center invisible"
              >
                {beat.kind === "value" ? (
                  <>
                    <ValueIcon icon={beat.icon} />
                    <p
                      data-beat-text
                      className="mt-8 max-w-3xl text-balance font-display text-3xl font-semibold leading-tight text-text-on-dark sm:text-5xl"
                    >
                      {beat.text}
                    </p>
                  </>
                ) : (
                  <p
                    data-beat-text
                    className="max-w-xl text-balance font-display text-xl italic leading-snug text-text-on-dark/85 sm:text-2xl"
                  >
                    {beat.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <ManifestoClose />
    </>
  );
}

/** The unpinned close — not part of the scrubbed timeline, a real section in normal flow right after the pin releases. */
function ManifestoClose() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-10 bg-hero-ground px-gutter text-center">
      <motion.p
        className="max-w-3xl text-balance font-display text-4xl font-semibold leading-tight text-text-on-dark sm:text-6xl"
        variants={gentleReveal}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        {CLOSING_LINE}
      </motion.p>
      <motion.div variants={gentleReveal} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <JourneyLink />
      </motion.div>
    </div>
  );
}

function JourneyLink() {
  return (
    <Link
      href={JOURNEY_HREF}
      data-cursor="link"
      data-cursor-text="Explore"
      className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-[0.15em] text-text-on-dark/80 transition-colors duration-150 ease-gallery-standard hover:text-gold"
    >
      <span className="relative">
        Learn more about her journey
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-gallery-out group-hover:scale-x-100" />
      </span>
      <span aria-hidden="true" className="transition-transform duration-300 ease-gallery-out group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}

/**
 * Mobile's answer to the pin: a `sticky` container the same tall wrapper
 * (`BEATS.length * 100vh`) drives, so it holds on screen for exactly the
 * scroll distance one GSAP-pinned unit would consume — the sticky
 * element itself never moves once stuck, matching desktop's held-still
 * frame exactly, just without an actual `position: fixed` pin.
 */
function ManifestoMobile() {
  const wrapperRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  return (
    <>
      <section
        ref={wrapperRef}
        aria-label="Her values"
        className="relative"
        style={{ height: `${MANIFESTO_BEATS.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-hero-ground px-6 text-center">
          {MANIFESTO_BEATS.map((beat, i) => (
            <ManifestoMobileBeat
              key={i}
              beat={beat}
              index={i}
              total={MANIFESTO_BEATS.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </section>
      <ManifestoClose />
    </>
  );
}

function ManifestoMobileBeat({
  beat,
  index,
  total,
  scrollYProgress,
}: {
  beat: Beat;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // This beat's slice of the wrapper's overall 0–1 scroll progress —
  // [index, index+1] out of [0, total] — mapped through the same
  // ENTER/EXIT_START fractions the desktop GSAP timeline uses, so both
  // versions spend the same proportion of scroll on enter/hold/exit.
  const enterStart = index / total;
  const enterEnd = (index + ENTER) / total;
  const exitStart = (index + EXIT_START) / total;
  const exitEnd = (index + 1) / total;

  const opacity = useTransform(scrollYProgress, [enterStart, enterEnd, exitStart, exitEnd], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [enterStart, enterEnd, exitStart, exitEnd], [18, 0, 0, -18]);
  const blur = useTransform(scrollYProgress, [enterStart, enterEnd, exitStart, exitEnd], [10, 0, 0, 10]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity }}
    >
      <motion.div style={{ y, filter }} className="flex flex-col items-center gap-6">
        {beat.kind === "value" ? (
          <>
            <ValueIcon icon={beat.icon} staticDraw />
            <p className="max-w-2xl text-balance font-display text-3xl font-semibold leading-tight text-text-on-dark">
              {beat.text}
            </p>
          </>
        ) : (
          <p className="max-w-xl text-balance font-display text-xl italic leading-snug text-text-on-dark/85">
            {beat.text}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Reduced-motion fallback: same content, no pin, no scrub, no canvas — a plain stacked column. */
function ManifestoStatic() {
  return (
    <section aria-label="Her values" className="bg-hero-ground px-gutter py-room text-center">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-16">
        {MANIFESTO_BEATS.map((beat, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-6"
            variants={gentleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {beat.kind === "value" ? (
              <>
                <ValueIcon icon={beat.icon} staticDraw />
                <p className="text-balance font-display text-3xl font-semibold leading-tight text-text-on-dark sm:text-4xl">
                  {beat.text}
                </p>
              </>
            ) : (
              <p className="max-w-xl text-balance font-display text-xl italic leading-snug text-text-on-dark/85">
                {beat.text}
              </p>
            )}
          </motion.div>
        ))}

        <motion.p
          className="mt-8 text-balance font-display text-4xl font-semibold leading-tight text-text-on-dark sm:text-5xl"
          variants={gentleReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {CLOSING_LINE}
        </motion.p>
        <JourneyLink />
      </div>
    </section>
  );
}
