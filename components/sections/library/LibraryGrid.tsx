"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORIES, type Category, type Book } from "./library-content";
import { BookCard } from "./BookCard";
import { FilterBar } from "./FilterBar";
import { BookModal } from "./BookModal";
import { ease } from "@/lib/design-tokens";
import type { EbookCatalogItem } from "@/lib/ebook-types";

/**
 * Grid re-filtering uses AnimatePresence + `layout` (per the brief) —
 * items leaving fade/scale out, survivors reflow via Motion's layout
 * animation, new items fade/scale in. `mode="popLayout"` lets exiting
 * items animate out of flow instead of holding the grid's height open.
 */
export function LibraryGrid({
  books,
  ebookCatalog,
}: {
  books: Book[];
  ebookCatalog: Record<string, EbookCatalogItem>;
}) {
  const [category, setCategory] = useState<Category | "All">("All");
  const [selected, setSelected] = useState<Book | null>(null);

  const visible = useMemo(
    () => (category === "All" ? books : books.filter((book) => book.category === category)),
    [books, category],
  );
  const categories = useMemo(
    () => CATEGORIES.filter((candidate) => books.some((book) => book.category === candidate)),
    [books],
  );

  // The first four books are deliberately treated as a display shelf rather
  // than another catalog row. Architectural Soul is a landscape-format
  // physical book, so its cell is wider; the rest of the catalog keeps the
  // original, narrower four-column measure below it.
  const hasOpeningShelf = category === "All" && visible.length >= 4;
  const openingShelf = hasOpeningShelf ? visible.slice(0, 4) : [];
  const catalog = hasOpeningShelf ? visible.slice(4) : visible;

  const card = (book: Book, index: number, priorityOffset = 0) => (
    <motion.div
      key={book.id}
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: ease.out }}
      className={
        book.coverAspect === "landscape"
          ? "col-span-2 self-center sm:col-span-1"
          : undefined
      }
    >
      <BookCard book={book} priority={index + priorityOffset < 4} onSelect={setSelected} />
    </motion.div>
  );

  return (
    <>
      <FilterBar active={category} categories={categories} onChange={setCategory} />

      {hasOpeningShelf && (
        <motion.div
          layout
          transition={{ layout: { duration: 0.4, ease: ease.inOut } }}
          className="mx-auto mt-10 grid w-full grid-cols-2 items-center gap-x-8 gap-y-12 sm:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.45fr)]"
        >
          <AnimatePresence mode="popLayout">
            {openingShelf.map((book, index) => card(book, index))}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div
        layout
        transition={{ layout: { duration: 0.4, ease: ease.inOut } }}
        className={
          hasOpeningShelf
            ? "mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4"
            : "mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4"
        }
      >
        <AnimatePresence mode="popLayout">
          {catalog.map((book, index) => card(book, index, openingShelf.length))}
        </AnimatePresence>
      </motion.div>

      <BookModal
        book={selected}
        ebook={selected ? ebookCatalog[selected.id] ?? null : null}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
