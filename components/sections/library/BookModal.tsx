"use client";

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Select } from "@base-ui/react/select";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { X, CaretDown, Check, BookOpenText } from "@phosphor-icons/react/dist/ssr";
import { BookCover } from "./BookCover";
import type { Book } from "./library-content";
import { bookTiltSpring } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const TILT_RANGE = 10; // degrees — "slow rotation," not a cartoon flip

/**
 * The modal is an experience, not a pop-up: base-ui's Dialog gives real
 * keyboard behavior (focus trap, Escape, return focus to the trigger)
 * for free, per the vendored pick-ui-library skill — hand-rolling that
 * ourselves would be reinventing what the primitive already solves.
 *
 * Entrance/exit reuse the site's pre-named `nookExpand`/`nookCollapse`
 * keyframes (app/styles/tokens.css) via base-ui's `data-starting-style`
 * / `data-ending-style` attributes, the same pairing emil-design-eng's
 * tooltip recipe uses — exit is deliberately faster than entrance
 * (asymmetric enter/exit timing).
 */
export function BookModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  // Mirrors `book`, but only ever advances to a non-null value — the
  // popup keeps rendering the closing book's content through its exit
  // animation instead of going blank the instant the parent clears
  // selection. Adjusted during render (React's documented pattern for
  // "state derived from a prop"), not in an effect — no cascading
  // render, no lint violation for setState-in-effect.
  const [displayBook, setDisplayBook] = useState<Book | null>(null);
  if (book && book !== displayBook) {
    setDisplayBook(book);
  }

  const reducedMotion = usePrefersReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, bookTiltSpring);
  const springRotateY = useSpring(rotateY, bookTiltSpring);

  // Resetting a motion value isn't React state — this is the legitimate
  // "synchronize with an external system" effect use, not the setState
  // cascade the lint rule guards against.
  useEffect(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [displayBook, rotateX, rotateY]);

  function handleCoverPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reducedMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * TILT_RANGE * 2);
    rotateX.set(-relY * TILT_RANGE * 2);
  }

  function handleCoverPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <Dialog.Root open={book !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-hero-ground/70 backdrop-blur-sm transition-opacity duration-300 ease-gallery-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[88vh] w-[min(92vw,64rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-frame bg-surface shadow-elevation-modal outline-none animate-nook-expand data-[ending-style]:animate-nook-collapse sm:flex-row"
        >
          {displayBook && (
            <>
              <Dialog.Close
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-control bg-surface/80 text-text-subdued backdrop-blur transition-colors duration-150 ease-gallery-standard hover:bg-surface hover:text-text"
              >
                <X size={18} weight="light" />
              </Dialog.Close>

              <div
                data-testid="book-cover-tilt-zone"
                className="flex w-full items-center justify-center bg-surface-sunken p-8 sm:w-2/5 sm:p-10 [perspective:1200px]"
                onPointerMove={handleCoverPointerMove}
                onPointerLeave={handleCoverPointerLeave}
              >
                <motion.div
                  className="aspect-[2/3] w-full max-w-[280px]"
                  style={{
                    rotateX: reducedMotion ? 0 : springRotateX,
                    rotateY: reducedMotion ? 0 : springRotateY,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <BookCover book={displayBook} size="modal" className="h-full shadow-elevation-card" />
                </motion.div>
              </div>

              <BookDetails key={displayBook.id} book={displayBook} />
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/**
 * The right-column content, including the excerpt disclosure. Keyed by
 * book id in the parent, so switching books remounts this component and
 * resets `showExcerpt` for free — no effect needed to "reset state when
 * a prop changes."
 */
function BookDetails({ book }: { book: Book }) {
  const [showExcerpt, setShowExcerpt] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-8 sm:p-10">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-gold-ink">
        Book {book.order} · {book.category}
      </span>
      <Dialog.Title className="mt-2 text-balance font-display text-3xl font-semibold leading-tight text-text sm:text-4xl">
        {book.title}
      </Dialog.Title>
      <Dialog.Description className="mt-3 text-lg italic leading-snug text-text-subdued">
        {book.tagline}
      </Dialog.Description>

      <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-text-subdued">{book.description}</p>

      {book.accolades.length > 0 && (
        <ul className="mt-6 space-y-2 border-l border-line pl-4">
          {book.accolades.map((line) => (
            <li key={line} className="text-sm italic leading-snug text-text-faint">
              {line}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <PurchaseSelect book={book} />
        <button
          type="button"
          onClick={() => setShowExcerpt((v) => !v)}
          aria-expanded={showExcerpt}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-text-subdued transition-colors duration-150 ease-gallery-standard hover:text-gold-ink"
        >
          <BookOpenText size={16} weight="light" />
          {showExcerpt ? "Hide excerpt" : "Read an excerpt"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showExcerpt && (
          <motion.div
            key="excerpt"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 border-t border-line-whisper pt-6">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-text-faint">
                {book.excerptHeading}
              </span>
              <div className="mt-3 columns-1 gap-8 font-body text-[0.95rem] leading-relaxed text-text sm:columns-2 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-2 [&>p:first-of-type]:first-letter:font-display [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:text-gold-ink">
                {book.excerpt.map((paragraph, i) => (
                  <p key={i} className="mb-4 break-inside-avoid">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The "Purchase" control — a refined select whose options are vendor links; choosing one opens that retailer in a new tab. */
function PurchaseSelect({ book }: { book: Book }) {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Select.Root
      value={value}
      onValueChange={(url) => {
        setValue(url);
        if (url) window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <Select.Trigger className="inline-flex items-center gap-3 rounded-control border border-line bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-text transition-colors duration-150 ease-gallery-standard hover:border-gold data-[popup-open]:border-gold">
        <Select.Value placeholder="Purchase" />
        <Select.Icon className="text-text-faint">
          <CaretDown size={14} weight="light" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={8} className="z-50">
          <Select.Popup className="min-w-[--anchor-width] overflow-hidden rounded-frame border border-line-whisper bg-surface-elevated py-1 shadow-elevation-card animate-nook-expand data-[ending-style]:animate-nook-collapse">
            <Select.List>
              {book.vendors.map((vendor) => (
                <Select.Item
                  key={vendor.url}
                  value={vendor.url}
                  className="flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-text-subdued outline-none transition-colors data-[highlighted]:bg-gold-tint data-[highlighted]:text-gold-ink"
                >
                  <Select.ItemText>{vendor.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} weight="bold" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
