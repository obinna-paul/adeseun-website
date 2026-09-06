"use client";

import { useSyncExternalStore } from "react";
import { motionPreferenceStore } from "./motion-preference";

/**
 * A safe replacement for Motion's own `useReducedMotion()`, reading the
 * shared `motionPreferenceStore` (lib/motion-preference.ts) rather than
 * the media query directly.
 *
 * Motion's own hook reads `matchMedia` synchronously on the first client
 * render (not deferred to an effect), which breaks hydration: the server
 * renders assuming "not reduced" (no OS preference to read), so on a
 * reduce-preferring browser the client's first paint disagrees with the
 * server HTML immediately — reproduced via Playwright with
 * `reducedMotion: 'reduce'` on every section that branched its JSX.
 *
 * The store's `getServerSnapshot` returns `false`, so server and first
 * client paint always agree — same pattern as CustomCursor and
 * MagneticButton. Trade-off: a reduced-motion visitor briefly mounts the
 * full-motion tree for one frame before this flips true. That one-frame
 * cost beats a hydration mismatch that discards and re-renders the
 * subtree client-side.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    motionPreferenceStore.subscribe,
    motionPreferenceStore.getSnapshot,
    motionPreferenceStore.getServerSnapshot,
  );
}
