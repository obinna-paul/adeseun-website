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
 * What's still original writing, not a verified quote, for the three
 * without a publisher description: every `description` and `excerpt`
 * paragraph is written in this site's own voice, summarizing their
 * real, publicly-described subject — never presented as a direct
 * quotation from inside the book. `accolades` only lists facts that are
 * actually confirmed (publish date, page count) — no invented praise or
 * press.
 */

export type Category = "Communication" | "Meaning" | "Stillness" | "Identity";

export const CATEGORIES: Category[] = ["Communication", "Meaning", "Stillness", "Identity"];

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
];

export const PAGE_INTRO = "Four books, browsed the way they were written — one at a time, with room to sit with each.";
