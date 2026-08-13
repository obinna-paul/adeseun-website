"use client";

import { useSyncExternalStore } from "react";
import { motionPreferenceStore, getMotionChoice, type MotionChoice } from "./motion-preference";

/**
 * A safe replacement for Motion's own `useReducedMotion()`, now reading
 * the shared `motionPreferenceStore` (lib/motion-preference.ts) rather
 * than the media query directly. That store is the OR of the OS
 * `prefers-reduced-motion` query and the visitor's explicit footer-toggle
 * choice, so every call site here automatically honors both.
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

/**
 * The raw three-state user choice (`"system" | "reduced" | "full"`), for
 * the footer toggle to reflect and drive. Subscribes to the same store so
 * it re-renders when the choice changes in this tab or another one.
 * Server snapshot is always `"system"` for the same hydration-safety
 * reason as above.
 */
export function useMotionChoice(): MotionChoice {
  return useSyncExternalStore(
    motionPreferenceStore.subscribe,
    getMotionChoice,
    () => "system" as MotionChoice,
  );
}
