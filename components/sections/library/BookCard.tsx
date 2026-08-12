import type { Book } from "./library-content";
import { BookCover } from "./BookCover";

/**
 * Hover lift + glow is a plain CSS transition, not Motion — per the
 * vendored pick-ui-library skill, "a simple hover or fade doesn't need
 * [Motion] — plain CSS transitions are the right tool there." Tailwind
 * v4's `hover:` variant already compiles to `@media (hover: hover)`, so
 * this is inert on touch without any extra gating.
 */
export function BookCard({ book, onSelect }: { book: Book; onSelect: (book: Book) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(book)}
      className="group block w-full text-left [perspective:1000px]"
      aria-haspopup="dialog"
    >
      <span
        className="block aspect-[2/3] rounded-frame shadow-elevation-card transition-[transform,box-shadow] duration-300 ease-gallery-out will-change-transform
          group-hover:-translate-y-2 group-hover:shadow-glow-gold group-active:translate-y-0 group-active:scale-[0.98]"
      >
        {/* Order, category, and title all live on the cover mockup itself
            (BookCover) — real HTML text, not a photo, so repeating them
            as a caption below would just be the same copy twice. */}
        <BookCover book={book} className="h-full" />
      </span>
    </button>
  );
}
