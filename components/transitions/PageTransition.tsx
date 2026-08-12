"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { pageTransition } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { ReactNode } from "react";

/**
 * A subtle fade+drift between routes, not a heavy wipe — see lib/motion.ts
 * for why: a full-page wipe on every navigation competes with the Values
 * Manifesto for being the site's one big authored motion moment. This
 * stays in the background so route changes feel considered, not stalled.
 *
 * `mode="wait"` — the outgoing page fully exits before the incoming page
 * enters, so nothing overlaps or jumps.
 *
 * Deliberately NOT `initial={false}` on AnimatePresence. That prop
 * doesn't just skip this wrapper's own first-load fade — Motion's
 * `presenceContext.initial === false` check (see
 * use-visual-state.mjs::makeLatestValues) unconditionally blocks the
 * *initial* animation for every motion component anywhere inside the
 * tree, overriding each one's own explicit `initial` prop. That silently
 * neutered the hero's entire entrance choreography (headline blur-in,
 * portrait reveal delay, everything) on first load — the one thing this
 * site's first section exists to do. The trade-off: the outer page
 * container itself now also fades in (~0.36s) on the very first visit,
 * not just on route changes. That's a fine cost — it finishes well
 * before the hero's own choreography even starts (t≈0.65s) — for not
 * breaking every entrance animation on every page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    // Reduced motion: no animated transition, just render the page.
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
