"use client";

import { useSyncExternalStore } from "react";

/**
 * "Low-power" here means "skip the heavy background animation," not
 * "serve a worse experience" — it's a performance gate, not a device
 * class. True on any of:
 *   - a touch-shaped device (coarse pointer + narrow viewport) — the
 *     canvas-grain/ink-in-water backgrounds this gates are full-bleed
 *     hero decoration that a phone's GPU/thermal budget pays for more
 *     than a desktop's does, for an effect mostly seen in peripheral
 *     vision on a small screen anyway;
 *   - `navigator.connection.saveData` — the user explicitly asked
 *     sites to go easy on their device/network;
 *   - `navigator.deviceMemory <= 4` — a real (if Chromium-only) signal
 *     that this hardware has a small performance budget.
 * Both `connection` and `deviceMemory` are non-standard and only ship
 * in Chromium; every check is feature-detected, and their absence just
 * means that particular signal can't fire, not that detection breaks.
 *
 * Same hydration-safety shape as usePrefersReducedMotion (see that
 * file's own comment for why): `getServerSnapshot` always returns
 * `false`, so server and first client paint always agree, and the
 * background animation mounts for one frame on a low-power device
 * before this flips true — a one-frame cost, not a hydration mismatch.
 */

interface NetworkInformationLike {
  saveData?: boolean;
}
interface NavigatorWithHints extends Navigator {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
}

function isLowPower(): boolean {
  const nav = navigator as NavigatorWithHints;
  const touchShaped =
    window.matchMedia("(pointer: coarse)").matches && window.matchMedia("(max-width: 767px)").matches;
  const saveData = nav.connection?.saveData === true;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  return touchShaped || saveData || lowMemory;
}

function subscribe(onChange: () => void) {
  const pointer = window.matchMedia("(pointer: coarse)");
  const width = window.matchMedia("(max-width: 767px)");
  pointer.addEventListener("change", onChange);
  width.addEventListener("change", onChange);
  return () => {
    pointer.removeEventListener("change", onChange);
    width.removeEventListener("change", onChange);
  };
}

function getServerSnapshot() {
  return false;
}

/** True when heavy decorative background animation should be skipped — see the file-level comment for the exact criteria. */
export function useMobileDetect() {
  return useSyncExternalStore(subscribe, isLowPower, getServerSnapshot);
}
