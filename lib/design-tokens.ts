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
  ground: "hsl(38, 30%, 96%)",
  surface: "hsl(40, 35%, 99%)",
  surfaceElevated: "hsl(40, 40%, 99%)",
  surfaceSunken: "hsl(36, 26%, 91%)",
  lineWhisper: "hsl(36, 22%, 89%)",
  line: "hsl(34, 18%, 80%)",
  lineStrong: "hsl(30, 20%, 50%)",
  text: "hsl(28, 24%, 13%)",
  textSubdued: "hsl(28, 12%, 36%)",
  textFaint: "hsl(28, 14%, 44%)",
  textOnDark: "hsl(38, 32%, 97%)",
  heroGround: "hsl(160, 28%, 6%)",
  emerald: "hsl(152, 42%, 24%)",
  emeraldInk: "hsl(152, 46%, 17%)",
  emeraldFill: "hsl(152, 48%, 20%)",
  emeraldTint: "hsl(150, 36%, 94%)",
  terracotta: "hsl(18, 60%, 42%)",
  terracottaInk: "hsl(18, 64%, 33%)",
  terracottaFill: "hsl(18, 66%, 37%)",
  terracottaTint: "hsl(20, 52%, 94%)",
  gold: "hsl(38, 46%, 40%)",
  goldInk: "hsl(36, 48%, 30%)",
  goldFill: "hsl(36, 52%, 26%)",
  goldTint: "hsl(38, 42%, 93%)",
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
