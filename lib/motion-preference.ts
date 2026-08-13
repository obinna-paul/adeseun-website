"use client";

/**
 * The site's single source of truth for "should motion be reduced?" — the
 * OR of two inputs:
 *   1. the OS `prefers-reduced-motion` media query, and
 *   2. an explicit in-page choice the visitor made via the footer toggle,
 *      persisted in localStorage.
 *
 * It's a tiny module-level external store (subscribe / getSnapshot), read
 * through `useSyncExternalStore` — the same shape usePrefersReducedMotion
 * already used against the bare media query, so every existing call site
 * keeps working unchanged and simply starts honoring the manual toggle
 * too. No React context, no provider to thread through the tree.
 *
 * ── Three user states, not two ───────────────────────────────────────
 * `"system"` (the untouched default) defers entirely to the OS query.
 * Once the visitor flips the footer toggle, their choice becomes sticky
 * (`"reduced"` / `"full"`) and overrides the OS in EITHER direction — a
 * visitor on a reduce-by-default OS who explicitly asks for full motion
 * on this one site is making an informed choice we honor, and vice
 * versa. Storing "system" rather than snapshotting the current OS value
 * means a later OS change still flows through for anyone who never
 * touched the toggle.
 *
 * ── Hydration safety ─────────────────────────────────────────────────
 * `getServerSnapshot` returns `false` (never reduced) so server HTML and
 * the first client paint always agree — identical trade-off to the old
 * hook and to CustomCursor/MagneticButton: a reduce-preferring visitor
 * briefly gets the full-motion tree for one frame before this resolves.
 */

const STORAGE_KEY = "adeseun:motion-preference";

export type MotionChoice = "system" | "reduced" | "full";

type Listener = () => void;
const listeners = new Set<Listener>();

// Cached so getSnapshot is referentially stable per state (useSyncExternalStore
// requires getSnapshot to return the same value until something actually
// changes — recomputing a fresh boolean each call is fine since booleans
// compare by value, but the choice read is cached to avoid touching
// localStorage on every render).
let cachedChoice: MotionChoice | null = null;

function readChoice(): MotionChoice {
  if (cachedChoice !== null) return cachedChoice;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    cachedChoice = stored === "reduced" || stored === "full" ? stored : "system";
  } catch {
    cachedChoice = "system";
  }
  return cachedChoice;
}

function osPrefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The effective boolean every animation gate reads. */
function computeReduced(): boolean {
  const choice = readChoice();
  if (choice === "reduced") return true;
  if (choice === "full") return false;
  return osPrefersReduced();
}

// getSnapshot must be referentially stable between changes; cache the
// last computed boolean and only recompute when we've been notified.
let cachedReduced: boolean | null = null;

function getSnapshot(): boolean {
  if (cachedReduced === null) cachedReduced = computeReduced();
  return cachedReduced;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Reflect the effective reduced state onto <html> so CSS-only animations
 * (hover transitions, keyframes, the global click-bounce) can honor a
 * *manual* "reduced" choice too — the OS `@media (prefers-reduced-motion)`
 * block in globals.css already covers the OS-level case, but it can't see
 * our localStorage toggle. Only the reduce direction is mirrored: we never
 * emit an attribute that would force motion back ON against an OS reduce
 * preference (the safe default is to stay reduced), so a "full" override
 * re-enables JS/Motion animations while leaving the OS-driven CSS block
 * untouched.
 */
function syncDom() {
  if (typeof document === "undefined") return;
  if (cachedReduced) document.documentElement.setAttribute("data-motion-reduced", "true");
  else document.documentElement.removeAttribute("data-motion-reduced");
}

function emit() {
  cachedReduced = computeReduced();
  syncDom();
  for (const l of listeners) l();
}

function subscribe(onChange: Listener): () => void {
  listeners.add(onChange);
  cachedReduced = computeReduced();
  syncDom();
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMediaChange = () => emit();
  mql.addEventListener("change", onMediaChange);
  // Cross-tab: another tab writing the preference fires a storage event.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedChoice = null;
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    mql.removeEventListener("change", onMediaChange);
    window.removeEventListener("storage", onStorage);
  };
}

export const motionPreferenceStore = { subscribe, getSnapshot, getServerSnapshot };

/** Read the raw user choice (for the toggle UI to reflect its own state). */
export function getMotionChoice(): MotionChoice {
  return readChoice();
}

/** Persist a new choice and notify every subscriber synchronously. */
export function setMotionChoice(choice: MotionChoice): void {
  cachedChoice = choice;
  try {
    if (choice === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Private-mode / storage-blocked: the in-memory cache still drives
    // this session; persistence is best-effort, not required to function.
  }
  emit();
}
