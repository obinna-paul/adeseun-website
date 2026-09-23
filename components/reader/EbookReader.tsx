"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, CaretLeft, CaretRight, Minus, Plus } from "@phosphor-icons/react";

type SaveState = "saving" | "saved" | "error";
type LoadState = "loading" | "ready" | "error";

export function EbookReader({
  bookId,
  title,
  pageCount,
  initialPage,
}: {
  bookId: string;
  title: string;
  pageCount: number;
  initialPage: number;
}) {
  const [page, setPage] = useState(initialPage);
  const [zoom, setZoom] = useState(100);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [saveState, setSaveState] = useState<SaveState>("saving");
  const [imageVersion, setImageVersion] = useState(0);

  const goToPage = useCallback(
    (next: number) => {
      const target = Math.max(1, Math.min(pageCount, Math.floor(next)));
      if (page === target) return;
      setLoadState("loading");
      setSaveState("saving");
      setPage(target);
    },
    [page, pageCount],
  );

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/reader/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId, page }),
        });
        setSaveState(response.ok ? "saved" : "error");
      } catch {
        setSaveState("error");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [bookId, page]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, button, a, textarea, select")) return;
      if (event.key === "ArrowLeft" || event.key === "PageUp") goToPage(page - 1);
      if (event.key === "ArrowRight" || event.key === "PageDown") goToPage(page + 1);
      if (event.key === "Home") goToPage(1);
      if (event.key === "End") goToPage(pageCount);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPage, page, pageCount]);

  function jumpToPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    goToPage(Number(form.get("page")));
  }

  return (
    <section className="reader-shell fixed inset-0 z-[80] grid min-h-[100dvh] grid-rows-[auto_1fr_auto] overflow-hidden bg-surface-sunken text-text">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line bg-surface/95 px-3 py-2 shadow-glow-soft sm:px-5">
        <Link
          href="/read"
          aria-label="Back to my e-books"
          className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-control text-text-subdued transition-colors duration-150 ease-gallery-standard hover:text-emerald-ink sm:px-3"
        >
          <ArrowLeft size={19} weight="regular" />
          <span className="hidden font-mono text-xs sm:inline">My e-books</span>
        </Link>

        <div className="min-w-0 text-center">
          <h1 className="truncate font-display text-base font-semibold text-text sm:text-lg">{title}</h1>
          <p className="font-mono text-[0.65rem] text-text-faint">
            Page {page} of {pageCount}
          </p>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoom <= 80}
            onClick={() => setZoom((value) => Math.max(80, value - 20))}
            className="flex h-11 w-11 items-center justify-center rounded-control text-text-subdued transition-colors duration-150 ease-gallery-standard hover:bg-emerald-tint hover:text-emerald-ink disabled:opacity-35"
          >
            <Minus size={18} />
          </button>
          <span className="hidden w-12 text-center font-mono text-[0.65rem] text-text-faint sm:block">{zoom}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoom >= 160}
            onClick={() => setZoom((value) => Math.min(160, value + 20))}
            className="flex h-11 w-11 items-center justify-center rounded-control text-text-subdued transition-colors duration-150 ease-gallery-standard hover:bg-emerald-tint hover:text-emerald-ink disabled:opacity-35"
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

      <main
        id="reader-page"
        data-lenis-prevent
        className="overflow-auto overscroll-contain px-3 py-5 sm:px-8 sm:py-8"
        onContextMenu={(event) => event.preventDefault()}
      >
        <div
          className="relative mx-auto transition-[width] duration-200 ease-gallery-out"
          style={{ width: `${zoom}%`, maxWidth: `${54 * (zoom / 100)}rem` }}
        >
          {loadState === "loading" && (
            <div
              aria-label="Loading page"
              className="absolute inset-0 animate-pulse rounded-frame bg-surface shadow-elevation-card"
            />
          )}
          {loadState === "error" ? (
            <div className="flex aspect-[2/3] flex-col items-center justify-center rounded-frame bg-surface px-6 text-center shadow-elevation-card">
              <p className="font-display text-2xl font-semibold text-text">This page did not load.</p>
              <button
                type="button"
                onClick={() => {
                  setLoadState("loading");
                  setImageVersion((value) => value + 1);
                }}
                className="mt-5 rounded-control bg-emerald-fill px-5 py-3 font-mono text-xs text-text-on-dark"
              >
                Try again
              </button>
            </div>
          ) : (
            // A native image is required here: Next's image optimizer makes
            // a separate server request without the reader's session cookie.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${page}-${imageVersion}`}
              src={`/api/reader/books/${bookId}/pages/${page}?v=${imageVersion}`}
              alt={`Page ${page} of ${title}`}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onLoad={() => setLoadState("ready")}
              onError={() => setLoadState("error")}
              className={`h-auto w-full select-none rounded-frame bg-surface shadow-elevation-card transition-opacity duration-150 ease-gallery-out ${
                loadState === "ready" ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>
      </main>

      <footer className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-line bg-surface/95 px-3 py-2 sm:gap-5 sm:px-5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="flex h-11 items-center gap-2 rounded-control px-3 font-mono text-xs text-text-subdued transition-colors duration-150 ease-gallery-standard hover:bg-emerald-tint hover:text-emerald-ink disabled:opacity-35"
        >
          <CaretLeft size={18} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex min-w-0 items-center justify-center gap-3">
          <label htmlFor="reader-progress" className="sr-only">
            Reading progress
          </label>
          <input
            id="reader-progress"
            type="range"
            min={1}
            max={pageCount}
            value={page}
            onChange={(event) => goToPage(Number(event.target.value))}
            className="reader-range min-w-0 flex-1 sm:max-w-md"
          />
          <form onSubmit={jumpToPage} className="hidden items-center gap-1 sm:flex">
            <label htmlFor="reader-page-number" className="sr-only">
              Go to page
            </label>
            <input
              id="reader-page-number"
              name="page"
              type="number"
              min={1}
              max={pageCount}
              defaultValue={page}
              key={page}
              className="field-underline w-14 border-b border-line bg-transparent py-1 text-center font-mono text-xs text-text"
            />
            <button type="submit" className="font-mono text-[0.65rem] text-text-subdued underline underline-offset-4">
              Go
            </button>
          </form>
          <span aria-live="polite" className="hidden w-12 text-right font-mono text-[0.6rem] text-text-faint lg:block">
            {saveState === "saving" ? "Saving" : saveState === "error" ? "Offline" : "Saved"}
          </span>
        </div>

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => goToPage(page + 1)}
          className="flex h-11 items-center gap-2 rounded-control px-3 font-mono text-xs text-text-subdued transition-colors duration-150 ease-gallery-standard hover:bg-emerald-tint hover:text-emerald-ink disabled:opacity-35"
        >
          <span className="hidden sm:inline">Next</span>
          <CaretRight size={18} />
        </button>
      </footer>
    </section>
  );
}
