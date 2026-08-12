/**
 * Content for The Study (/study) — the About page, reframed per her
 * direction as a cinematic timeline rather than a resume.
 *
 * A local typed data file, not JSON: same reasoning as
 * manifesto-content.ts — type-checked at compile time, still a single
 * file anyone comfortable with git can edit, no build step required to
 * see a change. Per ARCHITECTURE.md's content-layer plan, this is a
 * placeholder ahead of the eventual Sanity integration for team-managed
 * catalog content; the shape here (a flat typed array, mapped
 * generically by StudyTimeline) is deliberately close to what a CMS
 * query would return, so migrating later is a data-source swap, not a
 * rewrite of the rendering logic.
 *
 * TIMELINE_MILESTONES use era labels, not fabricated calendar years —
 * her real career dates aren't known yet, and inventing specific years
 * would be exactly the "fake-precise" fabrication taste-skill flags.
 * Swap `era` for real years once she's confirmed them; nothing else
 * about the shape needs to change.
 *
 * Every `story` line below is illustrative, written to her established
 * voice and pillars, not a verified account of real events — flagged
 * here for the same reason the Manifesto's quotes were.
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
    id: "first-seat",
    era: "The First Room",
    title: "A seat at the table",
    story:
      "She took her first board seat before most of her peers had taken their first promotion — and spent the first six months mostly listening.",
  },
  {
    id: "first-book",
    era: "The First Page",
    title: "The book that wasn't supposed to be about leadership",
    story:
      "It started as something else entirely. By the time she finished it, it had become the book people in boardrooms kept quoting back to her.",
  },
  {
    id: "managing-director",
    era: "The Room Got Bigger",
    title: "Managing Director",
    story:
      "The title her career had been arguing toward the whole time — earned in rooms that didn't always expect her to be the one leading them.",
  },
  {
    id: "said-out-loud",
    era: "Said Out Loud",
    title: "The talk that made the two voices one",
    story:
      "The first time the boardroom voice and the writer's voice said the same thing out loud, in front of a room that had never heard either.",
  },
  {
    id: "sixth-book",
    era: "Six Books In",
    title: "The questions got harder, not easier",
    story: "Six books in, she still starts each one the same way: certain she has nothing left to say, and wrong.",
  },
  {
    id: "still-building",
    era: "Still Building",
    title: "The next chapter, mid-sentence",
    story: "Ask her what's next and she'll tell you honestly: she's still living it, which means it isn't written yet.",
  },
];

export type CurtainItem =
  | { kind: "photo"; id: string; caption: string; image?: string; tall?: boolean }
  | { kind: "note"; id: string; text: string }
  | { kind: "snippet"; id: string; label: string; text: string };

/**
 * A mix of candid-photo slots (honest placeholders, no real images yet),
 * handwritten-style notes, and research snippets — all illustrative,
 * written to demonstrate the section's rhythm, not claimed as real
 * artifacts from her actual desk or drafts.
 */
export const CURTAIN_ITEMS: CurtainItem[] = [
  { kind: "photo", id: "desk-detail", caption: "The desk, mid-chapter", tall: true },
  { kind: "note", id: "margin-note-1", text: "This chapter is too polite. Redo it like you mean it." },
  { kind: "snippet", id: "research-1", label: "Research notes, pg. 4", text: "Legacy isn't what they remember. It's what they no longer have to explain." },
  { kind: "photo", id: "shelf", caption: "Where the last six live" },
  { kind: "note", id: "margin-note-2", text: "Reminder: finish the sentence before you finish the meeting." },
  { kind: "photo", id: "writing-hand", caption: "Draft four, still moving", tall: true },
  { kind: "snippet", id: "research-2", label: "Interview transcript, tape 2", text: "“Ask her what she'd do differently.” “Nothing. I'd just do it faster.”" },
  { kind: "note", id: "margin-note-3", text: "The board doesn't need the whole story. It needs the next sentence." },
];

export const HERO_LINE = "Everything you've read about her started at this desk.";

export const CTA_HEADLINE = "Bring her into the room.";
export const CTA_BODY =
  "For speaking, board advisory, or a conversation that doesn't fit in an inbox — every engagement starts the same way this page did.";
// "The Table" was renamed "The Invitation" — same destination, new name/route.
export const CTA_HREF = "/invitation";
