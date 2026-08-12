"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Why Lenis over native `scroll-behavior: smooth`:
 *
 * Native smooth scrolling only smooths *scroll-to* jumps (anchor links,
 * `scrollIntoView`). It gives no interpolated, per-frame scroll value to
 * hook animations to — and the Foyer's Values Manifesto (scroll-scrubbed
 * reveal) and any future GSAP ScrollTrigger pin/scrub sections need
 * exactly that. Lenis normalizes wheel/touch input into a single
 * interpolated scroll position that Motion's `useScroll` and GSAP's
 * ScrollTrigger can both read — native scroll-behavior can't provide that
 * value at all. Everywhere that doesn't need scroll-linked animation,
 * Lenis just feels like a slightly smoothed native scroll.
 *
 * Skipped entirely under prefers-reduced-motion — those visitors get
 * plain native scrolling, not a slowed-down version of the smoothing.
 */

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // matches ease-gallery-out's character
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);
    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
