import type { IconId } from "./manifesto-content";

/**
 * Hand-authored line marks, not a UI icon library. taste-skill's icon
 * rule (3.C: never hand-roll SVG icons, use a library) governs
 * interchangeable interface glyphs — chevrons, arrows, a settings gear.
 * These are bespoke brand motifs tied to specific values (a laurel for
 * earned excellence, concentric rings for cultural depth); no icon
 * library carries "adire dye circles." Section 4.8's exception applies:
 * hand-rolled marks are acceptable when the brief explicitly calls for
 * them, which this one does by name.
 *
 * Deliberately simple — a few confident strokes per icon, not detailed
 * illustration. Checked against real screenshots at drawn-in state
 * before shipping: the first laurel pass was two bare curves, which
 * read as a pair of parentheses, not a branch — the leaf ticks below
 * are what actually make it legible as a laurel at this size.
 *
 * Each path is drawn with the `pathLength="1"` + `stroke-dasharray`/
 * `stroke-dashoffset` technique, so every icon animates the same way
 * regardless of its actual geometric length.
 */

export const ICON_PATHS: Record<IconId, string[]> = {
  // Excellence is inherited, then earned again — two branches, mirrored,
  // each with three leaf ticks (the ticks are what read as "laurel"
  // rather than "parenthesis" — see the note above).
  laurel: [
    "M23,50 C15,42 15,26 24,14",
    "M20,44 L14,47",
    "M16,32 L9,32",
    "M19,20 L13,17",
    "M41,50 C49,42 49,26 40,14",
    "M44,44 L50,47",
    "M48,32 L55,32",
    "M45,20 L51,17",
  ],

  // Culture is not a costume — concentric rings, adire dye circles.
  rings: [
    "M39,32 A7,7 0 1,1 25,32 A7,7 0 1,1 39,32",
    "M46,32 A14,14 0 1,1 18,32 A14,14 0 1,1 46,32",
    "M53,32 A21,21 0 1,1 11,32 A21,21 0 1,1 53,32",
  ],

  // Think legacy, not quarters — a lemniscate, continuity over cycles.
  infinity: ["M14,32 C14,23 22,23 32,32 C42,41 50,41 50,32 C50,23 42,23 32,32 C22,41 14,41 14,32 Z"],

  // Build the room before you enter it — an arched doorframe + knob.
  doorway: ["M19,55 L19,22 Q19,11 32,11 Q45,11 45,22 L45,55", "M40,34 L41,35 L40,36 L39,35 Z"],

  // Speak last, mean it most — a quill stroke and its trailing ink.
  quill: ["M48,12 C40,14 22,32 16,48 C26,44 44,26 48,16 C48.6,14.6 48.6,13.2 48,12 Z", "M16,48 L11,53"],
};
