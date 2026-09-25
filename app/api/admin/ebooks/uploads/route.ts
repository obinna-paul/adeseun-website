import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { BOOKS } from "@/components/sections/library/library-content";
import { hasAdminSession } from "@/lib/admin-auth";
import { getEbookPublication, getEbookPublications, saveEbookPublication } from "@/lib/ebooks";
import {
  EbookStorageNotConfiguredError,
  EbookSourceMissingError,
  EbookSourceSizeMismatchError,
  abortSourceMultipartUpload,
  assertSourceObject,
  completeSourceMultipartUpload,
  createSourceMultipartUpload,
  findSourceMultipartUpload,
  signSourceUploadPart,
} from "@/lib/ebook-storage";
import { RedisNotConfiguredError } from "@/lib/redis";
import type { EbookPublication } from "@/lib/ebook-types";

export const runtime = "nodejs";

const MAX_SOURCE_BYTES = 2 * 1024 * 1024 * 1024;

type UploadAction =
  | {
      action: "create";
      bookId?: string;
      title?: string;
      description?: string;
      standalone?: boolean;
      filename: string;
      size: number;
      contentType: string;
      priceNaira: number;
    }
  | { action: "sign-part"; bookId: string; uploadId: string; key: string; partNumber: number }
  | {
      action: "complete";
      bookId: string;
      uploadId: string;
      key: string;
      parts: Array<{ ETag: string; PartNumber: number }>;
    }
  | { action: "abort"; bookId: string; uploadId: string; key: string }
  | { action: "process"; bookId: string }
  | { action: "update"; bookId: string; title?: string; description?: string; priceNaira: number }
  | { action: "diagnose" };

function cleanFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "ebook.pdf";
}

function sourcePrefix(): string {
  return (process.env.R2_PREFIX ?? "ebooks").replace(/^\/+|\/+$/g, "");
}

function cleanTitle(value: unknown): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, 120) : "";
}

function cleanDescription(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, 1200) : "";
}

function validPrice(value: unknown): number | null {
  const price = Math.round(Number(value));
  return Number.isFinite(price) && price >= 1 && price <= 100_000_000 ? price : null;
}

function slugifyTitle(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "ebook";
}

async function createStandaloneBookId(title: string): Promise<string> {
  const base = slugifyTitle(title);
  if (!BOOKS.some((book) => book.id === base) && !(await getEbookPublication(base))) return base;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `${base}-${randomBytes(3).toString("hex")}`;
    if (!BOOKS.some((book) => book.id === candidate) && !(await getEbookPublication(candidate))) return candidate;
  }
  throw new Error("Could not create a unique e-book ID.");
}

function safeErrorCode(error: unknown): string {
  if (error instanceof EbookStorageNotConfiguredError) return "R2_NOT_CONFIGURED";
  if (error instanceof EbookSourceMissingError) return "SOURCE_PDF_MISSING";
  if (error instanceof EbookSourceSizeMismatchError) return "SOURCE_PDF_SIZE_MISMATCH";
  if (error instanceof RedisNotConfiguredError) return "REDIS_NOT_CONFIGURED";
  if (!(error instanceof Error)) return "UNKNOWN_ERROR";

  const knownCodes: Record<string, string> = {
    AccessDenied: "R2_ACCESS_DENIED",
    CredentialsProviderError: "R2_CREDENTIALS_INVALID",
    InvalidAccessKeyId: "R2_ACCESS_KEY_INVALID",
    NoSuchBucket: "R2_BUCKET_NOT_FOUND",
    SignatureDoesNotMatch: "R2_SECRET_INVALID",
  };
  const knownCode = knownCodes[error.name];
  if (knownCode) return knownCode;
  if (error.message.startsWith("GitHub processor returned 401")) return "GITHUB_TOKEN_INVALID";
  if (error.message.startsWith("GitHub processor returned 403")) return "GITHUB_ACTIONS_FORBIDDEN";
  if (error.message.startsWith("GitHub processor returned 404")) return "GITHUB_WORKFLOW_NOT_FOUND";
  return error.name.replace(/[^A-Z0-9_]/gi, "_").toUpperCase() || "UNKNOWN_ERROR";
}

async function triggerGitHubProcessor(publication: EbookPublication): Promise<boolean> {
  const token = process.env.GITHUB_ACTIONS_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository) return false;

  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repository)) {
    throw new Error("GITHUB_REPOSITORY must use the owner/repository format.");
  }

  const workflow = process.env.GITHUB_EBOOK_WORKFLOW ?? "process-ebook.yml";
  const ref = process.env.GITHUB_EBOOK_REF ?? "main";
  const response = await fetch(
    `https://api.github.com/repos/${repository}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "adeseun-website",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        ref,
        inputs: { book_id: publication.bookId, source_key: publication.sourceKey },
      }),
    },
  );
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`GitHub processor returned ${response.status}: ${detail}`);
  }
  return true;
}

async function triggerHttpProcessor(publication: EbookPublication): Promise<boolean> {
  const url = process.env.EBOOK_PROCESSOR_URL;
  const secret = process.env.EBOOK_PROCESSOR_SECRET;
  if (!url || !secret) return false;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookId: publication.bookId, sourceKey: publication.sourceKey }),
  });
  if (!response.ok) throw new Error(`Processor returned ${response.status}.`);
  return true;
}

async function triggerProcessor(publication: EbookPublication): Promise<boolean> {
  if (await triggerGitHubProcessor(publication)) return true;
  return triggerHttpProcessor(publication);
}

function uploadMatches(publication: EbookPublication | null, key: string, uploadId: string): publication is EbookPublication {
  return Boolean(publication && publication.sourceKey === key && publication.uploadId === uploadId);
}

export async function GET() {
  if (!(await hasAdminSession().catch(() => false))) {
    return NextResponse.json({ error: "Publishing sign-in required." }, { status: 401 });
  }

  const publications = await getEbookPublications(BOOKS.map((book) => book.id));
  const response = NextResponse.json({ publications });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function POST(request: Request) {
  if (!(await hasAdminSession().catch(() => false))) {
    return NextResponse.json({ error: "Publishing sign-in required." }, { status: 401 });
  }

  let body: UploadAction;
  try {
    body = (await request.json()) as UploadAction;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    if (body.action === "create") {
      const requestedBookId = typeof body.bookId === "string" ? body.bookId.trim() : "";
      const requestedTitle = cleanTitle(body.title);
      const isNewStandalone = body.standalone === true && !requestedBookId;
      if (isNewStandalone && !requestedTitle) {
        return NextResponse.json({ error: "Enter a title for the new e-book." }, { status: 400 });
      }
      const bookId = isNewStandalone ? await createStandaloneBookId(requestedTitle) : requestedBookId;
      const catalogBook = BOOKS.find((candidate) => candidate.id === bookId);
      const existing = bookId ? await getEbookPublication(bookId) : null;

      if (!isNewStandalone && !catalogBook && !existing) {
        return NextResponse.json({ error: "Book not found." }, { status: 404 });
      }
      if (
        typeof body.filename !== "string" ||
        !body.filename.toLowerCase().endsWith(".pdf") ||
        body.contentType !== "application/pdf"
      ) {
        return NextResponse.json({ error: "Upload a PDF file." }, { status: 400 });
      }
      if (!Number.isFinite(body.size) || body.size < 1 || body.size > MAX_SOURCE_BYTES) {
        return NextResponse.json({ error: "The PDF must be smaller than 2 GB." }, { status: 400 });
      }
      const priceNaira = validPrice(body.priceNaira);
      if (priceNaira === null) {
        return NextResponse.json({ error: "Enter the e-book price in naira." }, { status: 400 });
      }

      const title = requestedTitle || existing?.title || catalogBook?.title || "";
      if (!title) return NextResponse.json({ error: "Enter a title for the e-book." }, { status: 400 });
      const description = cleanDescription(body.description) || existing?.description;
      const standalone = existing?.standalone ?? isNewStandalone;

      if (
        existing?.status === "uploading" &&
        existing.sourceKey &&
        existing.originalFilename === body.filename &&
        existing.sourceBytes === body.size
      ) {
        const resumable = await findSourceMultipartUpload(existing.sourceKey, existing.uploadId);
        if (resumable) {
          const now = new Date().toISOString();
          const publication: EbookPublication = {
            ...existing,
            title,
            description,
            standalone,
            priceNaira,
            uploadId: resumable.uploadId,
            updatedAt: now,
            error: undefined,
            errorCode: undefined,
          };
          await saveEbookPublication(publication);
          return NextResponse.json({
            bookId,
            uploadId: resumable.uploadId,
            key: existing.sourceKey,
            publication,
            resumed: true,
            parts: resumable.parts,
          });
        }
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const key = `${sourcePrefix()}/sources/${bookId}/${timestamp}-${cleanFilename(body.filename)}`;
      const uploadId = await createSourceMultipartUpload(key, "application/pdf");
      const now = new Date().toISOString();
      const publication: EbookPublication = {
        ...existing,
        bookId,
        title,
        description,
        standalone,
        priceNaira,
        status: "uploading",
        originalFilename: body.filename,
        sourceKey: key,
        sourceBytes: body.size,
        uploadId,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        error: undefined,
        errorCode: undefined,
        processingStage: undefined,
        processingProgress: undefined,
        processedPages: undefined,
        pageCount: undefined,
        processingStartedAt: undefined,
      };
      try {
        await saveEbookPublication(publication);
      } catch (error) {
        await abortSourceMultipartUpload(key, uploadId).catch(() => undefined);
        throw error;
      }
      return NextResponse.json({ bookId, uploadId, key, publication, resumed: false, parts: [] });
    }

    if (body.action === "diagnose") {
      await getEbookPublication("__diagnostic__");
      const key = `${sourcePrefix()}/diagnostics/${Date.now()}-configuration-check.pdf`;
      const uploadId = await createSourceMultipartUpload(key, "application/pdf");
      try {
        await signSourceUploadPart({ key, uploadId, partNumber: 1 });
      } finally {
        await abortSourceMultipartUpload(key, uploadId);
      }
      return NextResponse.json({ ok: true, redis: "ok", storage: "ok" });
    }

    if (body.action === "sign-part") {
      const publication = await getEbookPublication(body.bookId);
      if (!uploadMatches(publication, body.key, body.uploadId)) {
        return NextResponse.json({ error: "Upload session not found." }, { status: 404 });
      }
      if (!Number.isInteger(body.partNumber) || body.partNumber < 1 || body.partNumber > 10_000) {
        return NextResponse.json({ error: "Invalid upload part." }, { status: 400 });
      }
      const url = await signSourceUploadPart({ key: body.key, uploadId: body.uploadId, partNumber: body.partNumber });
      return NextResponse.json({ url });
    }

    if (body.action === "complete") {
      const publication = await getEbookPublication(body.bookId);
      if (!uploadMatches(publication, body.key, body.uploadId)) {
        return NextResponse.json({ error: "Upload session not found." }, { status: 404 });
      }
      const parts = body.parts
        .filter((part) => part.ETag && Number.isInteger(part.PartNumber))
        .sort((a, b) => a.PartNumber - b.PartNumber);
      if (parts.length === 0) return NextResponse.json({ error: "No uploaded parts were provided." }, { status: 400 });

      try {
        await completeSourceMultipartUpload({
          key: body.key,
          uploadId: body.uploadId,
          parts,
          expectedBytes: publication.sourceBytes,
        });
      } catch (error) {
        if (error instanceof EbookSourceMissingError || error instanceof EbookSourceSizeMismatchError) {
          const failed: EbookPublication = {
            ...publication,
            status: "failed",
            uploadId: undefined,
            updatedAt: new Date().toISOString(),
            error: error.message,
            errorCode: safeErrorCode(error),
            processingStage: "Upload verification failed",
          };
          await saveEbookPublication(failed);
          return NextResponse.json({ error: error.message, code: failed.errorCode }, { status: 409 });
        }
        throw error;
      }
      const now = new Date().toISOString();
      const processing: EbookPublication = {
        ...publication,
        status: "processing",
        uploadId: undefined,
        updatedAt: now,
        error: undefined,
        errorCode: undefined,
        processingStage: "Queued for processing",
        processingProgress: 0,
        processedPages: 0,
        pageCount: undefined,
        processingStartedAt: now,
      };
      await saveEbookPublication(processing);

      const processorStarted = await triggerProcessor(processing);
      return NextResponse.json({
        ok: true,
        processorStarted,
        publication: processing,
        message: processorStarted
          ? "Upload complete. Page processing has started."
          : "Upload complete. Configure the processor or run the processing command to publish it.",
      });
    }

    if (body.action === "abort") {
      const publication = await getEbookPublication(body.bookId);
      if (uploadMatches(publication, body.key, body.uploadId)) {
        await abortSourceMultipartUpload(body.key, body.uploadId);
        await saveEbookPublication({
          ...publication,
          status: "failed",
          uploadId: undefined,
          updatedAt: new Date().toISOString(),
          error: "Upload cancelled or failed.",
          errorCode: "UPLOAD_FAILED",
          processingStage: "Upload failed",
        });
      }
      return NextResponse.json({ ok: true });
    }

    if (body.action === "process") {
      const publication = await getEbookPublication(body.bookId);
      if (!publication?.sourceKey) return NextResponse.json({ error: "No source PDF is available." }, { status: 404 });
      try {
        await assertSourceObject(publication.sourceKey, publication.sourceBytes);
      } catch (error) {
        if (error instanceof EbookSourceMissingError || error instanceof EbookSourceSizeMismatchError) {
          const failed: EbookPublication = {
            ...publication,
            status: "failed",
            updatedAt: new Date().toISOString(),
            error: error.message,
            errorCode: safeErrorCode(error),
            processingStage: "Source PDF unavailable",
          };
          await saveEbookPublication(failed);
          return NextResponse.json({ error: error.message, code: failed.errorCode }, { status: 409 });
        }
        throw error;
      }
      const now = new Date().toISOString();
      const processing = {
        ...publication,
        status: "processing" as const,
        updatedAt: now,
        error: undefined,
        errorCode: undefined,
        processingStage: "Queued for processing",
        processingProgress: 0,
        processedPages: 0,
        pageCount: undefined,
        processingStartedAt: now,
      };
      await saveEbookPublication(processing);
      const processorStarted = await triggerProcessor(processing);
      if (!processorStarted) {
        return NextResponse.json({ error: "The processor service is not configured." }, { status: 503 });
      }
      return NextResponse.json({ ok: true, publication: processing, message: "Processing has started." });
    }

    if (body.action === "update") {
      const publication = await getEbookPublication(body.bookId);
      if (!publication) return NextResponse.json({ error: "Publication not found." }, { status: 404 });

      const title = cleanTitle(body.title);
      const priceNaira = validPrice(body.priceNaira);
      if (!title) return NextResponse.json({ error: "Enter a title for the e-book." }, { status: 400 });
      if (priceNaira === null) {
        return NextResponse.json({ error: "Enter the e-book price in naira." }, { status: 400 });
      }

      const updated: EbookPublication = {
        ...publication,
        title,
        description: cleanDescription(body.description) || undefined,
        priceNaira,
        updatedAt: new Date().toISOString(),
      };
      await saveEbookPublication(updated);
      return NextResponse.json({ ok: true, publication: updated, message: "Publication details saved." });
    }

    return NextResponse.json({ error: "Unknown upload action." }, { status: 400 });
  } catch (err) {
    console.error("E-book upload action failed:", err);
    const code = safeErrorCode(err);
    return NextResponse.json(
      { error: `The e-book ${body.action} action failed (${code}).`, code },
      { status: 500 },
    );
  }
}
