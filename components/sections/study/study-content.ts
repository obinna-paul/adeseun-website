/**
 * Content for The Study (/study) — the About page, a cinematic timeline
 * rather than a resume.
 *
 * Rewritten around real, verified research (see library-content.ts):
 * four real books, two of them with confirmed publish dates (Think
 * Before You Speak, November 2023; Tranquility, June 2025 — used as
 * actual `era` values below, not fabricated). All four now appear on
 * the timeline — Black Is Beautiful was held back at first because it
 * surfaced after this timeline's structure was set and has no confirmed
 * date or sequence position relative to the other three, but per direct
 * confirmation all four stand as equally real, published books; it's
 * placed last among the books rather than guessed into a specific slot,
 * with an era label that doesn't claim a position it hasn't earned.
 * Where a date isn't confirmed (Beyond the Mundane's publication date,
 * and anything before her first book), `era` stays a descriptive label
 * rather than an invented year — the same fake-precision guard as
 * before, just now mostly unnecessary because real dates exist for the
 * anchor points.
 *
 * Per direct instruction, this is author-first: her real professional
 * standing (Vice President, 360Africa Media Group — the AFRICAST 2025 /
 * Paris 2024 Olympics / Headies credentials come from her own published
 * author bio, supplied directly) appears as ONE supporting milestone, not
 * the spine of the timeline — the earlier version's fabricated "board
 * seat → Managing Director" corporate-ascent arc has been removed
 * entirely, not just relabeled.
 *
 * "360Africa Media Group" / "Bounty5 Home" (below, and in
 * CREDENTIAL_GROUPS) supersede this file's earlier "Threesixty Africa
 * Media" / "Bounty5 Empire" spellings, per direct confirmation against
 * her own current executive-profile materials — those were the best
 * available spelling at the time this file was first researched, not a
 * different, unrelated entity. Same correction for the overall years-of-
 * experience figure: 26, not 24 — this file's `twenty-four years` below
 * was superseded once her current materials confirmed 26 (a 1999–2025
 * career span).
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
  /**
   * A real photo of her — representative, not documentary. None of
   * these were confirmed as taken during the milestone's actual era;
   * they're chosen for mood/fit the same way the "threesixty" milestone's
   * photo always was (a good likeness for that beat in her story, not a
   * dated snapshot from that exact month). `era` states the timeframe
   * the milestone covers; the photo doesn't claim to have been taken
   * within it. Swap in a real, era-matched photo if one ever surfaces —
   * TimelineCard's placeholder handles anything still unset.
   */
  image?: string;
  /** "cover" (default, right for a photo of her) or "contain" — use
   *  "contain" when `image` is a book cover, not a portrait: a cover has
   *  real title/name text baked in top and bottom that a face-framing
   *  crop would slice off. See LazyImage's own doc comment. */
  imageFit?: "cover" | "contain";
};

export const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: "before-the-page",
    era: "Before the First Page",
    title: "A life spent noticing words",
    story:
      "Long before the first book, she was the person in the room who noticed when a sentence landed wrong — and knew, usually, why.",
    image: "/images/adeseun-before-the-page.jpg",
  },
  {
    id: "think-before-you-speak",
    era: "November 2023",
    title: "Think Before You Speak",
    story:
      "Her first published book: a case for thoughtful communication as a discipline, not a talent — 197 pages, written to be read in one sitting and returned to for years.",
    image: "/images/adeseun-think-before-you-speak.jpg",
  },
  {
    id: "beyond-the-mundane",
    era: "Between Books",
    title: "Beyond the Mundane",
    story:
      "Her second book turned the same attention outward — from the words we choose to the lives we build with them, and what actually makes either one meaningful.",
    image: "/images/adeseun-beyond-the-mundane.jpg",
  },
  {
    id: "tranquility",
    era: "June 2025",
    title: "Tranquility",
    story: "Her third book, and her quietest: a guide to cultivating calm as a practice, not a place you arrive at once.",
    image: "/images/adeseun-tranquility.jpg",
  },
  {
    id: "black-is-beautiful",
    era: "Also Published",
    title: "Black Is Beautiful",
    story:
      "A fourth book, arriving outside this timeline's neat sequence: a tribute to Black identity, history, and culture — real, published, and just as much hers as the three that came before it.",
    image: "/images/adeseun-black-is-beautiful.jpg",
  },
  {
    id: "threesixty",
    era: "Alongside the Page",
    title: "Vice President, 360Africa Media Group",
    story:
      "The other half of her working life — a media, marketing, and content agency, most recently the official marketing engine behind AFRICAST 2025 and Nigeria House at the Paris 2024 Olympics, and a co-executive producer of The Headies for sixteen years. Not the story this site tells. Just also true.",
    image: "/images/adeseun-threesixty.jpg",
  },
];

export type CurtainItem =
  | { kind: "photo"; id: string; caption: string; image?: string; tall?: boolean }
  | { kind: "note"; id: string; text: string }
  | { kind: "snippet"; id: string; label: string; text: string };

/**
 * A mix of candid-photo slots, handwritten-style notes, and research
 * snippets. Three photos now have real images behind them, each
 * honestly captioned to match what the photo actually shows: "desk-
 * detail" is a posed portrait, captioned "Between chapters," not a
 * literal desk shot; "headies-desk" is a real working moment —
 * paperwork and a Headies-branded microphone, her production life
 * rather than a manuscript in progress — captioned "Between takes"
 * instead of the original placeholder's "Draft four, still moving,"
 * which would have overclaimed what the photo is; "shelf" is a real
 * product shot of all four books together, supplied directly — the
 * caption was "Where the three live" back when only three were
 * confirmed, updated to "Where they live" rather than hardcode a count
 * that will go stale again the next time her catalog grows. Every
 * note/snippet is still illustrative — written to demonstrate the
 * section's rhythm, not claimed as a real artifact.
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
  { kind: "photo", id: "shelf", caption: "Where they live", image: "/images/adeseun-four-books.png" },
  { kind: "note", id: "margin-note-2", text: "Reminder: say the true thing, not the smooth thing." },
  {
    kind: "photo",
    id: "headies-desk",
    caption: "Between takes",
    tall: true,
    image: "/images/adeseun-curtain-drafting.jpg",
  },
  {
    kind: "snippet",
    id: "research-2",
    label: "Interview notes, tape 2",
    text: "“Ask her what she'd tell a younger writer.” “Say less. You'll mean more.”",
  },
  { kind: "note", id: "margin-note-3", text: "The reader doesn't need the whole story. They need the next honest sentence." },
];

export const HERO_LINE = "Everything you've read about her started at this desk.";

/**
 * "Beyond the Page" — a deliberately secondary, text-only section
 * (Study page, between Behind the Curtain and the closing CTA) drawn
 * from her real publisher-supplied "About the Author" back matter
 * (Tranquility's print edition, transcribed directly from photos of
 * the physical pages — same primary-source standard as the rest of
 * this site's facts).
 *
 * The Study's timeline already carries ONE fact from this same source
 * (360Africa Media Group / AFRICAST / Paris 2024 / The Headies, on
 * the "threesixty" milestone above) as a deliberately singular
 * supporting beat, per direct instruction that this is an author site
 * first, not an executive bio. Everything below is real and verified
 * from the same document but was unused until now; it lives in its own
 * clearly-secondary section — smaller type scale, no photography, a
 * plain paper-toned background — rather than being blended into the
 * books' narrative timeline or inflating that one milestone into
 * something it was deliberately kept small.
 *
 * "The Hope of a Nigerian Child" is named again in this same source as
 * one of her books — consistent with what was already known, not new
 * information — but stays off The Library: the reason it was removed
 * there was never doubt that it's real, it was the lack of a confirmed
 * cover or retail link, and neither exists yet.
 */
export const BEYOND_EYEBROW = "Beyond the Page";
export const BEYOND_HEADLINE = "The rest of the working life.";
export const BEYOND_INTRO =
  "Entrepreneur, marketing and media executive, life coach — twenty-six years of it. The books are why this page exists; they're not the whole of her. A partial accounting of the rest, real and verified, kept to the margins on purpose.";

export type CredentialGroup = { label: string; items: string[] };

export const CREDENTIAL_GROUPS: CredentialGroup[] = [
  {
    label: "Also Leads",
    items: [
      "Founder, Universal Worship Network — a faith-based TV channel",
      "CEO, Bounty5 Home — home architecture and interior design",
      "Founder, PluvSeptember 30 Publishing",
      "Founder, Dream M12 — fitness and lifestyle",
      "Creative Director, Girlbye Pro — a styling agency",
      "Executive Producer, The Red Chair Talk — a talk show on relationships and community",
    ],
  },
  {
    label: "Notable Work",
    items: [
      "Paris 2024 Olympics — official NOC marketing agency; producer, Nigeria House",
      "AFRICAST — Project Coordinator and Marketing Director",
      "The Headies — Co-Executive Producer, 16 years (Africa and the USA)",
      "Former Office Manager, The State House, Abuja",
      "Mic-Check talent hunt, Atlanta Caribbean Carnival USA, Lagos City Marathon, Lagos Shopping Festival",
    ],
  },
  {
    label: "Recognition",
    items: [
      "Proclamation Award, Atlanta City Council — 2019",
      "National Award, Georgia House of Representatives — 2024",
      "Certificate of Achievement, Interior Design, Oxford HS (UK) — 2023",
      "Special Recognition, Nigerian Film & TV Industry, Eko Star Films & TV Awards — 2021",
      "Youth National Award for Transformation & Development, Nigeria — 2022",
      "National Matron Award, Football Nigeria Organization — 2024",
    ],
  },
  {
    label: "Education",
    items: [
      "Obafemi Awolowo University",
      "International Business Management Institute, Berlin",
      "Oxford Home Study, United Kingdom",
    ],
  },
];

export const BEYOND_CLIENTS_LINE =
  "Client work has included MTN, Coca-Cola, Airtel, Google, Sony, Samsung, Toleram Group, YouTube, Guinness, FreeTV, and the National Broadcasting Commission.";

export const CTA_HEADLINE = "Bring her into the room.";
export const CTA_BODY =
  "For speaking, book clubs, or a conversation that doesn't fit in an inbox — every engagement starts the same way this page did.";
// "The Table" → "The Invitation" → "The Reception" — same destination, name/route updated each time the room was renamed.
export const CTA_HREF = "/contact";
