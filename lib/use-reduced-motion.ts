"use client";

import { useSyncExternalStore } from "react";

/**
 * A safe replacement for Motion's own `useReducedMotion()`.
 *
 * Motion's hook reads `matchMedia` synchronously on the very first
 * client render (not deferred to an effect), which is exactly what
 * breaks hydration: the server always renders assuming "not reduced"
 * (it has no OS preference to read), so on any browser that actually
 * has reduced-motion enabled, the client's first paint disagrees with
 * the server-rendered HTML immediately — confirmed via Playwright with
 * `reducedMotion: 'reduce'`, which reliably reproduced a hydration
 * mismatch on every section that branched its JSX (not just swapped a
 * prop value) based on Motion's hook.
 *
 * `getServerSnapshot` always returns `false`, so server and first
 * client paint always agree — same pattern already used in
 * CustomCursor and MagneticButton for the same reason. The trade-off:
 * a reduced-motion user's browser briefly mounts the full-motion tree
 * before this flips true and the reduced branch takes over. That's a
 * one-frame cost; a hydration mismatch that discards and re-renders
 * the whole subtree client-side is a worse one.
 */

function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
