import { NextResponse } from "next/server";
import { getEbookPublication } from "@/lib/ebooks";
import { getEbookManifest, getPrivateObject, pageKeyFromManifest } from "@/lib/ebook-storage";

export const runtime = "nodejs";

/**
 * A standalone e-book has no pre-existing website artwork, so its first PDF
 * page is intentionally exposed as the public catalog cover. The remaining
 * pages still require a purchaser session and entitlement.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params;

  try {
    const publication = await getEbookPublication(bookId);
    if (!publication?.standalone || !publication.manifestKey) {
      return NextResponse.json({ error: "Cover not found." }, { status: 404 });
    }

    const manifest = await getEbookManifest(publication.manifestKey);
    const cover = await getPrivateObject(pageKeyFromManifest(manifest, 1));

    return new Response(new Uint8Array(cover), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(`Could not load the public cover for ${bookId}:`, error);
    return NextResponse.json({ error: "Cover not found." }, { status: 404 });
  }
}
