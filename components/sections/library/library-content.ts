/**
 * Content for The Library (/library) — her six published books, browsed
 * like a private collection rather than listed like a bibliography.
 *
 * A local typed data file for now, same reasoning as study-content.ts:
 * type-checked, git-reviewable, no build step to see a change. Per
 * ARCHITECTURE.md's content-layer plan, the Library is the catalog most
 * likely to move to Sanity once that project exists (her team adding a
 * new title shouldn't require a PR) — this flat, generically-mapped
 * shape is deliberately close to what a CMS query would return, so that
 * migration is a data-source swap, not a rewrite of BookCard/BookModal.
 *
 * Titles, descriptions, accolades, and excerpts below are illustrative —
 * written to the voice and pillars established on The Study, and where
 * possible threaded through its timeline (see "The Listening Room" and
 * "Nothing Left to Say" below), but not verified real book content.
 * Accolades are deliberately generic ("assigned reading," "third
 * printing") rather than attributed to a named publication or person —
 * inventing a specific outlet or reviewer would be fabricating a claim,
 * not writing placeholder copy. Swap in her real jacket copy, accolades,
 * and excerpts whenever they're available; nothing about the shape needs
 * to change. Cover art is an intentional placeholder mockup (BookCover),
 * not a fake photo — see that component for why.
 */

export type Category = "Leadership" | "Strategy" | "Memoir" | "Essays";

export const CATEGORIES: Category[] = ["Leadership", "Strategy", "Memoir", "Essays"];

export type Vendor = { label: string; url: string };

export type Book = {
  id: string;
  order: string; // roman numeral in publish order — not a fabricated calendar year
  title: string;
  category: Category;
  tone: "gold" | "indigo" | "garnet" | "ink";
  tagline: string;
  description: string;
  accolades: string[];
  excerptHeading: string;
  excerpt: string[];
  vendors: Vendor[];
};

/** Real per-book retailer links aren't confirmed yet — these are functional search queries (not fabricated product pages), an honest interim default until she supplies direct listing URLs. */
function vendorLinks(title: string): Vendor[] {
  const query = encodeURIComponent(`${title} Adeseun Oyeneye`);
  return [
    { label: "Amazon", url: `https://www.amazon.com/s?k=${query}` },
    { label: "Independent bookstores", url: `https://bookshop.org/beta-search?keywords=${query}` },
  ];
}

export const BOOKS: Book[] = [
  {
    id: "the-listening-room",
    order: "I",
    title: "The Listening Room",
    category: "Leadership",
    tone: "gold",
    tagline: "The book that wasn't supposed to be about leadership.",
    description:
      "Her first book, written in the six months after her first board seat — before she'd earned the right, she thought, to say anything at all. It became the book people in boardrooms kept quoting back to her.",
    accolades: ["Assigned reading on more than one executive committee.", "Now in its third printing."],
    excerptHeading: "From the opening chapter",
    excerpt: [
      "I did not set out to write a book about leadership. I set out to write down what I was hearing, because I had just been given a seat at a table where, for the first time in my career, I was expected to say almost nothing.",
      "Six months of listening will teach you more about a room than six years of talking in it. This book is what I heard.",
    ],
    vendors: vendorLinks("The Listening Room"),
  },
  {
    id: "room-to-manoeuvre",
    order: "II",
    title: "Room to Manoeuvre",
    category: "Strategy",
    tone: "indigo",
    tagline: "On keeping your options open when everyone wants a decision today.",
    description:
      "A field guide to strategic patience — how to hold multiple paths open under pressure to commit to just one, and why the boards that reward speed alone are usually the ones that regret it.",
    accolades: ["Discussed on more internal strategy calls than she's been told about."],
    excerptHeading: "From Chapter Three",
    excerpt: [
      "Every room I've sat in wants an answer faster than the question deserves. Room to manoeuvre is not indecision. It is refusing to let someone else's clock decide the shape of your commitment.",
    ],
    vendors: vendorLinks("Room to Manoeuvre"),
  },
  {
    id: "notes-from-the-margin",
    order: "III",
    title: "Notes from the Margin",
    category: "Essays",
    tone: "garnet",
    tagline: "A collection, built the way it was written — in the margins.",
    description:
      "Short essays pulled from a decade of marginalia: the sentences she wrote in the white space of other people's reports, gathered into something that reads less like a business book and more like a running argument with herself.",
    accolades: ["The one she says is closest to how she actually thinks."],
    excerptHeading: "From the foreword",
    excerpt: [
      "None of these were meant to be read by anyone but me. They were written in margins — literal ones, in the reports and drafts I was supposed to be reviewing instead.",
      "I've resisted the urge to smooth them out. A margin note is honest in a way a finished paragraph rarely is.",
    ],
    vendors: vendorLinks("Notes from the Margin"),
  },
  {
    id: "the-quiet-majority",
    order: "IV",
    title: "The Quiet Majority",
    category: "Leadership",
    tone: "gold",
    tagline: "For everyone in the room who has never once spoken up in it.",
    description:
      "On the people leadership books forget: the majority in any boardroom who sit through the whole meeting and say nothing. What their silence actually means, and what it costs an organization to keep mistaking it for agreement.",
    accolades: ["Her most-gifted title, by her own count."],
    excerptHeading: "From the introduction",
    excerpt: [
      "Silence in a boardroom is not consent. It is usually the most honest thing in the room, and almost no one asks it what it means.",
    ],
    vendors: vendorLinks("The Quiet Majority"),
  },
  {
    id: "the-long-game-played-fast",
    order: "V",
    title: "The Long Game, Played Fast",
    category: "Strategy",
    tone: "indigo",
    tagline: "Thinking in decades while operating at the speed a Managing Director has to.",
    description:
      "Written from inside the contradiction of the title: how to hold a decade-long thesis steady while every quarter demands you prove it faster than a decade allows.",
    accolades: ["Adopted as a case study more than once, without her permission."],
    excerptHeading: "From Chapter One",
    excerpt: [
      "Nobody at my level gets to think slowly and act slowly. The discipline isn't picking one speed. It's learning which parts of the decision can move fast, and refusing to let the rest be rushed with them.",
    ],
    vendors: vendorLinks("The Long Game, Played Fast"),
  },
  {
    id: "nothing-left-to-say",
    order: "VI",
    title: "Nothing Left to Say",
    category: "Memoir",
    tone: "ink",
    tagline: "Six books in, she still starts each one certain she's wrong about that.",
    description:
      "Her most recent book, and her most personal — an account of what six books, one boardroom, and a career of being underestimated actually taught her, written by someone who was sure, each time, that she had nothing left to add.",
    accolades: ["The book she was most afraid to publish.", "Still the one readers write to her about most."],
    excerptHeading: "From the closing pages",
    excerpt: [
      "I have started every book the same way: certain I had nothing left to say. I was wrong five times before this one. I suspect I'll be wrong again — that's not false modesty, it's just what the work keeps teaching me.",
      "If this is the last one, it will have been enough. I don't think it's the last one.",
    ],
    vendors: vendorLinks("Nothing Left to Say"),
  },
];

export const PAGE_INTRO =
  "Six books, browsed the way they were written — one at a time, with room to sit with each.";
