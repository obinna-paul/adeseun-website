"use client";

import { useEffect, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowsOutSimple } from "@phosphor-icons/react/dist/ssr";
import type { CursorVariant } from "./CursorProvider";

/**
 * A trailing dot that expands into a labeled circle over links/buttons,
 * or an "expand" icon over images — inside any `data-cursor-zone`
 * element (globals.css sets `cursor: none` only there; native cursor
 * stays everywhere else, and always native on touch/coarse pointers).
 *
 * The dot→circle transition is `scale` on a single fixed-size (40px)
 * element, not animated `width`/`height` — emil-design-eng's
 * transform/opacity-only rule for anything that runs often, and a
 * pointer trailing the mouse across a whole page qualifies. Background/
 * border color and text opacity are cheap compositor-friendly
 * properties too, so the whole transition stays off the main thread.
 *
 * - Pointer position drives a spring, never useState (would re-render
 *   the tree on every mousemove — see CursorProvider's own note on why
 *   variant/text, which change rarely, are the only part that's state).
 * - Eligibility is read via useSyncExternalStore, not state-set-in-effect:
 *   server and first client paint always read `false`, so there's no
 *   hydration mismatch and no cascading render from an effect calling
 *   setState synchronously.
 *
 * The resting dot keeps the original `mix-blend-multiply` (reads well
 * against the site's light "Alabaster Gallery" ground, and it's small
 * enough that the rare crossing of a dark section is a non-issue). The
 * expanded circle drops blend mode — a semi-transparent *gold* border is
 * an explicit requirement, and multiply would mud it toward black over
 * the Foyer/Invitation's dark portraits, undermining the one color the
 * brief actually asked for.
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

const SIZE = 40; // px — the brief's "40px circle"; the resting dot is this, scaled down
const DOT_SCALE = 0.2; // 40px * 0.2 = 8px resting dot, matching the original dot size

export function CustomCursor({ variant, text }: { variant: CursorVariant; text: string }) {
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

  const expanded = variant !== "default";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border border-solid"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: SIZE,
        height: SIZE,
        mixBlendMode: expanded ? "normal" : "multiply",
      }}
      animate={{
        scale: expanded ? 1 : DOT_SCALE,
        backgroundColor: expanded ? "hsla(42, 55%, 42%, 0)" : "hsla(40, 58%, 34%, 1)",
        borderColor: expanded ? "hsla(42, 55%, 42%, 0.55)" : "hsla(42, 55%, 42%, 0)",
      }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
    >
      <AnimatePresence>
        {variant === "link" && text && (
          <motion.span
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.08em] text-gold-ink"
          >
            {text}
          </motion.span>
        )}
        {variant === "image" && (
          <motion.span
            key="expand-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-gold-ink"
          >
            <ArrowsOutSimple size={16} weight="light" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
