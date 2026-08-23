"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { pageTransition } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { ReactNode } from "react";

/**
 * A subtle fade+drift between routes, not a heavy wipe — see lib/motion.ts
 * for why: a full-page wipe on every navigation competes with the Values
 * Manifesto for being the site's one big authored motion moment. This
 * stays in the background so route changes feel considered, not stalled.
 *
 * Deliberately NOT `AnimatePresence mode="wait"`. That mode keeps the
 * outgoing page mounted until its exit animation completes, then mounts
 * the incoming page — it depends on Motion's exit-complete callback
 * firing to swap children. On client-side navigation in the App Router
 * (React 19 + Motion), that callback can stall, leaving the incoming
 * page stuck at its `initial` state (`opacity: 0`) — the page renders but
 * is invisible until some later interaction forces a re-render. This was
 * the real "page opens blank until I click" bug on The Library, The
 * Screening Room, and every secondary route.
 *
 * A keyed `motion.div` (key = pathname) has no exit dependency: React
 * unmounts the old page and mounts the new one in the same commit, and
 * the new wrapper runs its own `initial → animate` entrance on mount.
 * The trade-off is losing the outgoing page's fade-out — a cosmetic
 * nicety, not worth an entire page that sometimes never appears.
 *
 * Deliberately NOT `initial={false}`. That prop doesn't just skip this
 * wrapper's own first-load fade — Motion's `presenceContext.initial`
 * check (use-visual-state.mjs::makeLatestValues) unconditionally blocks
 * the *initial* animation for every motion component anywhere inside the
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
    <motion.div key={pathname} variants={pageTransition} initial="initial" animate="animate">
      {children}
    </motion.div>
  );
}
