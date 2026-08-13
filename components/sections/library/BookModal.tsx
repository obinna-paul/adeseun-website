"use client";

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Select } from "@base-ui/react/select";
import { AnimatePresence, motion, useDragControls, useMotionValue, useSpring, type PanInfo } from "motion/react";
import { X, CaretDown, Check, BookOpenText } from "@phosphor-icons/react/dist/ssr";
import { BookCover } from "./BookCover";
import type { Book } from "./library-content";
import { bookTiltSpring } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const TILT_RANGE = 10; // degrees — "slow rotation," not a cartoon flip

// Defined once at module scope, not inside the component — motion.create()
// returns a new component type on every call, and calling it per-render
// would give the Popup a fresh identity each time, forcing a full
// remount (and killing base-ui's own enter/exit animation state) instead
// of the same element just re-rendering with new props.
const MotionDialogPopup = motion.create(Dialog.Popup);

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
 *
 * ── Mobile art direction: full-screen bottom sheet ───────────────────
 * Below `1023px` (`useMediaQuery`, matching the `lg` threshold the rest
 * of the site's layout swaps use) the centered, scaled-in dialog becomes
 * a sheet anchored to the bottom edge, sliding up from off-screen
 * (`translate-y-full` transitioned via the same data-starting/ending-
 * style pattern the backdrop already uses, not the desktop's scale-based
 * nookExpand keyframe — a modal that scales up from its own center reads
 * fine floating in the middle of a desktop viewport; a sheet that's
 * meant to feel anchored to the bottom edge should slide, not zoom).
 * Cover and details stack in a plain column (the shared `flex-col`
 * base) instead of the desktop `flex-row` split.
 *
 * The cover container's `w-full`/`w-2/5` split is written as fully
 * mutually-exclusive branches, not a shared `w-full` base with `w-2/5`
 * layered on top for the desktop case — that was a real bug: two width
 * utilities of equal specificity in one class string don't reliably
 * resolve by "whichever appears later in the string," only by whichever
 * rule Tailwind happened to emit later in the generated stylesheet, so
 * the shared `w-full` was silently winning on desktop too, blowing the
 * cover out to nearly the full modal width and squeezing BookDetails
 * into a sliver. Never give a `cn()` call two conflicting values for
 * the same CSS property across its base/conditional classes — always
 * make the conditional branches independently complete instead.
 *
 * The compact cover is capped much smaller (`max-w-[150px]`, down from
 * the same 280px cap the desktop split column uses) — real feedback:
 * on a short phone viewport, the fixed-height cover block was eating so
 * much of the sheet's `max-h-[92dvh]` budget that BookDetails' own
 * `overflow-y-auto` region below it was left too short to comfortably
 * read or scroll. `shrink-0` on the cover container keeps it from
 * collapsing further as flex content, so the height budget it gives up
 * goes entirely to `flex-1` BookDetails instead.
 *
 * `data-lenis-prevent` on the backdrop and popup — without it, Lenis's
 * global wheel listener (SmoothScroll) keeps driving the *background*
 * page's scroll position while the modal is open and the pointer is
 * over it, ignoring BookDetails' own `overflow-y-auto`. The attribute
 * tells Lenis to skip hijacking wheel events anywhere inside these two
 * elements, so native scroll behavior — including BookDetails' own
 * internal scrolling — takes over normally instead.
 *
 * Swipe-to-close only arms from the drag handle and the cover image —
 * deliberately NOT the whole sheet surface. `BookDetails` below has its
 * own `overflow-y-auto` scroll region for the description/excerpt; if
 * the entire sheet were one Motion drag target, a finger trying to
 * scroll that text would fight the sheet's own y-drag for the gesture.
 * `useDragControls` + `dragListener={false}` is Motion's documented
 * pattern for exactly this: the sheet is still the element that
 * physically translates, but a drag can only *start* from an element
 * that explicitly calls `dragControls.start(event)` on pointerdown.
 * `dragConstraints={{ top: 0 }}` blocks dragging the sheet up past its
 * resting position (only closing is a gesture here, not "drag to see
 * more"); `dragSnapToOrigin` springs it back whenever a release doesn't
 * clear the close threshold in `handleSheetDragEnd`.
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

  const isCompact = useMediaQuery("(max-width: 1023px)");
  const dragControls = useDragControls();

  // Resetting a motion value isn't React state — this is the legitimate
  // "synchronize with an external system" effect use, not the setState
  // cascade the lint rule guards against.
  useEffect(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [displayBook, rotateX, rotateY]);

  function startSheetDrag(e: ReactPointerEvent) {
    if (isCompact) dragControls.start(e);
  }

  function handleSheetDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.y > 120 || info.velocity.y > 600) {
      onClose();
    }
  }

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
        <Dialog.Backdrop
          data-lenis-prevent
          className="fixed inset-0 z-40 bg-hero-ground/70 backdrop-blur-sm transition-opacity duration-300 ease-gallery-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
        />
        <MotionDialogPopup
          data-lenis-prevent
          drag={isCompact ? "y" : false}
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0.06, bottom: 0.5 }}
          dragSnapToOrigin
          onDragEnd={handleSheetDragEnd}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden bg-surface shadow-elevation-modal outline-none",
            isCompact
              ? "inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-frame transition-transform duration-300 ease-gallery-out data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full"
              : "left-1/2 top-1/2 max-h-[88vh] w-[min(92vw,64rem)] -translate-x-1/2 -translate-y-1/2 flex-row rounded-frame animate-nook-expand data-[ending-style]:animate-nook-collapse",
          )}
        >
          {displayBook && (
            <>
              {isCompact && (
                <div
                  aria-hidden="true"
                  onPointerDown={startSheetDrag}
                  className="flex w-full shrink-0 touch-none justify-center py-3 active:cursor-grabbing"
                >
                  <span className="h-1.5 w-10 rounded-full bg-line-strong/50" />
                </div>
              )}

              <Dialog.Close
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-control bg-surface/80 text-text-subdued backdrop-blur transition-colors duration-150 ease-gallery-standard hover:bg-surface hover:text-text active:bg-surface active:text-text"
              >
                <X size={18} weight="light" />
              </Dialog.Close>

              <div
                data-testid="book-cover-tilt-zone"
                className={cn(
                  "flex shrink-0 touch-none items-center justify-center bg-surface-sunken [perspective:1200px]",
                  isCompact ? "w-full p-4" : "w-2/5 p-10",
                )}
                onPointerDown={startSheetDrag}
                onPointerMove={handleCoverPointerMove}
                onPointerLeave={handleCoverPointerLeave}
              >
                <motion.div
                  className={cn("aspect-[2/3] w-full", isCompact ? "max-w-[150px]" : "max-w-[280px]")}
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
        </MotionDialogPopup>
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
    <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
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
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-text-subdued transition-colors duration-150 ease-gallery-standard hover:text-gold-ink active:text-gold-ink"
        >
          <BookOpenText size={16} weight="light" />
          {showExcerpt ? "Hide" : "About this book"}
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
      <Select.Trigger className="inline-flex items-center gap-3 rounded-control border border-line bg-surface px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-text transition-colors duration-150 ease-gallery-standard hover:border-gold active:border-gold data-[popup-open]:border-gold">
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
