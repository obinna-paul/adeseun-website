"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * A subtle trailing dot, gold-ink, that follows the pointer inside any
 * element marked `data-cursor-zone` (globals.css sets `cursor: none` only
 * inside those zones — everywhere else keeps the native cursor).
 *
 * - Pointer position drives a spring, never useState (emil-design-eng:
 *   useState re-renders the tree on every mousemove and collapses on
 *   mobile; useMotionValue/useSpring interpolate off the render cycle).
 * - Disabled entirely on touch/coarse pointers and under
 *   prefers-reduced-motion — this is decoration, not a functional cursor
 *   replacement, so it never gets to compromise usability.
 * - Eligibility is read via useSyncExternalStore, not state-set-in-effect:
 *   the server (and the client's first paint, before hydration) always
 *   read `false`, so there's no hydration mismatch, and no cascading
 *   render from calling setState synchronously inside an effect.
 */

function subscribe(onChange: () => void) {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  fine.addEventListener("change", onChange);
  reduced.addEventListener("change", onChange);
  return () => {
    fine.removeEventListener("change", onChange);
    reduced.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduced;
}

function getServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 340, damping: 32, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 340, damping: 32, mass: 0.4 });

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-gold-ink mix-blend-multiply"
      style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
    />
  );
}
