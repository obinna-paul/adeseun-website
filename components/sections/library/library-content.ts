/**
 * Content for The Library (/library) — her fourteen published books.
 *
 * Grounded in real, verified research (web search, checked against
 * multiple retail listings, plus direct confirmation from her team,
 * including her own published author bio and real cover art for all
 * four), not illustrative placeholder copy. Confirmed facts:
 * - "Think Before You Speak: Embarking on the Path to Thoughtful
 *   Communication" — published November 2023, 197 pages. Real cover
 *   supplied directly.
 * - "Beyond the Mundane: Essentials of a Meaningful Life." Real cover
 *   supplied directly.
 * - "Tranquility" — published June 2025. Real cover supplied directly.
 * - "Black Is Beautiful" — confirmed via a direct Amazon listing
 *   (amazon.com/dp/B0DH261JSK), with real cover art and real publisher
 *   description supplied directly (search never indexed this one,
 *   despite trying). Its `excerpt` is her actual publisher description,
 *   reproduced verbatim — the one book here where that panel isn't
 *   site-original writing, which is exactly why its heading says "From
 *   the publisher's description" rather than the generic "About the
 *   book" the other three use.
 *
 * `vendors`/Amazon+Lulu purchase links have been removed entirely per
 * direct instruction — purchasing now happens on-site via Paystack
 * (see app/checkout/[bookId] and app/api/checkout). Every `price` below
 * is the confirmed paperback price in naira. Every
 * `printSpecs.trimSize` / `.binding` is still a guessed-generic
 * paperback spec and needs confirmation from the printer before this
 * goes live; see BookModal/checkout route doc comments for how they're
 * used. `printSpecs.pageCount` is filled in
 * wherever a real page count was already confirmed above via `accolades`;
 * left `undefined` for the two books where it never was.
 *
 * A fifth title, "The Hope of a Nigerian Child," was named in her
 * author bio and briefly listed here with a placeholder cover and a
 * functional Amazon search link, but was removed per direct instruction
 * rather than kept on the site without confirmed retail/cover details.
 *
 * Four more added later, each confirmed via a direct Amazon link and
 * real cover art supplied directly (this repo's WebFetch/WebSearch both
 * confirmed blocked from/unable to find amazon.com listings, so title,
 * page count, and cover all came from what was supplied directly, not
 * independently verified against the listing itself):
 * - "The Future Is Now: Navigating the New Era of Media Marketing" —
 *   109 pages (amazon.com/dp/B0HJ1GNHMR).
 * - "Architectural Soul" — 403 pages (amazon.com/dp/B0HFSQ4R6D).
 * - "Positive Negative: The Dual Nature of Life" — 220 pages
 *   (amazon.com/dp/B0HG87HWXD).
 * - "The Assignment" — 270 pages (amazon.com/dp/B0HH95YHT7).
 * None of the four has a confirmed publish date, so each `accolades`
 * carries only the page count. Each introduced a category the original
 * four didn't need: "Strategy," "Design," "Resilience," and "Purpose"
 * respectively.
 *
 * What's still original writing, not a verified quote, for the seven
 * without a publisher description: every `description` and `excerpt`
 * paragraph is written in this site's own voice, summarizing their
 * real, publicly-described subject — never presented as a direct
 * quotation from inside the book. `accolades` only lists facts that are
 * actually confirmed (publish date, page count) — no invented praise or
 * press.
 *
 * A ninth added later, "Together, Yet Distinct" — 115 pages, confirmed
 * via the supplied marketing copy and real cover art supplied directly
 * (not independently verified against a retail listing). Introduced the
 * "Connection" category, since the original eight didn't have one that
 * fit a relationship-focused book. Its `printSpecs` use the same
 * placeholders as the rest of the catalog.
 *
 * A tenth, "Young, Able & Unshakable" — 219 pages, same sourcing pattern
 * (supplied marketing copy + real cover art, not independently
 * verified). A confidence/decision-making guide for teens and young
 * adults; close to "Resilience" thematically but distinct enough
 * (choice and self-assurance, not recovering from hardship) to get its
 * own "Confidence" category rather than double up an existing one —
 * every book so far has had a category of its own.
 *
 * An eleventh, "The Relationship Repair Room" — 201 pages, supplied
 * marketing copy and real cover art.
 * A repair/healing-focused counterpart to "Connection" (Together, Yet
 * Distinct) rather than a duplicate of it — that one is about staying
 * yourself inside a healthy relationship, this one is about restoring a
 * damaged one — so it gets its own "Healing" category.
 *
 * A twelfth, "The Red Chair Talk" — 253 pages, with real cover art.
 * A broader conversations-and-reflection collection across love,
 * friendship, community, and everyday life, not narrowly about romantic
 * repair — distinct enough from "Healing"/"Connection" to get its own
 * "Wisdom" category. `tone` is "garnet" a second time because the real
 * cover is dominated by deep red, rather than strictly balancing the
 * four tones.
 *
 * A thirteenth, "People We Never Meet" — 321 pages, with real cover art.
 * A short-story/essay collection about strangers' lives rather than a
 * guide — distinct enough in both form and theme (empathy for people
 * outside her own story, not communication or connection within it) to
 * warrant its own "Empathy" category rather than stretching "Identity"
 * or "Connection" to cover it.
 *
 * A fourteenth, "Mailbox" — 1,000 pages, spanning 1,000 episodes and
 * 3,000 questions. Its description and real cover art were supplied
 * directly, and its confirmed paperback price is ₦100,000.
 */

export type Category =
  | "Communication"
  | "Meaning"
  | "Stillness"
  | "Identity"
  | "Strategy"
  | "Design"
  | "Resilience"
  | "Purpose"
  | "Connection"
  | "Confidence"
  | "Healing"
  | "Wisdom"
  | "Empathy"
  | "Digital";

export const CATEGORIES: Category[] = [
  "Communication",
  "Meaning",
  "Stillness",
  "Identity",
  "Strategy",
  "Design",
  "Resilience",
  "Purpose",
  "Connection",
  "Confidence",
  "Healing",
  "Wisdom",
  "Empathy",
  "Digital",
];

/** Nigeria-only for now — see the checkout route's own doc comment. */
export const CURRENCY = "NGN";

/**
 * What the printer needs to actually produce a copy once an order comes
 * in — sent in the printer's order-notification email (see
 * app/api/paystack/webhook/route.ts). `trimSize`/`binding` are guessed-
 * generic placeholders below, not confirmed specs; `pageCount` is real
 * wherever it was already confirmed via this file's own `accolades`
 * research, `undefined` where it never was.
 */
export type PrintSpecs = {
  pageCount?: number;
  trimSize: string;
  binding: string;
  /** Anything the printer needs that doesn't fit the fields above (paper stock, finish, etc.). */
  notes?: string;
};

export type Book = {
  id: string;
  order: string;
  title: string;
  category: Category;
  tone: "gold" | "indigo" | "garnet" | "ink";
  tagline: string;
  description: string;
  accolades: string[];
  excerptHeading: string;
  excerpt: string[];
  /** Confirmed paperback price in NGN (naira, not kobo). */
  price: number;
  printSpecs: PrintSpecs;
  /** Real cover art, when it exists — falls back to the BookCover mockup when absent. */
  coverImage?: string;
  /**
   * "cover" (default) fills the portrait cover slot, cropping to fit —
   * right for an image that's already shaped like a book jacket. "contain"
   * letterboxes instead, for a supplied image that isn't actually
   * portrait-cropped to begin with (a landscape marketing graphic, not a
   * jacket photo) — `object-cover` would slice its own title text off the
   * sides rather than just crop empty margin. Same reasoning as
   * study-content.ts's `imageFit`, applied to a different component.
   */
  coverFit?: "cover" | "contain";
  /** Omitted for the original catalog, whose paperback edition is available. */
  paperbackAvailable?: boolean;
};

type EbookBookMetadata = {
  bookId: string;
  title?: string;
  description?: string;
  standalone?: boolean;
};

/** Applies editable e-book metadata without replacing the established print catalog artwork or copy. */
export function applyEbookMetadata(book: Book, publication?: EbookBookMetadata | null): Book {
  if (!publication) return book;
  return {
    ...book,
    title: publication.title?.trim() || book.title,
    description: publication.description?.trim() || book.description,
  };
}

/** Builds the public catalog shape for a title that exists only as an e-book. */
export function ebookOnlyBook(publication: EbookBookMetadata): Book {
  const title = publication.title?.trim() || "Untitled e-book";
  const description =
    publication.description?.trim() ||
    "A digital-only title available through the private online reading room.";

  return {
    id: publication.bookId,
    order: "Digital",
    title,
    category: "Digital",
    tone: "ink",
    tagline: "A private digital edition for online reading.",
    description,
    accolades: [],
    excerptHeading: "About the book",
    excerpt: [description],
    price: 0,
    printSpecs: { trimSize: "Digital edition", binding: "Online reading" },
    coverImage: `/api/ebooks/${encodeURIComponent(publication.bookId)}/cover`,
    paperbackAvailable: false,
  };
}

export const BOOKS: Book[] = [
  {
    id: "think-before-you-speak",
    order: "I",
    title: "Think Before You Speak",
    category: "Communication",
    tone: "gold",
    tagline: "Embarking on the path to thoughtful communication.",
    description:
      "A book about the weight of language — how the words reached for without thinking can heal a room or wound it. It makes the case for communication as a discipline worth practicing on purpose, not a reflex to leave on autopilot.",
    accolades: ["Published November 2023.", "197 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "Every word carries consequence, whether or not it was chosen with care. Think Before You Speak is built around that idea — that thoughtful communication isn't a talent some people are born with, but a discipline anyone can practice.",
      "It's a short, direct read, aimed less at eloquence than at intention: saying what you actually mean, and meaning what you say.",
    ],
    price: 25000,
    printSpecs: { pageCount: 197, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/think-before-you-speak-mockup-transparent.png",
  },
  {
    id: "beyond-the-mundane",
    order: "II",
    title: "Beyond the Mundane",
    category: "Meaning",
    tone: "indigo",
    tagline: "The essentials of a meaningful life.",
    description:
      "An exploration of what gives a life meaning, moving across philosophical, psychological, spiritual, and practical ground rather than settling for one lens — less a formula than an invitation to look past routine toward purpose.",
    accolades: [],
    excerptHeading: "About the book",
    excerpt: [
      "Beyond the Mundane asks a plain question that's easy to avoid: what actually makes a life feel meaningful, once the routines that fill most of it are set aside?",
      "The answer isn't treated as a single idea. The book moves between the philosophical, the psychological, the spiritual, and the practical — meaning built from several directions at once, not handed down from one.",
    ],
    price: 35000,
    printSpecs: { trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/beyond-the-mundane-mockup-transparent.png",
  },
  {
    id: "tranquility",
    order: "III",
    title: "Tranquility",
    category: "Stillness",
    tone: "garnet",
    tagline: "Cultivating serenity amid the storm.",
    description:
      "Framed as a companion for finding calm rather than a promise of a storm-free life — a guide to staying steady inside the one you're already in.",
    accolades: ["Published June 2025."],
    excerptHeading: "About the book",
    excerpt: [
      "Tranquility doesn't promise a life without storms. It's offered instead as a companion inside them — a guide to cultivating serenity as a practice, not a destination reached once and kept forever.",
      "The tone throughout sits closer to companionship than instruction: less a manual, more a steady voice for whoever picks it up mid-storm.",
    ],
    price: 30000,
    printSpecs: { trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/tranquility-mockup-transparent.png",
  },
  {
    id: "black-is-beautiful",
    order: "IV",
    title: "Black Is Beautiful",
    category: "Identity",
    tone: "ink",
    tagline: "A celebration of Black culture, identity, and pride.",
    description:
      "A heartfelt tribute to the beauty and strength of Black identity — its history, traditions, and creative expressions — and a celebration of the pride found in Black communities everywhere.",
    accolades: [],
    excerptHeading: "From the publisher's description",
    excerpt: [
      "Black Is Beautiful shines a light on the rich and diverse world of Black culture. This book is a heartfelt tribute to the beauty and strength of Black identity, exploring its history, traditions, and creative expressions.",
      "More than just a book, Black Is Beautiful is a celebration of the pride and beauty found in Black communities everywhere. It invites readers to appreciate and understand the true beauty of Black culture, challenging stereotypes and offering a deeper look into what makes it special.",
    ],
    price: 30000,
    printSpecs: { trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/black-is-beautiful-mockup-transparent.png",
  },
  {
    id: "the-future-is-now",
    order: "V",
    title: "The Future Is Now",
    category: "Strategy",
    tone: "indigo",
    tagline: "Navigating the new era of media marketing.",
    description:
      "A visually driven guide to media marketing's fastest-moving era — the attention economy, digital brand relevance, AI-driven creative strategy, and the leadership mindset it now takes to build what's next.",
    accolades: ["109 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "The Future Is Now argues that media marketing's old playbooks have expired — the landscape has shifted faster in the last five years than in the fifty before it, and strategies that worked even recently no longer hold up.",
      "Aimed at marketers, entrepreneurs, and creative leaders, it works through the forces reshaping attention and influence today, from the attention economy to AI-driven creative strategy, pairing each idea with bold full-color visual design rather than dense text alone.",
    ],
    price: 40000,
    printSpecs: { pageCount: 109, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/the-future-is-now-mockup-transparent.png",
  },
  {
    id: "architectural-soul",
    order: "VI",
    title: "Architectural Soul",
    category: "Design",
    tone: "ink",
    tagline: "Breathe life into spaces with thoughtful design and details.",
    description:
      "A curated look at how intentional design and refined detail come together to shape spaces that inspire and elevate everyday living — architecture and interior design treated as one continuous creative process.",
    accolades: ["403 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "Architectural Soul moves through interior design and architecture as one continuous discipline — how intentional design, refined detail, and an understanding of how people actually live combine to shape spaces that inspire and nurture rather than just house.",
      "It follows the process from concept to completion, treating a finished room or building less as a fixed object than as the record of a series of decisions — where vision meets purpose, and lasting impact begins.",
    ],
    price: 100000,
    printSpecs: { pageCount: 403, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/architectural-soul-mockup-transparent.png",
  },
  {
    id: "positive-negative",
    order: "VII",
    title: "Positive Negative",
    category: "Resilience",
    tone: "garnet",
    tagline: "The dual nature of life.",
    description:
      "An exploration of life's built-in dualities — light and dark, win and loss, faith and fear — framed not as opposites to resolve but as a balance to keep showing up inside.",
    accolades: ["220 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "Positive Negative treats life's contradictions as the point, not a problem to solve — the same stretch of time can hold both the light that lifts and the darkness that shapes, without one canceling the other out.",
      "Its throughline isn't picking a side of any of those pairs. It's staying in motion through both of them — whole, honest, and unwilling to stop showing up.",
    ],
    price: 35000,
    printSpecs: { pageCount: 220, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/positive-negative-mockup-transparent.png",
  },
  {
    id: "the-assignment",
    order: "VIII",
    title: "The Assignment",
    category: "Purpose",
    tone: "gold",
    tagline: "Discover it. Accept it. Live it.",
    description:
      "A faith-rooted call to live on purpose rather than react to busyness — for anyone who reads as successful from the outside but doesn't feel aligned with what they're actually here to do.",
    accolades: ["270 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "The Assignment starts from the idea that nobody ends up here by accident, and that it's easy to lose sight of that somewhere between busyness and burnout. It's written for people who look successful from the outside but don't feel fulfilled or aligned on the inside.",
      "Across its chapters the book moves from confusion toward clarity and from intention toward action, treating purpose less as a vague aspiration than as something to actually discover, accept, and live out with discipline.",
    ],
    price: 35000,
    printSpecs: { pageCount: 270, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/the-assignment-mockup-transparent.png",
  },
  {
    id: "together-yet-distinct",
    order: "IX",
    title: "Together, Yet Distinct",
    category: "Connection",
    tone: "gold",
    tagline: "How to love deeply, stay desirable, and never lose yourself.",
    description:
      "A relationship guide built around one idea: closeness and individuality aren't opposites. It works through desire, emotional maturity, respect, and commitment to make the case for a love chosen freely rather than one that asks either person to disappear into it.",
    accolades: ["115 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "Together, Yet Distinct starts from a plain distinction: connection and confusion aren't the same thing, and neither are closeness and disappearance. It's written for anyone trying to build something lasting without quietly editing themselves out of it — their boundaries, their growth, their sense of who they are outside the relationship.",
      "Its throughline is that healthy love isn't possession or dependency, but two people choosing each other on purpose, again and again, while still becoming more fully themselves. Not a love that asks you to shrink to fit it — one built to hold both people whole.",
    ],
    price: 35000,
    printSpecs: { pageCount: 115, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/together-yet-distinct-mockup-transparent.png",
  },
  {
    id: "young-able-unshakable",
    order: "X",
    title: "Young, Able & Unshakable",
    category: "Confidence",
    tone: "indigo",
    tagline: "Own your choices. Build your confidence. Lead your life.",
    description:
      "A practical confidence guide for teenagers and young adults — reflection prompts and exercises for making wiser choices, recovering from setbacks, and building self-respect, aimed at mentors and parents as much as the young readers themselves.",
    accolades: ["219 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "Young, Able & Unshakable treats growing up as a series of decisions, not a single arrival at adulthood — the pressure, comparison, and mistakes that come with it are the material to work with, not obstacles to wait out. Confidence here isn't framed as being unshakeable by nature, but built one choice at a time.",
      "Its lessons and reflection prompts move through understanding yourself, recovering from setbacks, building healthy habits, choosing good friendships, and taking responsibility for what comes next — a resource meant to be worked through with a mentor, parent, or educator as easily as alone.",
    ],
    price: 20000,
    printSpecs: { pageCount: 219, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/young-able-unshakable-mockup-transparent.png",
  },
  {
    id: "the-relationship-repair-room",
    order: "XI",
    title: "The Relationship Repair Room",
    category: "Healing",
    tone: "garnet",
    tagline: "Come in. Sit down. Let's fix what hurts.",
    description:
      "A session-based guide for couples working to rebuild trust and close the distance that's grown between them — honest conversation, reflection, and practical exercises for repairing what's broken rather than starting over.",
    accolades: ["201 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "The Relationship Repair Room is built for couples who already know something is wrong — trust has thinned, conversations have gone quiet, distance has crept in — but aren't sure where to start putting it back together. It moves through honest conversation, personal reflection, and practical exercises session by session, rather than asking two people to fix everything at once.",
      "Its focus stays on the ordinary mechanics of repair: communicating without defensiveness, naming a wound instead of avoiding it, handling conflict without letting it corrode the relationship, and building the small habits that keep a home steady. Written for a relationship in real trouble as much as one that just needs tending to.",
    ],
    price: 50000,
    printSpecs: { pageCount: 201, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/the-relationship-repair-room-mockup-transparent.png",
  },
  {
    id: "the-red-chair-talk",
    order: "XII",
    title: "The Red Chair Talk",
    category: "Wisdom",
    tone: "garnet",
    tagline: "Real conversations. Real people. Real wisdom.",
    description:
      "A collection of honest conversations across love, friendship, community, and everyday life — less a single argument than an invitation to sit down, reflect, and see the ordinary moments that shape how we love, listen, forgive, and show up for each other more clearly.",
    accolades: ["253 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "The Red Chair Talk moves conversation by conversation rather than chapter by chapter — each one its own pause to sit with a different part of ordinary life: love, friendship, community, the small daily choices that add up to how a person lives. It isn't built around one big idea so much as many honest ones, offered a little at a time.",
      "What holds the collection together is a consistent lens: warmth without avoiding the hard parts, wisdom offered plainly rather than performed. Written for whoever needs perspective on a relationship, a friendship worth rebuilding, or just a clearer way to show up for the people around them.",
    ],
    price: 35000,
    printSpecs: { pageCount: 253, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/the-red-chair-talk-mockup-transparent.png",
  },
  {
    id: "people-we-never-meet",
    order: "XIII",
    title: "People We Never Meet",
    category: "Empathy",
    tone: "ink",
    tagline: "Stories from lives that could have been ours.",
    description:
      "A collection of stories about strangers whose paths never cross ours but whose joys, wounds, and choices feel unmistakably familiar — an argument, told story by story, that every life carries something worth understanding, even from a distance.",
    accolades: ["321 pages."],
    excerptHeading: "About the book",
    excerpt: [
      "People We Never Meet moves through fleeting encounters and quiet turning points in lives that never touch the reader's own directly — a stranger on a journey, a moment glimpsed and then gone — treating each one as a full story rather than a passing detail.",
      "Underneath the individual stories is one throughline: identity, memory, love, and loss aren't private to the people living them. The collection asks readers to sit with someone else's life long enough to recognize their own in it, on the premise that every stranger could have been us.",
    ],
    price: 30000,
    printSpecs: { pageCount: 321, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/people-we-never-meet-mockup-transparent.png",
  },
  {
    id: "mailbox",
    order: "XIV",
    title: "Mailbox",
    category: "Wisdom",
    tone: "indigo",
    tagline: "Real life, love, wisdom & faith.",
    description:
      "A powerful collection of wisdom, healing, and truth drawn from everyday questions about real life, love, relationships, faith, family, friendship, purpose, and personal growth.",
    accolades: ["1,000 pages.", "1,000 episodes. 3,000 questions."],
    excerptHeading: "From the publisher's description",
    excerpt: [
      "MAILBOX is a powerful collection of wisdom, healing, and truth drawn from everyday questions about real life, love, relationships, faith, family, friendship, purpose, and personal growth.",
      "Across 1,000 episodes and 3,000 questions, Adeseun Oyeneye offers thoughtful guidance, spiritual insight, moral clarity, and scripture-based responses for readers seeking direction in ordinary and difficult moments. Each entry speaks to a real concern, then gently points the reader toward reflection, wise choices, and a brighter tomorrow.",
      "Practical, compassionate, and faith-centered, MAILBOX helps readers pause, think deeply, and respond to life with courage, grace, and wisdom.",
    ],
    price: 100000,
    printSpecs: { pageCount: 1000, trimSize: "6 in × 9 in (placeholder)", binding: "Paperback (placeholder)" },
    coverImage: "/images/mailbox-mockup-transparent-v2.png",
  },
];

export const PAGE_INTRO = "Books browsed the way they were written: one at a time, with room to sit with each.";
