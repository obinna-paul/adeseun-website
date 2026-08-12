/**
 * Content for Act IV — The Values Manifesto (see The Walkthrough).
 *
 * The five VALUES are original copy written to her established voice
 * and pillars (The Oyeneye Doctrine): #1 ties to "Earned, Not Claimed",
 * #2 to "African Excellence, Unhedged", #3 is a keeper from the brief
 * itself (distinctly executive, fits her MD register), #4 echoes the
 * Foyer's own headline ("She built the room"), #5 echoes the established
 * "think before you speak" line from The Study.
 *
 * The four QUOTES are illustrative placeholders in her voice, NOT real
 * excerpts — no book or speech transcript exists yet to draw from.
 * Flagged here so nobody downstream mistakes them for verified quotes.
 * Swap for real material the moment it exists.
 */

export type IconId = "laurel" | "rings" | "infinity" | "doorway" | "quill";

export type ValueBeat = { kind: "value"; text: string; icon: IconId };
export type QuoteBeat = { kind: "quote"; text: string };
export type Beat = ValueBeat | QuoteBeat;

export const MANIFESTO_BEATS: Beat[] = [
  { kind: "value", text: "Excellence is inherited. Then it's earned again.", icon: "laurel" },
  { kind: "quote", text: "Grace is a discipline, not a mood." }, // illustrative — not a verified quote
  { kind: "value", text: "Culture is not a costume.", icon: "rings" },
  { kind: "quote", text: "A closed door is just a room you haven't built yet." }, // illustrative
  { kind: "value", text: "Think legacy, not quarters.", icon: "infinity" },
  { kind: "quote", text: "Power that isn't shared is just noise." }, // illustrative
  { kind: "value", text: "Build the room before you enter it.", icon: "doorway" },
  { kind: "quote", text: "Write it down. Say it once. Mean it forever." }, // illustrative
  { kind: "value", text: "Speak last. Mean it most.", icon: "quill" },
];

/** Reused verbatim from The Walkthrough's Act IV spec — already reviewed. */
export const CLOSING_LINE = "This isn't a brand. This is just how I live.";

/**
 * Destination for "Learn more about her journey." The brief said "the
 * About page"; the established sitemap (The Oyeneye Doctrine) has no
 * page by that name — The Boardroom is the closest fit (her career arc,
 * told as chapters) and is also literally the next Act after this one.
 * Change this if she'd rather it point at The Study instead.
 */
export const JOURNEY_HREF = "/boardroom";
