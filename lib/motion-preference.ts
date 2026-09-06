"use client";

/**
 * The site's single source of truth for "should motion be reduced?" —
 * the OS `prefers-reduced-motion` media query, read through a tiny
 * module-level external store (subscribe / getSnapshot) via
 * `useSyncExternalStore`, the same hydration-safe pattern CustomCursor
 * and MagneticButton use against their own media queries.
 *
 * There used to be a second input here too: a manual footer toggle
 * letting a visitor override the OS preference in either direction,
 * persisted in localStorage and synced across tabs. Removed per direct
 * request (the toggle came out of the footer UI); this store went back
 * to being a plain reflection of the OS query now that it's the only
 * remaining input.
 *
 * `getServerSnapshot` returns `false` (never reduced) so server HTML and
 * the first client paint always agree — a reduce-preferring visitor
 * briefly gets the full-motion tree for one frame before this resolves.
 */

type Listener = () => void;
const listeners = new Set<Listener>();

let cachedReduced: boolean | null = null;

function osPrefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// getSnapshot must be referentially stable between changes; cache the
// last computed boolean and only recompute when we've been notified.
function getSnapshot(): boolean {
  if (cachedReduced === null) cachedReduced = osPrefersReduced();
  return cachedReduced;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(onChange: Listener): () => void {
  listeners.add(onChange);
  cachedReduced = osPrefersReduced();
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMediaChange = () => {
    cachedReduced = osPrefersReduced();
    for (const l of listeners) l();
  };
  mql.addEventListener("change", onMediaChange);
  return () => {
    listeners.delete(onChange);
    mql.removeEventListener("change", onMediaChange);
  };
}

export const motionPreferenceStore = { subscribe, getSnapshot, getServerSnapshot };
