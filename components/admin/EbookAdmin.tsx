"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CloudArrowUp, PencilSimple, Plus, SignOut } from "@phosphor-icons/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { EbookPublication } from "@/lib/ebook-types";
import { formatNaira } from "@/lib/utils";

type AdminBook = { id: string; title: string; standalone: boolean };
type UploadSession = { bookId: string; uploadId: string; key: string };
type ActionState = "idle" | "saving" | "uploading" | "success" | "error";

function publicationTitle(book: AdminBook | undefined, publication: EbookPublication | null | undefined) {
  return publication?.title?.trim() || book?.title || "Untitled e-book";
}

function initialActiveBookId(books: AdminBook[], publications: Record<string, EbookPublication | null>) {
  const candidates = books
    .map((book) => publications[book.id])
    .filter((publication): publication is EbookPublication =>
      Boolean(publication && (publication.status === "processing" || publication.status === "failed")),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return candidates[0]?.bookId ?? null;
}

function ProcessingProgress({
  bookTitle,
  publication,
  featured = false,
  announce = true,
}: {
  bookTitle: string;
  publication: EbookPublication;
  featured?: boolean;
  announce?: boolean;
}) {
  const processingProgress = Math.min(100, Math.max(0, publication.processingProgress ?? 0));

  return (
    <div
      className={featured ? "mt-6 rounded-frame border border-line bg-surface px-5 py-4" : "mt-4"}
      aria-live={announce ? "polite" : "off"}
      aria-atomic="true"
    >
      {featured && (
        <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-emerald-ink">
          Processing {bookTitle}
        </p>
      )}
      <div className="flex items-baseline justify-between gap-4 text-xs">
        <p className="font-medium text-text">{publication.processingStage ?? "Waiting for processor"}</p>
        <p className="shrink-0 font-mono text-text-subdued">{processingProgress}%</p>
      </div>
      <div
        role="progressbar"
        aria-label={`${bookTitle} processing progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={processingProgress}
        className="mt-2 h-1.5 overflow-hidden rounded-control bg-line-whisper"
      >
        <div
          className="h-full bg-emerald-fill transition-[width] duration-500 ease-gallery-out motion-reduce:transition-none"
          style={{ width: `${processingProgress}%` }}
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[0.65rem] text-text-subdued">
        <span>
          {publication.pageCount
            ? `${publication.processedPages ?? 0} of ${publication.pageCount} pages`
            : "Preparing the page count…"}
        </span>
        <span>Updates automatically</span>
      </div>
    </div>
  );
}

async function uploadAction<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch("/api/admin/ebooks/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The publishing action failed.");
  return data;
}

export function EbookAdminLogin() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/ebooks/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: form.get("secret") }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not sign in.");
      window.location.reload();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-md">
      <label htmlFor="publishing-key" className="font-display text-lg font-semibold text-text">
        Publishing key
      </label>
      <input
        id="publishing-key"
        name="secret"
        type="password"
        required
        autoComplete="current-password"
        className="mt-3 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
      />
      <div className="mt-6">
        <MagneticButton type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Opening publisher…" : "Open publisher"}
        </MagneticButton>
      </div>
      {message && (
        <p role="alert" className="mt-4 text-sm text-garnet">
          {message}
        </p>
      )}
    </form>
  );
}

export function EbookAdminDashboard({
  books,
  publications,
}: {
  books: AdminBook[];
  publications: Record<string, EbookPublication | null>;
}) {
  const initialBookId = initialActiveBookId(books, publications) ?? books[0]?.id ?? "";
  const initialBook = books.find((book) => book.id === initialBookId);
  const initialPublication = publications[initialBookId];
  const editorRef = useRef<HTMLDivElement>(null);

  const [livePublications, setLivePublications] = useState(publications);
  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [isNewStandalone, setIsNewStandalone] = useState(false);
  const [title, setTitle] = useState(() => publicationTitle(initialBook, initialPublication));
  const [description, setDescription] = useState(initialPublication?.description ?? "");
  const [price, setPrice] = useState(initialPublication ? String(initialPublication.priceNaira) : "");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ActionState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [activeBookId, setActiveBookId] = useState<string | null>(
    () => initialActiveBookId(books, publications),
  );

  const liveBooks = useMemo(() => {
    const result = new Map(books.map((book) => [book.id, { ...book }]));
    Object.values(livePublications).forEach((publication) => {
      if (!publication) return;
      const existing = result.get(publication.bookId);
      if (existing) {
        result.set(publication.bookId, {
          ...existing,
          title: publication.title?.trim() || existing.title,
          standalone: publication.standalone ?? existing.standalone,
        });
      } else if (publication.standalone) {
        result.set(publication.bookId, {
          id: publication.bookId,
          title: publication.title?.trim() || "Untitled e-book",
          standalone: true,
        });
      }
    });
    return Array.from(result.values());
  }, [books, livePublications]);

  const selectedPublication = selectedBookId ? livePublications[selectedBookId] : null;
  const activeBook = activeBookId ? liveBooks.find((book) => book.id === activeBookId) : undefined;
  const activePublication = activeBookId ? livePublications[activeBookId] : null;
  const busy = status === "uploading" || status === "saving";

  useEffect(() => {
    let stopped = false;

    async function refreshPublications() {
      try {
        const response = await fetch("/api/admin/ebooks/uploads", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as {
          publications?: Record<string, EbookPublication | null>;
        };
        if (!stopped && data.publications) setLivePublications(data.publications);
      } catch {
        // A later poll will retry transient network failures without interrupting the editor.
      }
    }

    void refreshPublications();
    const interval = window.setInterval(refreshPublications, 4_000);
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, []);

  function resetFile() {
    setFile(null);
    setFileInputKey((value) => value + 1);
  }

  function editBook(bookId: string, focusEditor = false) {
    const book = liveBooks.find((candidate) => candidate.id === bookId);
    const publication = livePublications[bookId];
    setSelectedBookId(bookId);
    setIsNewStandalone(false);
    setTitle(publicationTitle(book, publication));
    setDescription(publication?.description ?? "");
    setPrice(publication ? String(publication.priceNaira) : "");
    setStatus("idle");
    setMessage(null);
    resetFile();
    if (focusEditor) editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startNewEbook() {
    setSelectedBookId("");
    setIsNewStandalone(true);
    setTitle("");
    setDescription("");
    setPrice("");
    setStatus("idle");
    setMessage(null);
    resetFile();
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveDetails() {
    if (!selectedPublication || !selectedBookId) return;
    setStatus("saving");
    setMessage("Saving publication details…");
    try {
      const result = await uploadAction<{ message: string; publication: EbookPublication }>({
        action: "update",
        bookId: selectedBookId,
        title,
        description,
        priceNaira: Number(price),
      });
      setLivePublications((current) => ({ ...current, [selectedBookId]: result.publication }));
      setStatus("success");
      setMessage(result.message);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The publication could not be saved.");
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !title.trim() || !price || (!isNewStandalone && !selectedBookId)) return;

    const uploadTitle = title.trim();
    setStatus("uploading");
    setMessage("Preparing resumable upload…");
    setProgress(0);
    let session: UploadSession | null = null;

    try {
      const created = await uploadAction<{
        bookId: string;
        uploadId: string;
        key: string;
        publication: EbookPublication;
      }>({
        action: "create",
        bookId: isNewStandalone ? undefined : selectedBookId,
        standalone: isNewStandalone,
        title: uploadTitle,
        description,
        filename: file.name,
        size: file.size,
        contentType: file.type || "application/pdf",
        priceNaira: Number(price),
      });
      session = { bookId: created.bookId, uploadId: created.uploadId, key: created.key };
      setSelectedBookId(created.bookId);
      setIsNewStandalone(false);
      setActiveBookId(created.bookId);
      setLivePublications((current) => ({ ...current, [created.bookId]: created.publication }));

      const partSize = 10 * 1024 * 1024;
      const partCount = Math.ceil(file.size / partSize);
      const parts: Array<{ ETag: string; PartNumber: number }> = new Array(partCount);
      let nextIndex = 0;
      let uploadedBytes = 0;

      async function worker() {
        while (nextIndex < partCount) {
          const index = nextIndex;
          nextIndex += 1;
          const partNumber = index + 1;
          const start = index * partSize;
          const end = Math.min(file!.size, start + partSize);
          const signed = await uploadAction<{ url: string }>({
            action: "sign-part",
            ...session,
            partNumber,
          });
          const response = await fetch(signed.url, { method: "PUT", body: file!.slice(start, end) });
          if (!response.ok) throw new Error(`Upload part ${partNumber} failed with status ${response.status}.`);
          const etag = response.headers.get("ETag");
          if (!etag) throw new Error("Storage did not confirm the upload part. Check the bucket CORS policy.");
          parts[index] = { ETag: etag, PartNumber: partNumber };
          uploadedBytes += end - start;
          const percent = Math.round((uploadedBytes / file!.size) * 100);
          setProgress(percent);
          setMessage(`Uploading ${uploadTitle}: ${percent}%`);
        }
      }

      await Promise.all(Array.from({ length: Math.min(3, partCount) }, () => worker()));
      setMessage("Finalizing upload…");
      const completed = await uploadAction<{ message: string; publication: EbookPublication }>({
        action: "complete",
        ...session,
        parts,
      });
      setLivePublications((current) => ({ ...current, [created.bookId]: completed.publication }));
      setProgress(100);
      setStatus("success");
      setMessage(completed.message);
      resetFile();
    } catch (error) {
      if (session) await uploadAction({ action: "abort", ...session }).catch(() => undefined);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The upload failed.");
    }
  }

  async function processAgain(bookId: string) {
    setMessage("Starting the processor…");
    setActiveBookId(bookId);
    try {
      const result = await uploadAction<{ message: string; publication: EbookPublication }>({ action: "process", bookId });
      setLivePublications((current) => ({ ...current, [bookId]: result.publication }));
      setStatus("success");
      setMessage(result.message);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The processor could not start.");
    }
  }

  async function signOut() {
    await fetch("/api/admin/ebooks/auth", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:gap-16">
      <div ref={editorRef} className="scroll-mt-6 border-t border-line pt-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-text">
              {isNewStandalone ? "Publish a new e-book" : "Publication editor"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-subdued">
              {isNewStandalone
                ? "Create a digital-only title. Its first PDF page becomes the public cover when publishing finishes."
                : "Change the public title, description, price, or replace the PDF with a new edition."}
            </p>
          </div>
          <button
            type="button"
            onClick={startNewEbook}
            className="inline-flex min-h-11 items-center gap-2 rounded-control border border-emerald-line bg-emerald-tint px-4 py-2 font-mono text-xs text-emerald-ink transition-colors duration-150 ease-gallery-standard hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
          >
            <Plus size={16} /> New e-book
          </button>
        </div>

        <form onSubmit={publish} className="mt-7">
          {!isNewStandalone && (
            <label className="block">
              <span className="font-mono text-xs text-text-subdued">Choose a title to edit</span>
              <select
                value={selectedBookId}
                onChange={(event) => editBook(event.target.value)}
                className="mt-2 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              >
                {liveBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}{book.standalone ? " (e-book only)" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="font-mono text-xs text-text-subdued">Title</span>
              <input
                type="text"
                required
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-mono text-xs text-text-subdued">Short description</span>
              <textarea
                rows={4}
                maxLength={1200}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell readers what this book is about."
                className="mt-2 w-full resize-y rounded-frame border border-line bg-surface px-4 py-3 text-base text-text placeholder:text-text-subdued focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              />
            </label>
            <label className="block">
              <span className="font-mono text-xs text-text-subdued">E-book price (NGN)</span>
              <input
                type="number"
                min={1}
                max={100000000}
                step={1}
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="mt-2 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              />
            </label>
            <div className="flex items-end">
              {selectedPublication ? (
                <p className="pb-3 font-mono text-xs text-text-subdued">
                  Live price: {formatNaira(selectedPublication.priceNaira)}
                </p>
              ) : (
                <p className="pb-3 text-sm text-text-subdued">A price is required before upload.</p>
              )}
            </div>
          </div>

          <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-frame border border-dashed border-line-strong bg-surface px-6 py-8 text-center transition-colors duration-150 ease-gallery-standard hover:border-emerald hover:bg-emerald-tint">
            <CloudArrowUp size={30} weight="light" className="text-emerald-ink" />
            <span className="mt-3 font-display text-lg font-semibold text-text">
              {selectedPublication ? "Choose a replacement PDF" : "Choose the source PDF"}
            </span>
            <span className="mt-1 text-sm text-text-subdued">
              {selectedPublication
                ? "Leave this empty when you only want to save the details above."
                : "Large full-color files are supported up to 2 GB."}
            </span>
            <input
              key={fileInputKey}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file && <span className="mt-4 max-w-full break-all font-mono text-xs text-emerald-ink">{file.name}</span>}
          </label>

          {status === "uploading" && (
            <div className="mt-6" aria-label={`Upload ${progress}% complete`}>
              <div className="h-1 overflow-hidden rounded-control bg-line-whisper">
                <div
                  className="h-full bg-emerald-fill transition-[width] duration-150 ease-gallery-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {selectedPublication && (
              <button
                type="button"
                disabled={busy || !title.trim() || !price}
                onClick={() => void saveDetails()}
                className="min-h-11 rounded-control border border-line-strong bg-surface px-5 py-3 font-mono text-xs text-emerald-ink transition-colors duration-150 ease-gallery-standard hover:border-emerald-line hover:bg-emerald-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald disabled:cursor-not-allowed disabled:opacity-45"
              >
                {status === "saving" ? "Saving…" : "Save changes"}
              </button>
            )}
            <MagneticButton type="submit" disabled={!file || !title.trim() || !price || busy}>
              {status === "uploading"
                ? "Uploading…"
                : selectedPublication
                  ? "Upload new edition"
                  : isNewStandalone
                    ? "Create and publish"
                    : "Upload and process"}
            </MagneticButton>
          </div>

          <p
            aria-live="polite"
            className={`mt-4 max-w-xl text-sm leading-relaxed ${status === "error" ? "text-garnet" : "text-text-subdued"}`}
          >
            {message}
          </p>

          {activeBook && activePublication?.status === "processing" && (
            <ProcessingProgress bookTitle={publicationTitle(activeBook, activePublication)} publication={activePublication} featured />
          )}

          {activeBook && activePublication?.status === "published" && status === "success" && (
            <div className="mt-6 rounded-frame border border-emerald/25 bg-emerald-tint px-5 py-4" role="status">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-emerald-ink">Published · 100%</p>
              <p className="mt-1 text-sm text-text">{publicationTitle(activeBook, activePublication)} is ready to read online.</p>
            </div>
          )}

          {activeBook && activePublication?.status === "failed" && (
            <div className="mt-6 rounded-frame border border-garnet/25 bg-surface px-5 py-4" role="alert">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-garnet">Processing failed</p>
              <p className="mt-2 text-sm leading-relaxed text-text">
                {activePublication.error ?? `${publicationTitle(activeBook, activePublication)} could not be processed.`}
              </p>
              <button
                type="button"
                onClick={() => processAgain(activeBook.id)}
                className="mt-3 min-h-11 font-mono text-xs text-emerald-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
              >
                Resume processing
              </button>
            </div>
          )}
        </form>
      </div>

      <section className="border-t border-line pt-7" aria-labelledby="publication-status-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="publication-status-heading" className="font-display text-2xl font-semibold text-text">
            Publication status
          </h2>
          <button
            type="button"
            onClick={signOut}
            className="flex min-h-11 items-center gap-2 font-mono text-xs text-text-subdued underline decoration-line-strong underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
          >
            <SignOut size={15} /> Sign out
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-subdued">Select any title below to edit its details or replace its PDF.</p>

        <div className="mt-5 space-y-2">
          {liveBooks.map((book) => {
            const publication = livePublications[book.id];
            const current = !isNewStandalone && selectedBookId === book.id;
            return (
              <div
                key={book.id}
                className={`rounded-frame border p-4 transition-colors duration-150 ease-gallery-standard ${
                  current ? "border-emerald-line bg-emerald-tint" : "border-line-whisper bg-surface"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => editBook(book.id, true)}
                    className="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                    aria-label={`Edit ${publicationTitle(book, publication)}`}
                  >
                    <span className="block break-words font-display text-lg font-semibold leading-tight text-text">
                      {publicationTitle(book, publication)}
                    </span>
                    <span className="mt-1 block font-mono text-[0.65rem] text-text-subdued">
                      {publication ? publication.status : "not uploaded"}
                      {publication ? ` · ${formatNaira(publication.priceNaira)}` : ""}
                      {book.standalone ? " · e-book only" : ""}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => editBook(book.id, true)}
                    className="flex min-h-11 shrink-0 items-center gap-1.5 px-2 font-mono text-xs text-emerald-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                  >
                    <PencilSimple size={15} /> {publication ? "Edit" : "Set up"}
                  </button>
                </div>
                {(publication?.status === "failed" || publication?.status === "processing") && (
                  <button
                    type="button"
                    onClick={() => processAgain(book.id)}
                    className="mt-3 min-h-11 font-mono text-xs text-emerald-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
                  >
                    {publication.status === "processing" ? "Restart processing" : "Process again"}
                  </button>
                )}
                {publication?.status === "processing" && (
                  <ProcessingProgress
                    bookTitle={publicationTitle(book, publication)}
                    publication={publication}
                    announce={activeBookId !== book.id}
                  />
                )}
                {publication?.error && <p className="mt-2 text-xs leading-relaxed text-garnet">{publication.error}</p>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
