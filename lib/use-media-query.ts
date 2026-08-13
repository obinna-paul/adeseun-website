"use client";

import { useSyncExternalStore } from "react";

/**
 * Generic media-query hook, same hydration-safety shape as
 * usePrefersReducedMotion/useMobileDetect: `getServerSnapshot` always
 * returns `false`, so server and first client paint always agree, and
 * the query's real value takes over one frame after mount rather than
 * causing a hydration mismatch.
 *
 * Distinct from `useMobileDetect` (a performance gate — "skip the heavy
 * animation") — this is a layout gate, for components that need to
 * switch composition (not just decoration) at a specific breakpoint in
 * JS, not just CSS, because the switch involves something CSS alone
 * can't express (here: whether Motion's drag gesture is armed at all).
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
