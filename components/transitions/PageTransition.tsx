"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { pageTransition } from "@/lib/motion";
import type { ReactNode } from "react";

/**
 * A subtle fade+drift between routes, not a heavy wipe — see lib/motion.ts
 * for why: a full-page wipe on every navigation competes with the Values
 * Manifesto for being the site's one big authored motion moment. This
 * stays in the background so route changes feel considered, not stalled.
 *
 * `mode="wait"` — the outgoing page fully exits before the incoming page
 * enters, so nothing overlaps or jumps.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) {
    // Reduced motion: no animated transition, just render the page.
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
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
