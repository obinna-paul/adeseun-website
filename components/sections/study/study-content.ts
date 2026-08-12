/**
 * Content for The Study (/study) — the About page, a cinematic timeline
 * rather than a resume.
 *
 * Rewritten around real, verified research (see library-content.ts):
 * five real books, two of them with confirmed publish dates (Think
 * Before You Speak, November 2023; Tranquility, June 2025 — used as
 * actual `era` values below, not fabricated). The timeline below only
 * walks the three earliest-confirmed titles, not all five — Black Is
 * Beautiful and The Hope of a Nigerian Child surfaced after this
 * timeline's structure was set and don't have confirmed dates or a
 * clear position in her writing order, so adding milestones for them
 * would mean guessing at sequence; The Library lists all five. Where a
 * date isn't confirmed (Beyond the Mundane's publication date, and
 * anything before her first book), `era` stays a descriptive label
 * rather than an invented year — the same fake-precision guard as
 * before, just now mostly unnecessary because real dates exist for the
 * anchor points.
 *
 * Per direct instruction, this is author-first: her real professional
 * standing (Founder and Vice-President, Threesixty Africa Media — the
 * AFRICAST 2025 / Paris 2024 Olympics / Headies credentials come from
 * her own published author bio, supplied directly) appears as ONE
 * supporting milestone, not the spine of the timeline — the earlier
 * version's fabricated "board seat → Managing Director" corporate-ascent
 * arc has been removed entirely, not just relabeled.
 *
 * Every `story` line is still original writing in her voice, not a
 * verified account of real events or a quoted statement from her —
 * flagged for the same reason the Manifesto's quotes are.
 */

export type Milestone = {
  id: string;
  era: string;
  title: string;
  story: string;
  /** Swap in a real photo once one exists — see TimelineCard's placeholder handling. */
  image?: string;
};

export const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: "before-the-page",
    era: "Before the First Page",
    title: "A life spent noticing words",
    story:
      "Long before the first book, she was the person in the room who noticed when a sentence landed wrong — and knew, usually, why.",
  },
  {
    id: "think-before-you-speak",
    era: "November 2023",
    title: "Think Before You Speak",
    story:
      "Her first published book: a case for thoughtful communication as a discipline, not a talent — 197 pages, written to be read in one sitting and returned to for years.",
  },
  {
    id: "beyond-the-mundane",
    era: "Between Books",
    title: "Beyond the Mundane",
    story:
      "Her second book turned the same attention outward — from the words we choose to the lives we build with them, and what actually makes either one meaningful.",
  },
  {
    id: "tranquility",
    era: "June 2025",
    title: "Tranquility",
    story: "Her third book, and her quietest: a guide to cultivating calm as a practice, not a place you arrive at once.",
  },
  {
    id: "threesixty",
    era: "Alongside the Page",
    title: "Founder and Vice-President, Threesixty Africa Media",
    story:
      "The other half of her working life — a media, marketing, and content agency she founded, most recently the official marketing engine behind AFRICAST 2025 and Nigeria House at the Paris 2024 Olympics, and a co-executive producer of The Headies for sixteen years. Not the story this site tells. Just also true.",
    image: "/images/adeseun-threesixty.jpg",
  },
  {
    id: "still-writing",
    era: "Still Writing",
    title: "The next chapter, mid-sentence",
    story: "Ask her what's next and she'll tell you honestly: she's still living it, which means it isn't written yet.",
  },
];

export type CurtainItem =
  | { kind: "photo"; id: string; caption: string; image?: string; tall?: boolean }
  | { kind: "note"; id: string; text: string }
  | { kind: "snippet"; id: string; label: string; text: string };

/**
 * A mix of candid-photo slots, handwritten-style notes, and research
 * snippets. One photo ("desk-detail") now has a real portrait behind
 * it — captioned honestly as "Between chapters" rather than a literal
 * desk shot, since the photo itself is a posed portrait, not workspace
 * ephemera. The other photo slots, and every note/snippet, are still
 * illustrative — written to demonstrate the section's rhythm, not
 * claimed as real artifacts from her actual desk or drafts.
 */
export const CURTAIN_ITEMS: CurtainItem[] = [
  { kind: "photo", id: "desk-detail", caption: "Between chapters", tall: true, image: "/images/adeseun-curtain.jpg" },
  { kind: "note", id: "margin-note-1", text: "This chapter is too polite. Redo it like you mean it." },
  {
    kind: "snippet",
    id: "research-1",
    label: "Research notes, pg. 4",
    text: "Peace isn't the absence of noise. It's what's left once you stop needing to explain yourself.",
  },
  { kind: "photo", id: "shelf", caption: "Where the three live" },
  { kind: "note", id: "margin-note-2", text: "Reminder: say the true thing, not the smooth thing." },
  { kind: "photo", id: "writing-hand", caption: "Draft four, still moving", tall: true },
  {
    kind: "snippet",
    id: "research-2",
    label: "Interview notes, tape 2",
    text: "“Ask her what she'd tell a younger writer.” “Say less. You'll mean more.”",
  },
  { kind: "note", id: "margin-note-3", text: "The reader doesn't need the whole story. They need the next honest sentence." },
];

export const HERO_LINE = "Everything you've read about her started at this desk.";

export const CTA_HEADLINE = "Bring her into the room.";
export const CTA_BODY =
  "For speaking, book clubs, or a conversation that doesn't fit in an inbox — every engagement starts the same way this page did.";
// "The Table" was renamed "The Invitation" — same destination, new name/route.
export const CTA_HREF = "/invitation";
