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

  return (
    <>
      <FilterBar active={category} categories={categories} onChange={setCategory} />

      <motion.div
        layout
        transition={{ layout: { duration: 0.4, ease: ease.inOut } }}
        className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((book, index) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: ease.out }}
            >
              <BookCard book={book} priority={index < 4} onSelect={setSelected} />
            </motion.div>
          ))}
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
