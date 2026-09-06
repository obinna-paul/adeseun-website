"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LazyImage } from "@/components/ui/LazyImage";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { VideoCard } from "@/components/sections/screening-room/VideoCard";
import { gentleReveal, staggerChildren } from "@/lib/motion";
import { VENTURES } from "@/components/sections/businesses/businesses-content";
import { BOOKS } from "@/components/sections/library/library-content";
import { SCREENING_ROOM_VIDEOS } from "@/components/sections/screening-room/screening-room-content";
import { CREDENTIAL_GROUPS } from "@/components/sections/study/study-content";
import {
  POSITIONING_HEADLINE,
  POSITIONING_BODY,
  BUSINESSES_HEADLINE,
  BUSINESSES_BODY,
  QUOTES_HEADLINE,
  QUOTES_BODY,
  BOOK_HEADLINE,
  MEDIA_HEADLINE,
  MEDIA_BODY,
  RECOGNITION_HEADLINE,
  CTA_HEADLINE,
  CTA_BODY,
} from "./home-content";

const FEATURED_BOOK = BOOKS.find((book) => book.id === "tranquility")!;
const FEATURED_VENTURES = VENTURES.slice(0, 5);
const FEATURED_VIDEOS = SCREENING_ROOM_VIDEOS.slice(0, 2);
const RECOGNITION_ITEMS = (CREDENTIAL_GROUPS.find((group) => group.label === "Recognition")?.items ?? []).slice(0, 4);

/**
 * Every one of `book.excerpt`'s paragraphs, flattened across all four
 * books — the same real, already-disclosed copy BookModal shows under
 * "About the book" (or, for Black Is Beautiful, the actual publisher's
 * description), not new writing invented for this section. Each card is
 * captioned by book title only, never phrased as something she said —
 * library-content.ts's own doc comment is explicit that three of these
 * four books' excerpt text is site-original summary, not a verbatim
 * passage from inside the book, so presenting these as quotations from
 * her would misattribute site copy as her own words. "A line from each
 * book," not "in her own words."
 */
const QUOTES = BOOKS.flatMap((book) =>
  book.excerpt.map((text, i) => ({ id: `${book.id}-${i}`, text, bookTitle: book.title })),
);

/**
 * Plain editorial text block, no image, no eyebrow label — a deliberately
 * different layout family from every section after it, and the first of
 * several distinct compositions Home now uses instead of repeating one
 * card-grid pattern down the page.
 */
export function HomePositioningSection() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="Positioning">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={gentleReveal}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-balance font-display text-3xl font-semibold text-text sm:text-4xl">
          {POSITIONING_HEADLINE}
        </h2>
        <p className="mt-5 text-lg text-text-subdued">{POSITIONING_BODY}</p>
      </motion.div>
    </section>
  );
}

/**
 * A plain divided list, not a card grid — per direct instruction to
 * avoid the same-size icon-plus-heading-plus-text container as the
 * page's default structure. Names and roles only; the full page
 * (/businesses) carries the imagery and detail.
 */
export function HomeBusinessesSection() {
  return (
    <section className="bg-surface-sunken px-gutter py-room" aria-label="Businesses">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance font-display text-3xl font-semibold text-text sm:text-4xl">
          {BUSINESSES_HEADLINE}
        </h2>
        <p className="mt-4 text-lg text-text-subdued">{BUSINESSES_BODY}</p>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren(70)}
        className="mx-auto mt-12 flex max-w-3xl flex-col divide-y divide-line-whisper"
      >
        {FEATURED_VENTURES.map((venture) => (
          <motion.li
            key={venture.id}
            variants={gentleReveal}
            className="flex flex-col items-baseline justify-between gap-1 py-4 sm:flex-row sm:gap-4"
          >
            <span className="font-display text-xl text-text">{venture.name}</span>
            <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-faint">{venture.role}</span>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-10 flex justify-center">
        <MagneticButton href="/businesses" variant="secondary" dense>
          See the businesses
        </MagneticButton>
      </div>
    </section>
  );
}

/** Image-and-text split, zigzag position 1 of 2. */
export function HomeFeaturedBookSection() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="Featured book">
      <div className="mx-auto flex max-w-frame flex-col items-center gap-12 lg:flex-row lg:items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={gentleReveal}
          className="w-full max-w-xs shrink-0 lg:max-w-sm"
        >
          <LazyImage
            src={FEATURED_BOOK.coverImage}
            alt={FEATURED_BOOK.title}
            fit="contain"
            className="aspect-[2/3]"
            sizes="(min-width: 1024px) 30vw, 70vw"
          />
        </motion.div>

        <div className="max-w-md">
          <p className="text-lg text-text-faint">{BOOK_HEADLINE}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-text sm:text-4xl">{FEATURED_BOOK.title}</h2>
          <p className="mt-3 text-lg text-text-subdued">{FEATURED_BOOK.tagline}</p>
          <div className="mt-8">
            <MagneticButton href="/books" variant="secondary" dense>
              Explore the library
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Image-and-text split, reversed, zigzag position 2 of 2 (cap reached). */
export function HomeMediaSection() {
  return (
    <section className="bg-surface-sunken px-gutter py-room" aria-label="Media">
      <div className="mx-auto flex max-w-frame flex-col items-center gap-12 lg:flex-row-reverse lg:items-center">
        <div className="grid w-full max-w-md shrink-0 grid-cols-2 gap-4 lg:max-w-sm">
          {FEATURED_VIDEOS.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">{MEDIA_HEADLINE}</h2>
          <p className="mt-3 text-lg text-text-subdued">{MEDIA_BODY}</p>
          <div className="mt-8">
            <MagneticButton href="/media" variant="secondary" dense>
              Watch more
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Stacked list, no cards, no big numbers, breaking the zigzag streak above. */
export function HomeRecognitionSection() {
  return (
    <section className="bg-ground px-gutter py-room" aria-label="Recognition">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">{RECOGNITION_HEADLINE}</h2>
      </div>

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerChildren(80)}
        className="mx-auto mt-10 flex max-w-xl flex-col gap-4"
      >
        {RECOGNITION_ITEMS.map((item) => (
          <motion.li key={item} variants={gentleReveal} className="border-t border-line-whisper pt-4 text-lg text-text">
            {item}
          </motion.li>
        ))}
      </motion.ol>

      <div className="mt-8 flex justify-center">
        <Link href="/awards" data-cursor="link" className="link-gradient font-mono text-sm uppercase tracking-[0.1em]">
          The full record
        </Link>
      </div>
    </section>
  );
}

/**
 * A swipeable strip of quote cards — a new layout family, distinct from
 * every section around it. `bg-surface-sunken` here (not `bg-ground`
 * like the section it follows) keeps the page's ground/sunken
 * alternation intact rather than placing two "ground" sections back to
 * back; the cards themselves use `bg-surface` for contrast against that
 * darker section background, the same two-token pairing BookModal
 * already uses (in reverse) for its cover panel.
 *
 * Native `overflow-x-auto` + `snap-x snap-mandatory` rather than a hand-
 * rolled drag gesture: touch swipe, trackpad scroll, and shift+wheel all
 * just work for free, and scroll-snap holds each card centered when the
 * gesture ends instead of stopping mid-card. The arrow buttons are a
 * fallback for mouse-only desktop visitors who won't think to scroll a
 * text card horizontally; `scrollBy` steps by one card's own measured
 * width (+ its gap) rather than a guessed pixel amount, so it still
 * lands on a snap point at any viewport width.
 */
export function HomeQuotesSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-quote-card]");
    const gap = 24; // matches gap-6 below
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.85;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="bg-surface-sunken py-room" aria-label="Quotes from her books">
      <div className="mx-auto max-w-2xl px-gutter text-center">
        <h2 className="text-balance font-display text-3xl font-semibold text-text sm:text-4xl">{QUOTES_HEADLINE}</h2>
        <p className="mt-4 text-lg text-text-subdued">{QUOTES_BODY}</p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={gentleReveal}
        className="mt-12"
      >
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter pb-2 [scrollbar-width:thin]"
        >
          {QUOTES.map((quote) => (
            <figure
              key={quote.id}
              data-quote-card
              className="flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-frame border border-line-whisper bg-surface p-8 sm:w-[26rem]"
            >
              <blockquote className="text-balance font-display text-xl leading-snug text-text sm:text-2xl">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-text-faint">
                {quote.bookTitle}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous quote"
            data-cursor="link"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-subdued transition-colors duration-150 ease-gallery-standard hover:border-gold hover:text-gold-ink active:text-gold-ink"
          >
            <ArrowLeft size={18} weight="light" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next quote"
            data-cursor="link"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-subdued transition-colors duration-150 ease-gallery-standard hover:border-gold hover:text-gold-ink active:text-gold-ink"
          >
            <ArrowRight size={18} weight="light" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/** Centered CTA banner, closing the page on the same intent the hero opened with. */
export function HomeCTASection() {
  return (
    <section className="bg-hero-ground px-gutter py-24 text-center" aria-label="Contact">
      <h2 className="text-balance font-display text-3xl font-semibold text-text-on-dark sm:text-4xl">{CTA_HEADLINE}</h2>
      <p className="mx-auto mt-3 max-w-md text-lg text-text-on-dark/80">{CTA_BODY}</p>
      <div className="mt-8 flex justify-center">
        <MagneticButton href="/contact" variant="primary">
          Work With Me
        </MagneticButton>
      </div>
    </section>
  );
}
