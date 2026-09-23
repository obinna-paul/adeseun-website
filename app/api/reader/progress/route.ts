import { NextResponse } from "next/server";
import { getEbookEntitlement, getEbookPublication, saveReadingProgress } from "@/lib/ebooks";
import { getEbookManifest } from "@/lib/ebook-storage";
import { getReaderSession } from "@/lib/reader-auth";

type ProgressPayload = {
  bookId?: unknown;
  page?: unknown;
};

export async function PUT(request: Request) {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ error: "Sign in to save progress." }, { status: 401 });

  let body: ProgressPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const bookId = typeof body.bookId === "string" ? body.bookId : "";
  const page = typeof body.page === "number" ? Math.floor(body.page) : Number.NaN;
  if (!bookId || !Number.isInteger(page)) {
    return NextResponse.json({ error: "Book and page are required." }, { status: 400 });
  }

  try {
    const entitlement = await getEbookEntitlement(session.email, bookId);
    if (!entitlement) return NextResponse.json({ error: "This book is not in your library." }, { status: 403 });

    const publication = await getEbookPublication(bookId);
    if (!publication?.manifestKey) {
      return NextResponse.json({ error: "This e-book is unavailable." }, { status: 404 });
    }
    const manifest = await getEbookManifest(publication.manifestKey);
    if (page < 1 || page > manifest.pageCount) {
      return NextResponse.json({ error: "That page does not exist." }, { status: 400 });
    }

    await saveReadingProgress(session.email, bookId, page);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Saving reading progress failed:", err);
    return NextResponse.json({ error: "Progress could not be saved." }, { status: 500 });
  }
}
