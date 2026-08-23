"use client";

import { useRef, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { magneticSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Hoisted to module scope, not created inside render — a motion-wrapped
// component built during render gets a fresh identity every render,
// which React then unmounts and remounts, resetting animation state.
const MotionLink = motion.create(Link);

/**
 * A button that trails the cursor within its own bounds ("magnetic pull")
 * and shows a soft glow following the pointer ("glow trace") — emerald on
 * the primary variant (the site's new dominant accent), a terracotta
 * border-hover on the secondary variant, so the two supporting accents
 * from the Ivory Atrium & Emerald Brass palette each get one clear job
 * rather than both defaulting to the old single gold accent. Used for the
 * home hero's primary/secondary CTAs; reusable anywhere a "luxurious"
 * hover is called for (e.g. The Boardroom's booking CTA later).
 *
 * Both effects are inert on touch/coarse pointers (magnetism needs
 * continuous hover, which touch doesn't have) and under
 * prefers-reduced-motion — see `eligible` below, read the same
 * useSyncExternalStore way as CustomCursor, for the same hydration-safety
 * reason (server and first client paint must agree: no motion).
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

const MAX_PULL = 10; // px — restrained; this is a hint of attraction, not a cartoon lunge

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  /**
   * Secondary only. The site is light-themed everywhere except the home
   * hero (taste-skill's Page Theme Lock) — real bug, reported live: the
   * secondary variant's border/text colors were hardcoded for that one
   * dark exception (`text-on-dark`), so every secondary button placed on
   * an ordinary light section (Home's book/media/businesses CTAs) came
   * out as near-invisible light-on-light, only readable on hover once
   * the glow overlay lit it up. Default is now light-appropriate; pass
   * `onDark` for the hero's own dark-background usage.
   */
  onDark?: boolean;
  className?: string;
  /** Only meaningful without `href` — lets this submit a surrounding `<form>` (e.g. The Invitation). */
  type?: "button" | "submit";
  disabled?: boolean;
  /**
   * Smaller padding/type below `sm`, full size at `sm`+ — for spots like
   * the Hero CTA row where two buttons need to sit side by side on a
   * narrow phone width. A real prop with its own ternary branch, not a
   * `className` override: layering a second `px-*`/`text-*` utility on
   * top of the base classes' own is a known Tailwind footgun here (two
   * same-specificity utilities of the same type don't reliably resolve
   * by source order — see BookModal's cover-width bug), so size is a
   * mutually-exclusive branch instead, same fix pattern as that bug.
   */
  dense?: boolean;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  onDark = false,
  className,
  type = "button",
  disabled,
  dense = false,
}: MagneticButtonProps) {
  const eligible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue("50%");
  const glowY = useMotionValue("50%");
  const springX = useSpring(x, magneticSpring);
  const springY = useSpring(y, magneticSpring);
  // A reactive CSS string built from motion values — updates on the
  // compositor via WAAPI, not through React re-renders, so it stays
  // smooth even while the button's own layout is otherwise idle.
  const glowBackground = useMotionTemplate`radial-gradient(160px circle at ${glowX} ${glowY}, hsl(150 45% 55% / 0.35), transparent 70%)`;

  function handlePointerMove(e: MouseEvent<HTMLElement>) {
    if (!eligible || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    // Glow follows the raw pointer position (cheap: just two CSS custom
    // properties feeding a radial-gradient background, no layout cost).
    glowX.set(`${relX}px`);
    glowY.set(`${relY}px`);

    // Magnetic pull: offset from center, clamped, spring-damped.
    const offsetX = relX - rect.width / 2;
    const offsetY = relY - rect.height / 2;
    x.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, offsetX * 0.35)));
    y.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, offsetY * 0.35)));
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  const base = cn(
    "group relative inline-flex items-center justify-center overflow-hidden rounded-control font-mono tracking-wide transition-colors duration-150 ease-gallery-standard active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none",
    dense ? "px-2.5 py-2.5 text-xs sm:px-8 sm:py-3.5 sm:text-sm" : "px-8 py-3.5 text-sm",
    variant === "primary"
      ? "bg-emerald-fill text-text-on-dark shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
      : onDark
        ? "border border-text-on-dark/30 text-text-on-dark hover:border-terracotta"
        : "border border-line text-text hover:border-terracotta hover:text-terracotta-ink",
    className,
  );

  const glowOverlay = eligible && (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{ background: glowBackground }}
    />
  );

  const content = (
    <>
      {glowOverlay}
      <span className="relative z-10">{children}</span>
    </>
  );

  const motionProps = eligible
    ? {
        style: { x: springX, y: springY },
        onMouseMove: handlePointerMove,
        onMouseLeave: handlePointerLeave,
      }
    : {};

  if (href) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ref target differs (anchor vs button) by branch
      <MotionLink ref={ref as any} href={href} className={base} {...motionProps}>
        {content}
      </MotionLink>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
    <motion.button ref={ref as any} type={type} disabled={disabled} onClick={onClick} className={base} {...motionProps}>
      {content}
    </motion.button>
  );
}
