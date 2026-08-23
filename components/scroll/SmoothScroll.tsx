"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * Why Lenis over native `scroll-behavior: smooth`:
 *
 * Native smooth scrolling only smooths *scroll-to* jumps (anchor links,
 * `scrollIntoView`). It gives no interpolated, per-frame scroll value to
 * hook animations to — any future scroll-scrubbed reveal or GSAP
 * ScrollTrigger pin/scrub section would need exactly that (the site had
 * one, the home hero's Values Manifesto, since removed). Lenis
 * normalizes wheel/touch input into a single interpolated scroll
 * position that Motion's `useScroll` and GSAP's ScrollTrigger can both
 * read — native scroll-behavior can't provide that value at all.
 * Everywhere that doesn't need scroll-linked animation, Lenis just
 * feels like a slightly smoothed native scroll.
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
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const pathname = usePathname();

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
    lenisRef.current = instance;
    setLenis(instance);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  // The App Router preserves scroll position across client-side
  // navigation, but every room is its own self-contained page that should
  // open at its top. Without this, arriving at a short page from deep
  // inside a long one lands the visitor scrolled past the content —
  // indistinguishable from the "blank page" this site kept showing on
  // secondary routes. Reset
  // instantly on route change (a smooth scroll-to-top here would drag the
  // visitor through the old page's distance). Reduced motion: Lenis isn't
  // created, so the plain window.scrollTo fallback runs.
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
