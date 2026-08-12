import type { Transition, Variants } from "motion/react";
import { duration, ease } from "./design-tokens";

/**
 * The animation vocabulary — named presets tied to real moments from
 * The Walkthrough, not abstract "fade-in-1/2/3". Every entering-element
 * variant uses ease.out (emil-design-eng: entering → ease-out); anything
 * that moves on screen once mounted uses ease.inOut.
 *
 * Components should read a visitor's reduced-motion preference via
 * Motion's `useReducedMotion()` and pass `initial={false}` when true —
 * see components/transitions/PageTransition.tsx for the pattern.
 */

export const transitions = {
  gentleReveal: { duration: duration.reveal + 0.4, ease: ease.out } satisfies Transition,
  authoritativeEntrance: { duration: duration.cinematic, ease: ease.out } satisfies Transition,
  shelfPull: { duration: duration.reveal, ease: ease.out } satisfies Transition,
  nookExpand: { duration: duration.settle, ease: ease.out } satisfies Transition,
  manifestoLine: { duration: duration.reveal + 0.38, ease: ease.out } satisfies Transition,
  press: { duration: duration.press, ease: ease.out } satisfies Transition,
};

/** General-purpose scroll/section reveal — most content on the site. */
export const gentleReveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitions.gentleReveal },
};

/** Hero-scale entrances (Foyer Act I, Act VII) — more weight, held longer. */
export const authoritativeEntrance: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transitions.authoritativeEntrance },
};

/** The Library's reading-nook panel opening, scaling from its trigger. */
export const nookExpand: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitions.nookExpand },
};

/** The Foyer's Values Manifesto, one line at a time. */
export const manifestoLine: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: transitions.manifestoLine },
};

/** Button/control press feedback — pair with whileTap. */
export const pressFeedback = { scale: 0.97 };

/** whileInView config used across the site: animate once, a little early. */
export const viewportOnce = { once: true, amount: 0.3 } as const;

/**
 * Stagger a group of gentleReveal children. Keep delays short (30–80ms) —
 * taste-skill: long stagger delays make the interface feel slow.
 */
export function staggerChildren(staggerMs = 60): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerMs / 1000 },
    },
  };
}

/**
 * Page transition — a subtle fade, not a heavy wipe. A wipe reads as a
 * loading curtain on repeat visits; restraint here matches "spend your
 * boldness in one place" — the Values Manifesto owns the site's one big
 * motion moment, not route changes.
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: duration.settle, ease: ease.out } },
  exit: { opacity: 0, y: -8, transition: { duration: duration.reveal, ease: ease.standard } },
};

/**
 * Hero headline lines — blur-in + letter-spacing collapse.
 *
 * `filter` and `letter-spacing` aren't in emil-design-eng's transform/
 * opacity-only fast path (they trigger paint, not just compositing). The
 * rule exists to protect *frequent* animations — hovers, scroll reveals,
 * anything retriggered often. This runs exactly once, on two short text
 * nodes, on initial page load. That's the legitimate exception, not a
 * violation: cost is negligible, and nothing else on the page is
 * animating at the same moment competing for paint budget.
 */
export const heroLine: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(14px)", letterSpacing: "0.12em" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    letterSpacing: "-0.01em",
    transition: { duration: duration.cinematic + 0.1, ease: ease.out },
  },
};

/** Wraps heroLine children with a cinematic (not micro-UI) stagger — see HeroSection's choreography comment for why 220ms, not the usual 30–80ms. */
export const heroLineGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.15 } },
};

// Both delays below (2.1s) are baked into the variant itself, not passed
// as a separate `transition` prop at the call site — Motion resolves a
// variant's own `transition` and a component's `transition` prop through
// a merge whose precedence isn't worth relying on. One source of truth
// here is unambiguous; see HeroSection.tsx's choreography comment for
// why 2.1s (a beat after the headline settles).

/** Hero subhead — a quieter, more delayed fade-up than gentleReveal. */
export const heroSubhead: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.settle + 0.24, ease: ease.out, delay: 2.1 },
  },
};

/** Hero CTA row — appears last, a light stagger between the two buttons. */
export const heroActions: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 2.1 } },
};
export const heroAction: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.settle, ease: ease.out } },
};

/**
 * Magnetic button spring — damped, not snappy. "Luxurious" hover means
 * the button trails the cursor a beat behind, like it has real mass.
 * Stiffer than the cursor dot's spring (that one has to feel instant and
 * track precisely; this one is decorative and can afford weight).
 */
export const magneticSpring = { stiffness: 150, damping: 18, mass: 0.6 } as const;

/**
 * The Library modal's cover tilt — mouse position drives rotation through
 * a spring rather than 1:1, per emil-design-eng's "spring-based mouse
 * interactions" (tying a value directly to cursor position with no
 * damping reads as artificial). Slightly stiffer than magneticSpring: a
 * book responding to a hand should feel lighter than a button with pull.
 */
export const bookTiltSpring = { stiffness: 180, damping: 20, mass: 0.4 } as const;

