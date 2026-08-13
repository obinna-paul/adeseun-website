/**
 * Raw token values for contexts Tailwind classes can't reach — Motion
 * variants, canvas/SVG, inline style calculations.
 *
 * Canonical source is `app/styles/tokens.css`. If you change a value,
 * change it there first, then mirror it here. Kept intentionally small:
 * only tokens something in `lib/` or `components/` actually consumes as
 * a raw value, not a full restatement of the CSS file.
 */

export const colors = {
  ground: "hsl(220, 14%, 96%)",
  surface: "hsl(0, 0%, 100%)",
  surfaceElevated: "hsl(220, 20%, 99%)",
  surfaceSunken: "hsl(220, 14%, 91%)",
  lineWhisper: "hsl(220, 14%, 90%)",
  line: "hsl(220, 14%, 82%)",
  lineStrong: "hsl(220, 18%, 55%)",
  text: "hsl(230, 18%, 14%)",
  textSubdued: "hsl(230, 10%, 38%)",
  textFaint: "hsl(230, 12%, 46%)",
  textOnDark: "hsl(220, 24%, 97%)",
  gold: "hsl(42, 55%, 42%)",
  goldInk: "hsl(40, 58%, 32%)",
  goldFill: "hsl(40, 68%, 28%)",
  goldTint: "hsl(42, 55%, 94%)",
  indigo: "hsl(243, 32%, 28%)",
  garnet: "hsl(350, 45%, 32%)",
} as const;

/**
 * emil-design-eng's decision tree, named: ease-out for entrances,
 * ease-in-out for on-screen movement, a gentle standard curve for
 * hover/color (the one case where a plain-ish curve is correct).
 */
export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  standard: [0.4, 0, 0.2, 1],
} as const;

/** Durations in seconds, for Motion's `transition.duration`. */
export const duration = {
  press: 0.14,
  flick: 0.18,
  reveal: 0.22,
  settle: 0.36,
  cinematic: 0.9,
  cinematicSlow: 2.4,
} as const;

export const radius = {
  frame: "2px",
  control: "999px",
} as const;
