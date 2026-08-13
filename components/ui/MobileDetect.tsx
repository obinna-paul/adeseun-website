"use client";

import type { ReactNode } from "react";
import { useMobileDetect } from "@/lib/use-mobile-detect";

/**
 * Conditionally mounts a heavy background animation (canvas grain,
 * ink-in-water, anything continuously repainting) — skipped entirely on
 * low-power devices rather than rendered smaller or slower, since the
 * whole point is avoiding the render cost, not just its visual size.
 * `fallback` renders instead when skipped (default: nothing, since
 * these are always decorative layers sitting on top of a section that
 * already looks complete underneath).
 */
export function MobileDetect({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const lowPower = useMobileDetect();
  return lowPower ? <>{fallback}</> : <>{children}</>;
}
