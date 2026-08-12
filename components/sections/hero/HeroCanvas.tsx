"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient hero backdrop: film grain + a handful of slow-drifting gold
 * motes, like dust suspended in a single spotlight beam.
 *
 * Canvas 2D, not Three.js/WebGL — deliberately. Grain and drifting dots
 * are inherently flat effects; there's no perspective or lighting model
 * here that benefits from 3D. Three.js would add ~600KB+ and a WebGL
 * context (real cost on low-end phones, and a second failure mode to
 * handle) to render something a 2D canvas does more cheaply. This is
 * the same call pick-ui-library asks for: reach for the heavier tool
 * only when the effect actually needs it.
 *
 * Also deliberately not a "fluid gradient" blob — that's exactly the
 * AI-purple-glow hero cliché taste-skill bans by default. Grain reads
 * as photographic/editorial, which fits an author's site; a gradient
 * blob reads as generic SaaS.
 *
 * Performance:
 * - Two update cadences sharing one rAF loop: motes redraw every frame
 *   (they need to look smooth), grain regenerates every ~90ms (redrawing
 *   fresh random noise every frame is wasted work — the flicker reads
 *   the same at 11fps as it does at 60fps).
 * - Grain is rendered at a fraction of device resolution and scaled up
 *   with `image-rendering: pixelated` — computing full-resolution noise
 *   at a high DPR would be the single most expensive thing on this page
 *   for no visible gain; pixelation IS the grain texture.
 * - Paused via the Page Visibility API when the tab isn't active, and
 *   never started at all under prefers-reduced-motion — a single static
 *   grain frame is drawn once instead.
 */

const GRAIN_INTERVAL_MS = 90;
const GRAIN_SCALE = 0.12; // internal grain buffer is 12% of canvas size, then upscaled
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
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const grainCanvas = grainCanvasRef.current;
    if (!canvas || !grainCanvas) return;

    const ctx = canvas.getContext("2d");
    const grainCtx = grainCanvas.getContext("2d");
    if (!ctx || !grainCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let motes: Mote[] = [];
    let rafId = 0;
    let lastGrainAt = 0;
    let visible = !document.hidden;
    let start = 0;

    function resize() {
      if (!canvas || !grainCanvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gw = Math.max(1, Math.round(width * GRAIN_SCALE));
      const gh = Math.max(1, Math.round(height * GRAIN_SCALE));
      grainCanvas.width = gw;
      grainCanvas.height = gh;

      motes = createMotes(width, height);
    }

    function drawGrain(timestamp: number) {
      if (!grainCtx) return;
      const gw = grainCanvas!.width;
      const gh = grainCanvas!.height;
      const imageData = grainCtx.createImageData(gw, gh);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 14; // very low alpha — texture, not noise you consciously see
      }
      grainCtx.putImageData(imageData, 0, 0);
      lastGrainAt = timestamp;
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
        ctx.fillStyle = `hsla(42, 65%, 70%, ${m.baseOpacity * flicker})`;
        ctx.fill();
      }
    }

    function frame(timestamp: number) {
      if (!start) start = timestamp;
      if (visible) {
        drawMotes(timestamp);
        if (timestamp - lastGrainAt > GRAIN_INTERVAL_MS) drawGrain(timestamp);
      }
      rafId = requestAnimationFrame(frame);
    }

    function handleVisibility() {
      visible = !document.hidden;
    }

    resize();

    if (reduced) {
      // One static frame: a little grain, no motes drifting.
      drawGrain(0);
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
      <canvas
        ref={grainCanvasRef}
        className="absolute inset-0 h-full w-full opacity-60 mix-blend-overlay"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}
