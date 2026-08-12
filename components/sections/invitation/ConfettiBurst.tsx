"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

type Particle = { id: number; angle: number; distance: number; width: number; height: number; delay: number; rotate: number };

/**
 * `Math.random()` here is safe (unlike the deterministic values used for
 * anything rendered on first paint elsewhere on this site) — this only
 * ever runs client-side, well after hydration, triggered by a user
 * submitting the form. There's no server-rendered version to mismatch.
 *
 * A "rare, first-time, celebratory" moment per emil-design-eng's
 * animation-frequency table — exactly the case where added delight is
 * warranted, not a hover or list-navigation animation running hundreds
 * of times a day.
 */
function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: 70 + Math.random() * 110,
    width: 3 + Math.random() * 3,
    height: 8 + Math.random() * 8,
    delay: Math.random() * 0.18,
    rotate: Math.random() * 500 - 250,
  }));
}

export function ConfettiBurst({ active }: { active: boolean }) {
  const particles = useMemo(() => (active ? makeParticles(32) : []), [active]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      <AnimatePresence>
        {active &&
          particles.map((p) => {
            const x = Math.cos(p.angle) * p.distance;
            const y = Math.sin(p.angle) * p.distance - 30; // slight upward bias — a burst, not a puddle
            return (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 rounded-[1px]"
                style={{ width: p.width, height: p.height, background: "var(--color-gold)" }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
                animate={{ x, y, opacity: 0, rotate: p.rotate, scale: 1 }}
                transition={{ duration: 1.15, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
      </AnimatePresence>
    </div>
  );
}
