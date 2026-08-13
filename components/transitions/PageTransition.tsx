"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { pageTransition } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import type { ReactNode } from "react";

/**
 * A subtle fade+drift on the incoming page, not a heavy wipe — see
 * lib/motion.ts for why: a full-page wipe on every navigation competes
 * with the Values Manifesto for being the site's one big authored motion
 * moment. This stays in the background so route changes feel considered,
 * not stalled.
 *
 * No `AnimatePresence`/`mode="wait"` (real bug, reported live: certain
 * pages loaded blank after navigating in, requiring several reloads —
 * and needed a click before anything responded). `mode="wait"` makes the
 * *incoming* page wait for the *outgoing* page's `exit` animation to
 * report completion before it ever mounts. That completion signal
 * relying on an async callback firing is exactly the kind of thing that
 * can silently get stuck — and when it does, the outgoing page is left
 * sitting at its own `exit` end-state (`opacity: 0`), which is a
 * genuinely blank page: not slow, not still loading, just an invisible
 * div with nothing behind it, until some other event (a reload, a click
 * forcing React to reconcile) breaks the stall. Dropping the exit
 * animation removes the failure mode entirely: the new page's
 * `motion.div` (keyed by `pathname`, so it's a fresh mount every
 * navigation) fades itself in immediately, and the outgoing one is just
 * unmounted by React the normal way, with nothing async gating it. The
 * only cost is losing the outgoing page's fade-out — a page swap without
 * a cross-fade still reads as "considered," a page that sometimes never
 * finishes loading does not.
 *
 * Deliberately still not `initial={false}` — that would also block the
 * *initial* animation for every motion component anywhere inside the
 * tree, overriding each one's own explicit `initial` prop, which
 * silently neutered the hero's entire entrance choreography (headline
 * blur-in, portrait reveal delay, everything) on first load. The
 * trade-off: this wrapper's own fade-in (~0.36s) also plays on the very
 * first visit, not just on route changes — a fine cost, since it
 * finishes well before the hero's own choreography starts (t≈0.65s).
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
