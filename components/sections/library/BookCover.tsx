import Image from "next/image";
import type { Book } from "./library-content";
import { cn } from "@/lib/utils";

/**
 * A designed placeholder, not a fake photo — no real cover art exists
 * yet. Per taste-skill 4.8 ("use placeholders for now" is the brief's
 * own instruction here), this renders as an intentional jacket mockup:
 * order numeral, category, a thin rule, the title in display serif.
 *
 * Tone is one of the site's four sanctioned colors (gold/indigo/garnet)
 * plus hero-ground ("ink") — the same palette used everywhere else on
 * the site, just applied as jacket-color rather than section background.
 * This is object color (like a product photo would be), not a second
 * dark page section — the page around it stays the Alabaster Gallery;
 * taste-skill's Page Theme Lock (4.11) governs section backgrounds, not
 * the color of an individual card's artwork.
 */
const TONE_CLASSES: Record<Book["tone"], string> = {
  gold: "bg-gold-fill text-text-on-dark",
  indigo: "bg-indigo text-text-on-dark",
  garnet: "bg-garnet text-text-on-dark",
  ink: "bg-hero-ground text-text-on-dark",
};

export function BookCover({
  book,
  size = "card",
  className,
}: {
  book: Book;
  size?: "card" | "modal";
  className?: string;
}) {
  if (book.coverImage) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden rounded-frame", className)}>
        <Image
          src={book.coverImage}
          alt={`${book.title} cover`}
          fill
          sizes={size === "modal" ? "(min-width: 640px) 280px, 60vw" : "(min-width: 1024px) 25vw, 45vw"}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col justify-between overflow-hidden rounded-frame p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
        TONE_CLASSES[book.tone],
        size === "modal" && "p-8",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.15em] opacity-70">
        <span>{book.order}</span>
        <span>{book.category}</span>
      </div>
      <div className="relative">
        <div aria-hidden="true" className="mb-3 h-px w-10 bg-current opacity-50" />
        <h3
          className={cn(
            "text-balance font-display font-semibold leading-tight",
            size === "modal" ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl",
          )}
        >
          {book.title}
        </h3>
      </div>
    </div>
  );
}
