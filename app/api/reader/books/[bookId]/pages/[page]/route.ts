import sharp from "sharp";
import { NextResponse } from "next/server";
import {
  checkReaderPageRateLimit,
  getEbookEntitlement,
  getEbookPublication,
  maskReaderEmail,
} from "@/lib/ebooks";
import { getEbookManifest, getPrivateObject, pageKeyFromManifest } from "@/lib/ebook-storage";
import { getReaderSession } from "@/lib/reader-auth";

export const runtime = "nodejs";

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character] ?? character;
  });
}

function watermarkSvg(width: number, height: number, label: string): Buffer {
  const safeLabel = escapeXml(label);
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="reader-mark" width="520" height="260" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <text x="20" y="130" fill="rgba(70, 50, 32, 0.13)" font-family="Arial, sans-serif" font-size="22" letter-spacing="1.5">${safeLabel}</text>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#reader-mark)"/>
    </svg>
  `);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string; page: string }> },
) {
  const session = await getReaderSession();
  if (!session) return NextResponse.json({ error: "Sign in to read this page." }, { status: 401 });

  const { bookId, page: pageParam } = await params;
  const page = Number(pageParam);
  if (!Number.isInteger(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page." }, { status: 400 });
  }

  try {
    const [entitlement, allowed] = await Promise.all([
      getEbookEntitlement(session.email, bookId),
      checkReaderPageRateLimit(session.email),
    ]);
    if (!entitlement) return NextResponse.json({ error: "This book is not in your library." }, { status: 403 });
    if (!allowed) return NextResponse.json({ error: "Too many page requests. Pause briefly and continue." }, { status: 429 });

    const publication = await getEbookPublication(bookId);
    if (!publication?.manifestKey) {
      return NextResponse.json({ error: "This e-book is unavailable." }, { status: 404 });
    }

    const manifest = await getEbookManifest(publication.manifestKey);
    if (page > manifest.pageCount) return NextResponse.json({ error: "Page not found." }, { status: 404 });

    const source = await getPrivateObject(pageKeyFromManifest(manifest, page));
    const metadata = await sharp(source).metadata();
    const width = metadata.width ?? 1800;
    const height = metadata.height ?? 2700;
    const reference = entitlement.orderReference.slice(-8).toUpperCase();
    const mark = `${maskReaderEmail(session.email)}  ${reference}`;
    const output = await sharp(source)
      .composite([{ input: watermarkSvg(width, height, mark), blend: "over" }])
      .webp({ quality: 86, effort: 3 })
      .toBuffer();

    return new Response(new Uint8Array(output), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "same-origin",
      },
    });
  } catch (err) {
    console.error(`Protected page delivery failed for ${bookId} page ${page}:`, err);
    return NextResponse.json({ error: "This page could not be loaded." }, { status: 500 });
  }
}
