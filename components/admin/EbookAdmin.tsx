"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CloudArrowUp, SignOut } from "@phosphor-icons/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { EbookPublication } from "@/lib/ebook-types";
import { formatNaira } from "@/lib/utils";

type AdminBook = { id: string; title: string };
type UploadSession = { bookId: string; uploadId: string; key: string };

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
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[0.65rem] text-text-faint">
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
        className="mt-3 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text"
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
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [livePublications, setLivePublications] = useState(publications);
  const [activeBookId, setActiveBookId] = useState<string | null>(
    () => initialActiveBookId(books, publications),
  );

  const selectedTitle = useMemo(
    () => books.find((book) => book.id === selectedBookId)?.title ?? "this book",
    [books, selectedBookId],
  );
  const activeBook = activeBookId ? books.find((book) => book.id === activeBookId) : undefined;
  const activePublication = activeBookId ? livePublications[activeBookId] : null;

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
        // A later poll will retry transient network failures without interrupting the upload form.
      }
    }

    void refreshPublications();
    const interval = window.setInterval(refreshPublications, 4_000);
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, []);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || !selectedBookId) return;

    setStatus("uploading");
    setMessage("Preparing resumable upload…");
    setProgress(0);
    setActiveBookId(selectedBookId);
    let session: UploadSession | null = null;

    try {
      const created = await uploadAction<{ uploadId: string; key: string }>({
        action: "create",
        bookId: selectedBookId,
        filename: file.name,
        size: file.size,
        contentType: file.type || "application/pdf",
        priceNaira: Number(price),
      });
      session = { bookId: selectedBookId, uploadId: created.uploadId, key: created.key };

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
          if (!etag) throw new Error("R2 did not expose the ETag header. Check the bucket CORS policy.");
          parts[index] = { ETag: etag, PartNumber: partNumber };
          uploadedBytes += end - start;
          setProgress(Math.round((uploadedBytes / file!.size) * 100));
          setMessage(`Uploading ${selectedTitle}: ${Math.round((uploadedBytes / file!.size) * 100)}%`);
        }
      }

      await Promise.all(Array.from({ length: Math.min(3, partCount) }, () => worker()));
      setMessage("Finalizing upload…");
      const completed = await uploadAction<{ message: string; publication: EbookPublication }>({
        action: "complete",
        ...session,
        parts,
      });
      setLivePublications((current) => ({ ...current, [selectedBookId]: completed.publication }));
      setProgress(100);
      setStatus("success");
      setMessage(completed.message);
    } catch (error) {
      if (session) {
        await uploadAction({ action: "abort", ...session }).catch(() => undefined);
      }
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
    <>
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:gap-16">
        <form onSubmit={publish} className="border-t border-line pt-7">
          <h2 className="font-display text-2xl font-semibold text-text">Upload a source PDF</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-subdued">
            The file uploads directly to private storage in resumable 10 MB parts. Processing begins after every part is confirmed.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-xs text-text-subdued">Catalog book</span>
              <select
                value={selectedBookId}
                onChange={(event) => setSelectedBookId(event.target.value)}
                className="mt-2 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text"
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-xs text-text-subdued">E-book price (NGN)</span>
              <input
                type="number"
                min={1}
                step={1}
                required
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="mt-2 w-full rounded-frame border border-line bg-surface px-4 py-3 text-base text-text"
              />
            </label>
          </div>

          <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-frame border border-dashed border-line-strong bg-surface px-6 py-8 text-center transition-colors duration-150 ease-gallery-standard hover:border-emerald hover:bg-emerald-tint">
            <CloudArrowUp size={30} weight="light" className="text-emerald-ink" />
            <span className="mt-3 font-display text-lg font-semibold text-text">Choose the PDF for {selectedTitle}</span>
            <span className="mt-1 text-sm text-text-subdued">Large full-color files are supported up to 2 GB.</span>
            <input
              type="file"
              accept="application/pdf,.pdf"
              required
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
            {file && <span className="mt-4 font-mono text-xs text-emerald-ink">{file.name}</span>}
          </label>

          {status === "uploading" && (
            <div className="mt-6" aria-label={`Upload ${progress}% complete`}>
              <div className="h-1 overflow-hidden rounded-control bg-line-whisper">
                <div className="h-full bg-emerald-fill transition-[width] duration-150 ease-gallery-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <MagneticButton type="submit" disabled={!file || !price || status === "uploading"}>
              {status === "uploading" ? "Uploading…" : "Upload and process"}
            </MagneticButton>
            <p
              aria-live="polite"
              className={`max-w-md text-sm leading-relaxed ${status === "error" ? "text-garnet" : "text-text-subdued"}`}
            >
              {message}
            </p>
          </div>

          {activeBook && activePublication?.status === "processing" && (
            <ProcessingProgress bookTitle={activeBook.title} publication={activePublication} featured />
          )}

          {activeBook && activePublication?.status === "published" && status === "success" && (
            <div className="mt-6 rounded-frame border border-emerald/25 bg-emerald-tint px-5 py-4" role="status">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-emerald-ink">
                Published · 100%
              </p>
              <p className="mt-1 text-sm text-text">{activeBook.title} is ready to read online.</p>
            </div>
          )}

          {activeBook && activePublication?.status === "failed" && (
            <div className="mt-6 rounded-frame border border-garnet/25 bg-surface px-5 py-4" role="alert">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-garnet">Processing failed</p>
              <p className="mt-2 text-sm leading-relaxed text-text">
                {activePublication.error ?? `${activeBook.title} could not be processed.`}
              </p>
              <button
                type="button"
                onClick={() => processAgain(activeBook.id)}
                className="mt-3 font-mono text-xs text-emerald-ink underline underline-offset-4"
              >
                Resume processing
              </button>
            </div>
          )}
        </form>

        <section className="border-t border-line pt-7" aria-labelledby="publication-status-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="publication-status-heading" className="font-display text-2xl font-semibold text-text">
              Publication status
            </h2>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 font-mono text-xs text-text-subdued underline decoration-line-strong underline-offset-4"
            >
              <SignOut size={15} /> Sign out
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {books.map((book) => {
              const publication = livePublications[book.id];
              return (
                <div key={book.id} className="border-b border-line-whisper pb-5 last:border-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-lg font-semibold leading-tight text-text">{book.title}</p>
                      <p className="mt-1 font-mono text-[0.65rem] text-text-faint">
                        {publication ? publication.status : "not uploaded"}
                        {publication ? ` · ${formatNaira(publication.priceNaira)}` : ""}
                      </p>
                    </div>
                    {(publication?.status === "failed" || publication?.status === "processing") && (
                      <button
                        type="button"
                        onClick={() => processAgain(book.id)}
                        className="shrink-0 font-mono text-xs text-emerald-ink underline underline-offset-4"
                      >
                        {publication.status === "processing" ? "Restart processing" : "Process again"}
                      </button>
                    )}
                  </div>
                  {publication?.status === "processing" && (
                    <ProcessingProgress
                      bookTitle={book.title}
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
    </>
  );
}
