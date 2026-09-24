"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowsInSimple,
  ArrowsOutSimple,
  CaretLeft,
  CaretRight,
  Minus,
  Plus,
} from "@phosphor-icons/react";

type SaveState = "saving" | "saved" | "error";
type LoadState = "loading" | "ready" | "error";
type ViewMode = "width" | "page" | "actual" | "custom";
type ViewportSize = { width: number; height: number };
type PageSize = { width: number; height: number };
type CachedPage = { url?: string; promise?: Promise<string> };
type DisplayedPage = { page: number; retryVersion: number; url: string };

const MIN_ZOOM = 50;
const MAX_ZOOM = 300;
const ZOOM_STEP = 10;
const ZOOM_PRESETS = [50, 75, 100, 125, 150, 200, 250, 300] as const;
const PREFERENCES_KEY = "adeseun-reader-preferences-v1";
const DEFAULT_PAGE_SIZE: PageSize = { width: 1200, height: 1800 };

const iconButtonClass =
  "flex h-11 min-w-11 shrink-0 items-center justify-center rounded-control border border-transparent text-text-subdued transition-[background-color,border-color,color,opacity] duration-150 ease-gallery-standard hover:border-line hover:bg-surface hover:text-emerald-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald disabled:cursor-not-allowed disabled:opacity-35";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isViewMode(value: unknown): value is ViewMode {
  return value === "width" || value === "page" || value === "actual" || value === "custom";
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement &&
    (target.isContentEditable || Boolean(target.closest("input, button, a, textarea, select")));
}

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
  const shellRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLElement>(null);
  const pageCacheRef = useRef<Map<number, CachedPage>>(new Map());
  const [page, setPage] = useState(initialPage);
  const [draftPage, setDraftPage] = useState(initialPage);
  const [viewMode, setViewMode] = useState<ViewMode>("width");
  const [zoom, setZoom] = useState(100);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>({ width: 1024, height: 640 });
  const [pageSize, setPageSize] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("This page could not be loaded.");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [retryVersion, setRetryVersion] = useState(0);
  const [pageSource, setPageSource] = useState<DisplayedPage | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  const naturalRatio = pageSize.width / pageSize.height;
  const horizontalGutter = viewport.width >= 768 ? 40 : 16;
  const verticalGutter = viewport.width >= 768 ? 32 : 16;
  const availableWidth = Math.max(260, viewport.width - horizontalGutter * 2);
  const availableHeight = Math.max(280, viewport.height - verticalGutter * 2);
  const fitWidth = Math.min(availableWidth, pageSize.width);
  const fitPage = Math.min(availableWidth, availableHeight * naturalRatio, pageSize.width);

  const pageWidth = useMemo(() => {
    if (viewMode === "page") return fitPage;
    if (viewMode === "actual") return pageSize.width;
    if (viewMode === "custom") return fitWidth * (zoom / 100);
    return fitWidth;
  }, [fitPage, fitWidth, pageSize.width, viewMode, zoom]);
  const pageHeight = pageWidth / naturalRatio;
  const equivalentZoom = clamp(
    Math.round((pageWidth / Math.max(1, fitWidth)) * 100),
    MIN_ZOOM,
    MAX_ZOOM,
  );
  const zoomLabel =
    viewMode === "width"
      ? "Fit width"
      : viewMode === "page"
        ? "Fit page"
        : viewMode === "actual"
          ? "Actual size"
          : `${zoom}%`;
  const toolbarZoomLabel = `${viewMode === "custom" ? zoom : equivalentZoom}%`;
  const viewSelectorValue = viewMode === "custom" ? `zoom:${zoom}` : viewMode;

  const progressPercent = pageCount <= 1 ? 100 : ((draftPage - 1) / (pageCount - 1)) * 100;
  const progressStyle = { "--reader-progress": `${progressPercent}%` } as CSSProperties;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.localStorage.getItem(PREFERENCES_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as { viewMode?: unknown; zoom?: unknown };
          if (isViewMode(saved.viewMode)) setViewMode(saved.viewMode);
          if (typeof saved.zoom === "number") setZoom(clamp(saved.zoom, MIN_ZOOM, MAX_ZOOM));
        }
      } catch {
        // A blocked storage API should never stop someone from reading.
      } finally {
        setPreferencesReady(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ viewMode, zoom }));
    } catch {
      // Preferences remain session-only when storage is unavailable.
    }
  }, [preferencesReady, viewMode, zoom]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const updateSize = () => setViewport({ width: scroller.clientWidth, height: scroller.clientHeight });
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(scroller);
    return () => observer.disconnect();
  }, [focusMode]);

  const getPageUrl = useCallback(
    async (targetPage: number, force = false): Promise<string> => {
      const cache = pageCacheRef.current;
      const existing = cache.get(targetPage);

      if (!force && existing?.url) return existing.url;
      if (!force && existing?.promise) return existing.promise;
      if (force && existing?.url) URL.revokeObjectURL(existing.url);
      if (force) cache.delete(targetPage);

      const request = fetch(
        `/api/reader/books/${encodeURIComponent(bookId)}/pages/${targetPage}${force ? `?retry=${Date.now()}` : ""}`,
        { credentials: "same-origin", cache: "no-store" },
      )
        .then(async (response) => {
          if (!response.ok) {
            const detail = (await response.json().catch(() => null)) as { error?: string } | null;
            throw new Error(detail?.error || "This page could not be loaded.");
          }
          const url = URL.createObjectURL(await response.blob());
          cache.set(targetPage, { url });
          return url;
        })
        .catch((error) => {
          if (cache.get(targetPage)?.promise === request) cache.delete(targetPage);
          throw error;
        });

      cache.set(targetPage, { promise: request });
      return request;
    },
    [bookId],
  );

  useEffect(() => {
    let active = true;

    getPageUrl(page, retryVersion > 0)
      .then((url) => {
        if (active) setPageSource({ page, retryVersion, url });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : "This page could not be loaded.");
        setLoadState("error");
      });

    return () => {
      active = false;
    };
  }, [getPageUrl, page, retryVersion]);

  useEffect(() => {
    if (loadState !== "ready") return;

    const neighbors = [page + 1, page - 1].filter((candidate) => candidate >= 1 && candidate <= pageCount);
    neighbors.forEach((candidate) => {
      void getPageUrl(candidate)
        .then((url) => {
          const image = new Image();
          image.src = url;
          void image.decode().catch(() => undefined);
        })
        .catch(() => undefined);
    });

    for (const [cachedPage, entry] of pageCacheRef.current) {
      if (Math.abs(cachedPage - page) <= 2) continue;
      if (entry.url) URL.revokeObjectURL(entry.url);
      pageCacheRef.current.delete(cachedPage);
    }
  }, [getPageUrl, loadState, page, pageCount]);

  useEffect(() => {
    const cache = pageCacheRef.current;
    return () => {
      for (const entry of cache.values()) {
        if (entry.url) URL.revokeObjectURL(entry.url);
      }
      cache.clear();
    };
  }, []);

  const goToPage = useCallback(
    (next: number) => {
      if (!Number.isFinite(next)) return;
      const target = Math.max(1, Math.min(pageCount, Math.floor(next)));
      setDraftPage(target);
      if (page === target) return;
      setRetryVersion(0);
      setLoadState("loading");
      setSaveState("saving");
      setPage(target);

      window.requestAnimationFrame(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        scroller.scrollTo({ top: 0, left: Math.max(0, (scroller.scrollWidth - scroller.clientWidth) / 2) });
      });
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
    }, 400);
    return () => window.clearTimeout(timer);
  }, [bookId, page]);

  const updateView = useCallback((change: () => void) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      change();
      return;
    }

    const centerX = (scroller.scrollLeft + scroller.clientWidth / 2) / Math.max(1, scroller.scrollWidth);
    const centerY = (scroller.scrollTop + scroller.clientHeight / 2) / Math.max(1, scroller.scrollHeight);
    change();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scroller.scrollTo({
          left: centerX * scroller.scrollWidth - scroller.clientWidth / 2,
          top: centerY * scroller.scrollHeight - scroller.clientHeight / 2,
        });
      });
    });
  }, []);

  const chooseViewMode = useCallback(
    (nextMode: ViewMode) => {
      updateView(() => {
        if (nextMode === "custom" && viewMode !== "custom") setZoom(equivalentZoom);
        setViewMode(nextMode);
      });
    },
    [equivalentZoom, updateView, viewMode],
  );

  const changeZoom = useCallback(
    (direction: -1 | 1) => {
      const current = viewMode === "custom" ? zoom : equivalentZoom;
      const next = clamp(current + direction * ZOOM_STEP, MIN_ZOOM, MAX_ZOOM);
      updateView(() => {
        setZoom(next);
        setViewMode("custom");
      });
    },
    [equivalentZoom, updateView, viewMode, zoom],
  );

  const leaveFocusMode = useCallback(async () => {
    setFocusMode(false);
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
  }, []);

  const enterFocusMode = useCallback(async () => {
    setFocusMode(true);
    if (!document.fullscreenElement && shellRef.current?.requestFullscreen) {
      await shellRef.current.requestFullscreen().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setFocusMode(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isInteractiveTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goToPage(page - 1);
      } else if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goToPage(page + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToPage(1);
      } else if (event.key === "End") {
        event.preventDefault();
        goToPage(pageCount);
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        changeZoom(1);
      } else if (event.key === "-") {
        event.preventDefault();
        changeZoom(-1);
      } else if (event.key === "0") {
        event.preventDefault();
        chooseViewMode("width");
      } else if (event.key === "Escape" && focusMode) {
        event.preventDefault();
        void leaveFocusMode();
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        if (focusMode) void leaveFocusMode();
        else void enterFocusMode();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeZoom, chooseViewMode, enterFocusMode, focusMode, goToPage, leaveFocusMode, page, pageCount]);

  function jumpToPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    goToPage(Number(form.get("page")));
  }

  const stageWidth = Math.max(viewport.width, pageWidth + horizontalGutter * 2);
  const stageHeight = Math.max(viewport.height, pageHeight + verticalGutter * 2);
  const currentPageSource =
    pageSource?.page === page && pageSource.retryVersion === retryVersion ? pageSource.url : null;

  return (
    <section
      ref={shellRef}
      className="reader-shell fixed inset-0 z-[80] grid min-h-[100dvh] overflow-hidden bg-surface-sunken text-text"
      style={{ gridTemplateRows: focusMode ? "1fr" : "auto minmax(0, 1fr) auto" }}
    >
      {!focusMode && (
        <header className="flex min-h-16 flex-wrap items-center gap-2 border-b border-line bg-surface/95 px-3 py-2 shadow-glow-soft sm:flex-nowrap sm:gap-4 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Link href="/read" aria-label="Back to my e-books" className={iconButtonClass} title="Back to my e-books">
              <ArrowLeft size={19} weight="regular" />
            </Link>
            <div className="hidden min-w-0 min-[480px]:block">
              <h1 className="truncate font-display text-base font-semibold text-text sm:text-lg">{title}</h1>
              <p className="font-mono text-[0.65rem] text-text-faint">Page {page} of {pageCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-control border border-line bg-surface-elevated p-1 shadow-elevation-card">
            <label htmlFor="reader-view-mode" className="sr-only">Page display mode</label>
            <select
              id="reader-view-mode"
              value={viewSelectorValue}
              onChange={(event) => {
                const value = event.target.value;
                if (value.startsWith("zoom:")) {
                  const nextZoom = clamp(Number(value.slice(5)), MIN_ZOOM, MAX_ZOOM);
                  updateView(() => {
                    setZoom(nextZoom);
                    setViewMode("custom");
                  });
                  return;
                }
                chooseViewMode(value as ViewMode);
              }}
              className="h-9 max-w-28 rounded-control bg-transparent px-2 font-mono text-[0.65rem] text-text outline-none focus-visible:ring-2 focus-visible:ring-emerald sm:max-w-none"
            >
              <optgroup label="Page display">
                <option value="width">Fit width</option>
                <option value="page">Fit page</option>
                <option value="actual">Actual size</option>
              </optgroup>
              <optgroup label="Zoom">
                {viewMode === "custom" && !ZOOM_PRESETS.includes(zoom as (typeof ZOOM_PRESETS)[number]) && (
                  <option value={`zoom:${zoom}`}>{zoom}%</option>
                )}
                {ZOOM_PRESETS.map((preset) => (
                  <option key={preset} value={`zoom:${preset}`}>{preset}%</option>
                ))}
              </optgroup>
            </select>
            <span className="h-6 w-px bg-line" aria-hidden="true" />
            <button type="button" aria-label="Zoom out" title="Zoom out (-)" disabled={equivalentZoom <= MIN_ZOOM} onClick={() => changeZoom(-1)} className={iconButtonClass}>
              <Minus size={17} />
            </button>
            <span aria-live="polite" className="hidden min-w-16 text-center font-mono text-[0.65rem] text-text-faint sm:block">{toolbarZoomLabel}</span>
            <button type="button" aria-label="Zoom in" title="Zoom in (+)" disabled={equivalentZoom >= MAX_ZOOM} onClick={() => changeZoom(1)} className={iconButtonClass}>
              <Plus size={17} />
            </button>
          </div>

          <button type="button" onClick={() => void enterFocusMode()} className={`${iconButtonClass} gap-2 px-3`} title="Enter focus mode (F)">
            <ArrowsOutSimple size={18} />
            <span className="hidden font-mono text-xs lg:inline">Focus</span>
          </button>
        </header>
      )}

      <main
        ref={scrollerRef}
        id="reader-page"
        data-lenis-prevent
        aria-label={`${title} reader`}
        aria-busy={loadState === "loading"}
        className="relative overflow-auto overscroll-contain [background:radial-gradient(circle_at_50%_10%,var(--color-surface)_0%,var(--color-surface-sunken)_72%)]"
        onContextMenu={(event) => event.preventDefault()}
      >
        <div className="grid place-items-center" style={{ width: stageWidth, minHeight: stageHeight }}>
          <div className="relative overflow-hidden rounded-frame bg-surface shadow-elevation-modal" style={{ width: pageWidth, aspectRatio: `${pageSize.width} / ${pageSize.height}` }}>
            {loadState === "loading" && (
              <div aria-label="Loading page" className="absolute inset-0 motion-safe:animate-pulse bg-[linear-gradient(110deg,var(--color-surface)_20%,var(--color-surface-elevated)_45%,var(--color-surface)_70%)] bg-[length:200%_100%]" />
            )}

            {loadState === "error" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface px-6 text-center">
                <p className="font-display text-2xl font-semibold text-text">This page did not load.</p>
                <p className="mt-2 max-w-sm font-body text-sm text-text-subdued">{loadError}</p>
                <button
                  type="button"
                  onClick={() => {
                    setLoadState("loading");
                    setRetryVersion((value) => value + 1);
                  }}
                  className="mt-5 min-h-11 rounded-control bg-emerald-fill px-5 py-3 font-mono text-xs text-text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                >
                  Try again
                </button>
              </div>
            ) : currentPageSource ? (
              // A native image is required here. Next's optimizer makes a
              // separate server request without the reader session cookie.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${page}-${retryVersion}`}
                src={currentPageSource}
                alt={`Page ${page} of ${title}`}
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                onLoad={(event) => {
                  const image = event.currentTarget;
                  if (image.naturalWidth > 0 && image.naturalHeight > 0) setPageSize({ width: image.naturalWidth, height: image.naturalHeight });
                  setLoadState("ready");
                }}
                onError={() => {
                  setLoadError("The protected page image could not be displayed.");
                  setLoadState("error");
                }}
                className={`absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-150 ease-gallery-out ${loadState === "ready" ? "opacity-100" : "opacity-0"}`}
              />
            ) : null}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {loadState === "loading" ? `Loading page ${page}` : loadState === "error" ? `Page ${page} failed to load` : `Page ${page} of ${pageCount} ready`}
        </p>
      </main>

      {!focusMode && (
        <footer className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-line bg-surface/95 px-3 py-2 sm:gap-5 sm:px-5">
          <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => goToPage(page - 1)} className={`${iconButtonClass} gap-2 px-3 font-mono text-xs`}>
            <CaretLeft size={18} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex min-w-0 items-center justify-center gap-3">
            <label htmlFor="reader-progress" className="sr-only">Reading progress</label>
            <input
              id="reader-progress"
              type="range"
              min={1}
              max={pageCount}
              value={draftPage}
              onChange={(event) => setDraftPage(Number(event.target.value))}
              onPointerUp={(event) => goToPage(Number(event.currentTarget.value))}
              onKeyUp={(event) => goToPage(Number(event.currentTarget.value))}
              onBlur={(event) => goToPage(Number(event.currentTarget.value))}
              className="reader-range min-w-20 flex-1 sm:max-w-md"
              style={progressStyle}
            />
            <span className="w-12 shrink-0 text-center font-mono text-[0.6rem] text-text-faint md:hidden">{page}/{pageCount}</span>
            <form onSubmit={jumpToPage} className="hidden items-center gap-1 md:flex">
              <label htmlFor="reader-page-number" className="sr-only">Go to page</label>
              <input
                id="reader-page-number"
                name="page"
                type="number"
                min={1}
                max={pageCount}
                defaultValue={page}
                key={page}
                className="field-underline w-14 border-b border-line bg-transparent py-1 text-center font-mono text-xs text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              />
              <button type="submit" className="min-h-11 rounded-control px-2 font-mono text-[0.65rem] text-text-subdued underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald">Go</button>
            </form>
            <span aria-live="polite" className="hidden w-12 text-right font-mono text-[0.6rem] text-text-faint lg:block">
              {saveState === "saving" ? "Saving" : saveState === "error" ? "Offline" : "Saved"}
            </span>
          </div>

          <button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => goToPage(page + 1)} className={`${iconButtonClass} gap-2 px-3 font-mono text-xs`}>
            <span className="hidden sm:inline">Next</span>
            <CaretRight size={18} />
          </button>
        </footer>
      )}

      {focusMode && (
        <>
          <button type="button" onClick={() => void leaveFocusMode()} className={`${iconButtonClass} fixed left-3 top-3 z-20 gap-2 border-line bg-surface/95 px-3 shadow-elevation-card sm:left-5 sm:top-5`} title="Exit focus mode (F or Esc)">
            <ArrowsInSimple size={18} />
            <span className="hidden font-mono text-xs sm:inline">Exit focus</span>
          </button>

          <div className="fixed right-3 top-3 z-20 flex items-center rounded-control border border-line bg-surface/95 p-1 shadow-elevation-card sm:right-5 sm:top-5">
            <button type="button" aria-label="Zoom out" disabled={equivalentZoom <= MIN_ZOOM} onClick={() => changeZoom(-1)} className={iconButtonClass}><Minus size={17} /></button>
            <span className="min-w-14 text-center font-mono text-[0.65rem] text-text-faint">{zoomLabel}</span>
            <button type="button" aria-label="Zoom in" disabled={equivalentZoom >= MAX_ZOOM} onClick={() => changeZoom(1)} className={iconButtonClass}><Plus size={17} /></button>
          </div>

          <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => goToPage(page - 1)} className={`${iconButtonClass} fixed left-3 top-1/2 z-20 -translate-y-1/2 border-line bg-surface/95 shadow-elevation-card sm:left-5`}><CaretLeft size={20} /></button>
          <button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => goToPage(page + 1)} className={`${iconButtonClass} fixed right-3 top-1/2 z-20 -translate-y-1/2 border-line bg-surface/95 shadow-elevation-card sm:right-5`}><CaretRight size={20} /></button>

          <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-control border border-line bg-surface/95 px-4 py-2 font-mono text-[0.65rem] text-text-subdued shadow-elevation-card">{page} / {pageCount}</div>
        </>
      )}
    </section>
  );
}
