"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registered once, at module scope. `registerPlugin` is idempotent —
 * GSAP documents calling it multiple times (e.g. across Fast Refresh
 * reloads in dev) as a safe no-op, so no extra guard is needed. Import
 * `gsap`/`ScrollTrigger` from this module (not directly from "gsap")
 * anywhere a scroll-pin/scrub pattern is needed — this is the one place
 * the plugin gets wired up.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * GSAP doesn't accept our cubic-bezier arrays directly the way Motion
 * does. `power3.out` is the closest built-in match to
 * --ease-gallery-out's character (strong, fast-starting deceleration) —
 * an approximation, not a re-derivation, so motion still reads as one
 * family across the Motion-driven and GSAP-driven parts of the site.
 */
export const galleryEase = "power3.out";
