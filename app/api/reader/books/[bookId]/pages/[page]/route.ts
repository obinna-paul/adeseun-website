import path from "node:path";
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

const WATERMARK_FONT_PATH = path.join(process.cwd(), "app", "fonts", "IBMPlexMono-500.woff2");

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

function compactWatermarkLabel(name: string, email: string): string {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  if (!normalizedName) return maskReaderEmail(email);
  return normalizedName.length > 38 ? `${normalizedName.slice(0, 35).trim()}...` : normalizedName;
}

async function watermarkLayers(width: number, height: number, label: string) {
  const safeLabel = escapeXml(label);
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="#463220" alpha="15%" font_size="18pt">${safeLabel}</span>`,
      font: "IBM Plex Mono",
      fontfile: WATERMARK_FONT_PATH,
      width: 520,
      align: "center",
      rgba: true,
      dpi: 110,
    },
  })
    .rotate(-22, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer({ resolveWithObject: true });

  const layers: Array<{ input: Buffer; top: number; left: number; blend: "over" }> = [];
  const stepX = Math.max(680, info.width + 140);
  const stepY = Math.max(360, info.height + 180);
  const maxLeft = Math.max(0, width - info.width);
  const maxTop = Math.max(0, height - info.height);

  for (let row = 0, top = 80; top <= maxTop; row += 1, top += stepY) {
    const offset = row % 2 === 0 ? 40 : Math.floor(stepX / 2);
    for (let left = Math.min(offset, maxLeft); left <= maxLeft; left += stepX) {
      layers.push({ input: data, top, left, blend: "over" });
    }
  }

  if (layers.length === 0) layers.push({ input: data, top: 0, left: 0, blend: "over" });
  return layers;
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
    const mark = compactWatermarkLabel(entitlement.customerName, session.email);
    const layers = await watermarkLayers(width, height, mark);
    // The source PDF uses light charcoal body copy. Increase tonal separation
    // around the dark range so reading text renders as solid ink on laptops,
    // while highlights and the white page remain clean.
    const output = await sharp(source)
      .linear(1.22, -36)
      .composite(layers)
      .webp({ quality: 92, effort: 3, smartSubsample: true })
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
