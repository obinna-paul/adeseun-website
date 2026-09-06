"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient hero backdrop: a handful of slow-drifting gold motes, like
 * dust suspended in a single spotlight beam.
 *
 * Canvas 2D, not Three.js/WebGL — deliberately. Drifting dots are an
 * inherently flat effect; there's no perspective or lighting model here
 * that benefits from 3D. Three.js would add ~600KB+ and a WebGL context
 * (real cost on low-end phones, and a second failure mode to handle) to
 * render something a 2D canvas does more cheaply. This is the same call
 * pick-ui-library asks for: reach for the heavier tool only when the
 * effect actually needs it.
 *
 * Also deliberately not a "fluid gradient" blob — that's exactly the
 * AI-purple-glow hero cliché taste-skill bans by default. Soft drifting
 * light reads as photographic/editorial, which fits an author's site; a
 * gradient blob reads as generic SaaS.
 *
 * There used to be a film-grain layer here too (a second canvas of
 * low-alpha noise, `mix-blend-overlay`'d over the portrait) — removed
 * per direct feedback: at the density/opacity it was tuned to, it read
 * as visible pixelation/noise on her photo rather than the intended
 * subtle texture, especially at the portrait's real resolution rather
 * than a mockup's. Motes alone still carry the "spotlight, not empty
 * dark" ambience without degrading the photo itself.
 *
 * Performance: paused via the Page Visibility API when the tab isn't
 * active, and never started at all under prefers-reduced-motion.
 */

const MOTE_COUNT = 22;

type Mote = {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  driftX: number;
  driftY: number;
  phase: number;
};

function createMotes(width: number, height: number): Mote[] {
  return Array.from({ length: MOTE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.6 + Math.random() * 1.8,
    baseOpacity: 0.08 + Math.random() * 0.14,
    driftX: (Math.random() - 0.5) * 6,
    driftY: -4 - Math.random() * 10, // gentle upward bias, like rising dust
    phase: Math.random() * Math.PI * 2,
  }));
}

export function HeroCanvas() {
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
    let motes: Mote[] = [];
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

      motes = createMotes(width, height);
    }

    function drawMotes(timestamp: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const t = (timestamp - start) / 1000;
      for (const m of motes) {
        const x = m.x + Math.sin(t * 0.15 + m.phase) * m.driftX;
        const y = ((m.y + t * m.driftY) % (height + 40)) - 20;
        const flicker = 0.75 + 0.25 * Math.sin(t * 0.6 + m.phase * 2);
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(38, 55%, 70%, ${m.baseOpacity * flicker})`;
        ctx.fill();
      }
    }

    function frame(timestamp: number) {
      if (!start) start = timestamp;
      if (visible) drawMotes(timestamp);
      rafId = requestAnimationFrame(frame);
    }

    function handleVisibility() {
      visible = !document.hidden;
    }

    resize();

    if (reduced) {
      // One static frame, no drift.
      drawMotes(0);
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
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
