import { pageMetadata } from "@/lib/seo";
import { BOOKS } from "@/components/sections/library/library-content";
import { EbookAdminDashboard, EbookAdminLogin } from "@/components/admin/EbookAdmin";
import { hasAdminSession } from "@/lib/admin-auth";
import { getEbookPublications } from "@/lib/ebooks";

export const metadata = pageMetadata({ title: "E-book publisher", path: "/admin/ebooks", noIndex: true });

export default async function EbookAdminPage() {
  const signedIn = await hasAdminSession().catch(() => false);

  if (!signedIn) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-[78dvh] bg-surface px-gutter py-room">
        <div className="mx-auto max-w-frame-narrow">
          <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">E-book publisher</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-subdued">
            This private room is for uploading source PDFs, setting e-book prices, and checking publication status.
          </p>
          <EbookAdminLogin />
        </div>
      </main>
    );
  }

  const publications = await getEbookPublications(BOOKS.map((book) => book.id)).catch(() => ({}));
  const standaloneBooks = Object.values(publications)
    .filter((publication) => publication.standalone)
    .map((publication) => ({ id: publication.bookId, title: publication.title || "Untitled e-book", standalone: true }));

  return (
    <main id="main-content" tabIndex={-1} className="min-h-[78dvh] bg-surface px-gutter py-room">
      <div className="mx-auto max-w-frame">
        <h1 className="text-balance font-display text-4xl font-semibold text-text sm:text-5xl">E-book publisher</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-subdued">
          Upload a private source PDF. The book becomes purchasable online only after every reading page has been processed successfully.
        </p>
        <EbookAdminDashboard
          books={[
            ...BOOKS.map((book) => ({ id: book.id, title: book.title, standalone: false })),
            ...standaloneBooks,
          ]}
          publications={publications}
        />
      </div>
    </main>
  );
}
