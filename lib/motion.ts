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
