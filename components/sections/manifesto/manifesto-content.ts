/**
 * Content for Act IV — The Values Manifesto (see The Walkthrough).
 *
 * Rewritten to ground it in her three real, verified books (see
 * library-content.ts for the research) rather than the earlier
 * fabricated "Managing Director" / boardroom framing: #1 and #2 tie to
 * Think Before You Speak, #3 and #4 to Tranquility, #5 to Beyond the
 * Mundane. Icon reuse is deliberate, not arbitrary — quill (writing) now
 * pairs with the value about words, and rings (concentric circles) with
 * the one about stillness, closer visual-metaphor fits than their
 * original pairings.
 *
 * The four QUOTES are still illustrative — original lines written in her
 * voice and grounded in her real books' real themes, not verified
 * excerpts from anything she's actually said or published. Flagged here
 * so nobody downstream mistakes them for direct quotations; swap for
 * real material (an interview, a passage she confirms) the moment it
 * exists.
 */

export type IconId = "laurel" | "rings" | "infinity" | "doorway" | "quill";

export type ValueBeat = { kind: "value"; text: string; icon: IconId };
export type QuoteBeat = { kind: "quote"; text: string };
export type Beat = ValueBeat | QuoteBeat;

export const MANIFESTO_BEATS: Beat[] = [
  { kind: "value", text: "Words are not free. Spend them with care.", icon: "quill" },
  { kind: "quote", text: "The right word, held a moment longer, does less damage than the wrong one said quickly." }, // illustrative — not a verified quote
  { kind: "value", text: "Stillness is not the absence of a storm. It's what you build inside one.", icon: "rings" },
  { kind: "quote", text: "Calm isn't arrived at once. It's chosen again, every time it's needed." }, // illustrative
  { kind: "value", text: "A meaningful life isn't an accident. It's assembled, on purpose, past the mundane.", icon: "laurel" },
  { kind: "quote", text: "Purpose rarely announces itself. Most people have to go looking for it." }, // illustrative
  { kind: "value", text: "Every conversation is a door. Most people don't notice they're holding the handle.", icon: "doorway" },
  { kind: "quote", text: "Say less. Mean more." }, // illustrative
  { kind: "value", text: "None of this is mastered once. It's practiced again, every day.", icon: "infinity" },
];
