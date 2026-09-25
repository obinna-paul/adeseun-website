import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getEbookPublication, saveEbookPublication } from "@/lib/ebooks";

export const runtime = "nodejs";

type ProcessorPayload = {
  bookId?: unknown;
  sourceKey?: unknown;
  update?: {
    status?: unknown;
    manifestKey?: unknown;
    publishedAt?: unknown;
    error?: unknown;
    errorCode?: unknown;
    processingStage?: unknown;
    processingProgress?: unknown;
    processedPages?: unknown;
    pageCount?: unknown;
    processingStartedAt?: unknown;
  };
};

function optionalNonNegativeInteger(value: unknown): number | undefined {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : undefined;
}

function optionalPositiveInteger(value: unknown): number | undefined {
  return Number.isInteger(value) && Number(value) > 0 ? Number(value) : undefined;
}

function isAuthorized(request: Request): boolean {
  const expected = process.env.EBOOK_PROCESSOR_SECRET;
  const header = request.headers.get("authorization");
  const supplied = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || expected.length < 32 || !supplied) return false;
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Processor authorization failed." }, { status: 401 });
  }

  let body: ProcessorPayload;
  try {
    body = (await request.json()) as ProcessorPayload;
  } catch {
    return NextResponse.json({ error: "Invalid processor update." }, { status: 400 });
  }

  const bookId = typeof body.bookId === "string" ? body.bookId : "";
  const sourceKey = typeof body.sourceKey === "string" ? body.sourceKey : "";
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(bookId) || !sourceKey || !body.update) {
    return NextResponse.json({ error: "Invalid processor update." }, { status: 400 });
  }

  try {
    const publication = await getEbookPublication(bookId);
    if (!publication || publication.sourceKey !== sourceKey) {
      return NextResponse.json({ error: "This source PDF is no longer current." }, { status: 409 });
    }

    if (body.update.status === "processing") {
      const processingStage =
        typeof body.update.processingStage === "string" ? body.update.processingStage.trim().slice(0, 120) : "";
      const processingProgress = optionalNonNegativeInteger(body.update.processingProgress);
      const processedPages = optionalNonNegativeInteger(body.update.processedPages);
      const pageCount = optionalPositiveInteger(body.update.pageCount);
      const processingStartedAt =
        typeof body.update.processingStartedAt === "string" ? body.update.processingStartedAt : publication.processingStartedAt;

      if (!processingStage || processingProgress === undefined || processingProgress > 99) {
        return NextResponse.json({ error: "Invalid processing progress." }, { status: 400 });
      }
      if (pageCount !== undefined && processedPages !== undefined && processedPages > pageCount) {
        return NextResponse.json({ error: "Invalid processed page count." }, { status: 400 });
      }

      await saveEbookPublication({
        ...publication,
        status: "processing",
        processingStage,
        processingProgress,
        processedPages: processedPages ?? publication.processedPages ?? 0,
        pageCount: pageCount ?? publication.pageCount,
        processingStartedAt,
        updatedAt: new Date().toISOString(),
        error: undefined,
        errorCode: undefined,
      });
      return NextResponse.json({ ok: true });
    }

    if (body.update.status === "published") {
      const manifestKey = typeof body.update.manifestKey === "string" ? body.update.manifestKey : "";
      const publishedAt = typeof body.update.publishedAt === "string" ? body.update.publishedAt : "";
      const prefix = (process.env.R2_PREFIX ?? "ebooks").replace(/^\/+|\/+$/g, "");
      const expectedManifestPrefix = `${prefix}/books/${bookId}/versions/`;
      if (!manifestKey.startsWith(expectedManifestPrefix) || !manifestKey.endsWith("/manifest.json") || !publishedAt) {
        return NextResponse.json({ error: "Invalid publication result." }, { status: 400 });
      }
      const pageCount = optionalPositiveInteger(body.update.pageCount) ?? publication.pageCount;
      await saveEbookPublication({
        ...publication,
        status: "published",
        manifestKey,
        publishedAt,
        processingStage: "Published",
        processingProgress: 100,
        processedPages: pageCount ?? publication.processedPages,
        pageCount,
        updatedAt: new Date().toISOString(),
        error: undefined,
        errorCode: undefined,
      });
      return NextResponse.json({ ok: true });
    }

    if (body.update.status === "failed") {
      const error = typeof body.update.error === "string" ? body.update.error.slice(0, 1000) : "Processing failed.";
      const errorCode = typeof body.update.errorCode === "string" ? body.update.errorCode.slice(0, 80) : undefined;
      await saveEbookPublication({
        ...publication,
        status: "failed",
        processingStage: "Processing failed",
        updatedAt: new Date().toISOString(),
        error,
        errorCode,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported processor status." }, { status: 400 });
  } catch (error) {
    console.error("E-book processor callback failed:", error);
    return NextResponse.json({ error: "Could not save processor status." }, { status: 500 });
  }
}
