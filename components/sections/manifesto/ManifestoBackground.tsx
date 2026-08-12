"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * "Ink in water" without a video asset — no licensed footage exists for
 * this, so this builds the equivalent effect honestly rather than
 * faking a video with a static image. Soft, slow-drifting radial blooms
 * in canvas, layered with gentle independent drift plus a shared
 * parallax offset read from `progressRef` (updated every frame by
 * ManifestoSection's GSAP ScrollTrigger — no separate scroll listener
 * here, one source of truth for scroll position).
 *
 * Same canvas-2D-not-WebGL reasoning as HeroCanvas: blooming ink is a
 * flat effect, doesn't need 3D, and stays light on low-end devices.
 *
 * `progressRef` is a plain ref, not a motion value or React state — the
 * parent's GSAP onUpdate writes to `.current` every scroll tick, and
 * this component's own rAF loop reads it. No React re-renders, no
 * Motion overhead, for something that changes every single frame.
 */

type Bloom = {
  x: number;
  y: number;
  r: number;
  hue: number;
  sat: number;
  light: number;
  alpha: number;
  driftX: number;
  driftY: number;
  parallax: number; // 0–1, how much this bloom shifts with scroll progress
  phase: number;
};

const BLOOM_COUNT = 6;

function createBlooms(width: number, height: number): Bloom[] {
  return Array.from({ length: BLOOM_COUNT }, (_, i) => ({
    x: width * (0.15 + Math.random() * 0.7),
    y: height * (0.15 + Math.random() * 0.7),
    r: Math.min(width, height) * (0.22 + Math.random() * 0.2),
    hue: i % 2 === 0 ? 42 : 230, // alternating gold / ink-indigo blooms
    sat: i % 2 === 0 ? 45 : 28,
    light: i % 2 === 0 ? 32 : 14,
    alpha: 0.05 + Math.random() * 0.05,
    driftX: (Math.random() - 0.5) * 10,
    driftY: (Math.random() - 0.5) * 10,
    parallax: 0.3 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
  }));
}

export function ManifestoBackground({ progressRef }: { progressRef: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let blooms: Bloom[] = [];
    let rafId = 0;
    let visible = !document.hidden;
    let start = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      blooms = createBlooms(width, height);
    }

    function draw(timestamp: number) {
      if (!ctx) return;
      if (!start) start = timestamp;
      const t = (timestamp - start) / 1000;
      const progress = progressRef.current ?? 0;

      ctx.clearRect(0, 0, width, height);
      for (const b of blooms) {
        const driftedX = b.x + Math.sin(t * 0.05 + b.phase) * b.driftX + (progress - 0.5) * b.parallax * 120;
        const driftedY = b.y + Math.cos(t * 0.04 + b.phase) * b.driftY + (progress - 0.5) * b.parallax * 60;
        const gradient = ctx.createRadialGradient(driftedX, driftedY, 0, driftedX, driftedY, b.r);
        gradient.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, ${b.alpha})`);
        gradient.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
    }

    function frame(timestamp: number) {
      if (visible) draw(timestamp);
      rafId = requestAnimationFrame(frame);
    }

    function handleVisibility() {
      visible = !document.hidden;
    }

    resize();

    if (reduced) {
      draw(0);
    } else {
      rafId = requestAnimationFrame(frame);
      document.addEventListener("visibilitychange", handleVisibility);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      ro.disconnect();
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
