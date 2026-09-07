/**
 * Content for The Library (/library) — her four published books.
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
 * Amazon/Lulu vendor links point at real listings, not fabricated
 * product pages or search-query fallbacks.
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
 */

export type Category =
  | "Communication"
  | "Meaning"
  | "Stillness"
  | "Identity"
  | "Strategy"
  | "Design"
  | "Resilience"
  | "Purpose";

export const CATEGORIES: Category[] = [
  "Communication",
  "Meaning",
  "Stillness",
  "Identity",
  "Strategy",
  "Design",
  "Resilience",
  "Purpose",
];

export type Vendor = { label: string; url: string };

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
  vendors: Vendor[];
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
};

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
    vendors: [
      { label: "Amazon", url: "https://www.amazon.com/THINK-BEFORE-YOU-SPEAK-communication-ebook/dp/B0CLWWC446" },
      { label: "Lulu", url: "https://www.lulu.com/shop/adeseun-oyeneye/think-before-you-speak/paperback/product-rmm8edn.html" },
    ],
    coverImage: "/images/think-before-you-speak-cover.jpg",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.com/BEYOND-MUNDANE-Essentials-meaningful-life/dp/B0CV427BX6" }],
    coverImage: "/images/beyond-the-mundane-cover.jpg",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.es/Tranquility-Adeseun-Oyeneye/dp/9786958411" }],
    coverImage: "/images/tranquility-cover.jpg",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.com/Black-Beautiful-Adeseun-Oyeneye/dp/B0DH261JSK" }],
    coverImage: "/images/black-is-beautiful-cover.webp",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.com/dp/B0HJ1GNHMR" }],
    coverImage: "/images/the-future-is-now-cover.png",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.com/dp/B0HFSQ4R6D" }],
    coverImage: "/images/architectural-soul-cover.png",
    coverFit: "contain",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.com/dp/B0HG87HWXD" }],
    coverImage: "/images/positive-negative-cover.png",
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
    vendors: [{ label: "Amazon", url: "https://www.amazon.com/dp/B0HH95YHT7" }],
    coverImage: "/images/the-assignment-cover.png",
  },
];

export const PAGE_INTRO = "Eight books, browsed the way they were written — one at a time, with room to sit with each.";
