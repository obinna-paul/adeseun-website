import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { formatNaira } from "@/lib/utils";
import { BOOKS } from "@/components/sections/library/library-content";
import { BookCover } from "@/components/sections/library/BookCover";
import { CheckoutForm } from "@/components/sections/checkout/CheckoutForm";
import { getEbookPublication } from "@/lib/ebooks";
import type { BookFormat } from "@/lib/ebook-types";

export function generateStaticParams() {
  return BOOKS.map((book) => ({ bookId: book.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const book = BOOKS.find((b) => b.id === bookId);
  // noIndex: this is a transactional page, not something worth ranking in search.
  return pageMetadata({ title: book ? `Order — ${book.title}` : "Order", path: `/checkout/${bookId}`, noIndex: true });
}

/**
 * Replaces the old Amazon/Lulu "Purchase" dropdown in BookModal — buying
 * now happens on-site. This page collects delivery details
 * (CheckoutForm) and, on submit, redirects to Paystack's own hosted
 * payment page; nothing here handles a card number. See
 * app/api/checkout/route.ts and app/api/paystack/webhook/route.ts for
 * the rest of the flow.
 */
export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ format?: string }>;
}) {
  const { bookId } = await params;
  const requestedFormat = (await searchParams).format;
  const book = BOOKS.find((b) => b.id === bookId);
  if (!book) notFound();
  const publication = await getEbookPublication(book.id).catch(() => null);
  const ebookPrice = publication?.manifestKey ? publication.priceNaira : null;
  const initialFormat: BookFormat = requestedFormat === "ebook" && ebookPrice !== null ? "ebook" : "paperback";

  return (
    <main id="main-content" tabIndex={-1} className="bg-surface px-gutter py-room">
      <div className="mx-auto grid max-w-frame gap-12 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
        <div className="mx-auto w-full max-w-[200px] lg:mx-0 lg:max-w-none">
          <div className="aspect-[2/3] w-full">
            <BookCover book={book} priority className="h-full shadow-elevation-card" />
          </div>
          <div className="mt-6">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-gold-ink">
              Book {book.order} · {book.category}
            </span>
            <h1 className="mt-2 text-balance font-display text-2xl font-semibold leading-tight text-text">{book.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-text-subdued">
              Paperback {formatNaira(book.price)}
              {ebookPrice !== null ? ` · E-book ${formatNaira(ebookPrice)}` : ""}
            </p>
          </div>
        </div>

        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Complete your order</h2>
          <p className="mt-3 text-lg text-text-subdued">
            You&rsquo;ll be taken to Paystack to pay securely, then brought back here once it&rsquo;s done.
          </p>
          <CheckoutForm
            bookId={book.id}
            paperbackPrice={book.price}
            ebookPrice={ebookPrice}
            initialFormat={initialFormat}
          />
        </div>
      </div>
    </main>
  );
}
