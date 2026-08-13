"use client";

import { usePrefersReducedMotion, useMotionChoice } from "@/lib/use-reduced-motion";
import { setMotionChoice } from "@/lib/motion-preference";

/**
 * A user-facing motion switch, living in the footer. `prefers-reduced-
 * motion` is an OS-level setting many visitors don't know exists or can't
 * change on a shared/managed machine — this gives them a per-site control
 * regardless. "On" means full motion; flipping it off forces the same
 * reduced path the OS query triggers (see lib/motion-preference.ts), so
 * every animation across the site stills at once.
 *
 * A real `role="switch"` with `aria-checked`, keyboard-operable as a
 * native button — not a styled div. The visible state reflects the
 * *effective* reduced-motion result (OS query OR explicit choice), so if
 * the visitor's OS already prefers reduced motion the switch shows "off"
 * out of the box, honestly matching what they'll actually see; toggling
 * it then writes an explicit override in either direction.
 *
 * Rendering is gated on the store being resolved on the client: until the
 * first client snapshot, `choice` is `"system"` and `reduced` is `false`
 * (the SSR-safe values), which is exactly the correct thing to paint
 * anyway, so there's no flash — the switch just corrects on mount for an
 * OS-reduced visitor the same one-frame way the rest of the site does.
 */
export function MotionToggle() {
  const reduced = usePrefersReducedMotion();
  // Subscribed so this re-renders when the choice changes; the value is
  // read to keep the hook active even though `reduced` drives the visual.
  useMotionChoice();
  const motionOn = !reduced;

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-text-on-dark/50">Motion</span>
      <button
        type="button"
        role="switch"
        aria-checked={motionOn}
        aria-label="Toggle site motion and animations"
        onClick={() => setMotionChoice(motionOn ? "reduced" : "full")}
        className="group relative flex h-6 w-11 shrink-0 items-center rounded-full border border-text-on-dark/25 bg-text-on-dark/5 px-0.5 transition-colors duration-200 ease-gallery-standard aria-checked:border-gold aria-checked:bg-gold-fill/30"
      >
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full bg-text-on-dark/60 transition-[transform,background-color] duration-200 ease-gallery-out group-aria-checked:translate-x-5 group-aria-checked:bg-gold"
        />
      </button>
    </div>
  );
}
