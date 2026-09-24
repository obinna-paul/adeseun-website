import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getReaderSession } from "@/lib/reader-auth";
import { getEbookPublication, getReaderBookIds } from "@/lib/ebooks";
import { BOOKS, applyEbookMetadata, ebookOnlyBook, type Book } from "@/components/sections/library/library-content";
import { BookCover } from "@/components/sections/library/BookCover";
import { ReaderAccessForm } from "@/components/reader/ReaderAccessForm";
import { ReaderSessionActions } from "@/components/reader/ReaderSessionActions";

export const metadata = pageMetadata({ title: "My e-books", path: "/read", noIndex: true });

export default async function ReaderLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const query = await searchParams;
  const session = await getReaderSession().catch(() => null);

  if (!session) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-[78dvh] bg-surface-sunken px-gutter py-room">
        <div className="mx-auto max-w-frame-narrow">
          <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">Your private reading room</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-subdued">
            Enter the email used for your e-book purchase. We will recover any recent confirmed payment and send a private sign-in link so you can continue from your saved page.
          </p>
          {query.error === "expired" && (
            <p role="alert" className="mt-5 max-w-xl text-sm text-garnet">
              That link has expired or was already used. Request a fresh one below.
            </p>
          )}
          <ReaderAccessForm nextPath={query.next?.startsWith("/read") ? query.next : "/read"} />
        </div>
      </main>
    );
  }

  const bookIds: string[] = await getReaderBookIds(session.email).catch(() => [] as string[]);
  const ownedBooks = (
    await Promise.all(
      bookIds.map(async (bookId): Promise<Book | null> => {
        const publication = await getEbookPublication(bookId).catch(() => null);
        const catalogBook = BOOKS.find((book) => book.id === bookId);
        if (catalogBook) return applyEbookMetadata(catalogBook, publication);
        if (publication?.standalone) return ebookOnlyBook(publication);
        return null;
      }),
    )
  ).filter((book): book is Book => Boolean(book));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[78dvh] bg-surface-sunken px-gutter py-room">
      <div className="mx-auto max-w-frame">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">My e-books</h1>
            <p className="mt-3 text-lg text-text-subdued">Choose a book and continue from your last saved page.</p>
          </div>
          <ReaderSessionActions />
        </div>

        {ownedBooks.length === 0 ? (
          <div className="mt-12 max-w-xl border-t border-line pt-8">
            <p className="font-display text-2xl font-semibold text-text">No e-books are attached to this email yet.</p>
            <p className="mt-3 text-text-subdued">If you just paid, wait for your confirmation email, then refresh this page.</p>
            <Link href="/books" className="mt-6 inline-block text-emerald-ink underline decoration-emerald/40 underline-offset-4">
              Browse The Library
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {ownedBooks.map((book) => (
              <Link key={book.id} href={`/read/${book.id}`} className="group block">
                <span className="block aspect-[2/3] rounded-frame shadow-elevation-card transition-[transform,box-shadow] duration-200 ease-gallery-out group-hover:-translate-y-1 group-hover:shadow-glow-emerald">
                  <BookCover book={book} className="h-full" />
                </span>
                <span className="mt-3 block font-display text-lg font-semibold leading-tight text-text">{book.title}</span>
                <span className="mt-1 block font-mono text-[0.65rem] text-emerald-ink">Open reader</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
