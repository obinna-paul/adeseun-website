import { notFound, redirect } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { BOOKS } from "@/components/sections/library/library-content";
import { EbookReader } from "@/components/reader/EbookReader";
import { getReaderSession } from "@/lib/reader-auth";
import { getEbookEntitlement, getEbookPublication, getReadingProgress } from "@/lib/ebooks";
import { getEbookManifest } from "@/lib/ebook-storage";

export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = BOOKS.find((candidate) => candidate.id === bookId);
  return pageMetadata({ title: book ? `Read ${book.title}` : "Reader", path: `/read/${bookId}`, noIndex: true });
}

export default async function EbookReaderPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = BOOKS.find((candidate) => candidate.id === bookId);
  if (!book) notFound();

  const session = await getReaderSession().catch(() => null);
  if (!session) redirect(`/read?next=${encodeURIComponent(`/read/${book.id}`)}`);

  const entitlement = await getEbookEntitlement(session.email, book.id).catch(() => null);
  if (!entitlement) redirect("/read");

  const publication = await getEbookPublication(book.id);
  if (!publication?.manifestKey) redirect("/read");

  const [manifest, progress] = await Promise.all([
    getEbookManifest(publication.manifestKey),
    getReadingProgress(session.email, book.id).catch(() => null),
  ]);
  const initialPage = Math.max(1, Math.min(manifest.pageCount, progress?.page ?? 1));

  return <EbookReader bookId={book.id} title={book.title} pageCount={manifest.pageCount} initialPage={initialPage} />;
}
