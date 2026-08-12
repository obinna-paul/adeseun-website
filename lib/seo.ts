import type { Metadata } from "next";

const SITE_NAME = "Adeseun Oyeneye";
const SITE_URL = "https://adeseunoyeneye.com"; // placeholder — swap once the domain is confirmed
/**
 * Author-first, per direct instruction: her four real books lead
 * (naming all of them would blow the ~160-character SEO description
 * budget, so two representative titles stand in), her real professional
 * standing (Founder and Vice-President, Threesixty Africa Media —
 * corrected from an earlier "Threesixty Africa Group" guess, and from
 * "Vice-President" alone, once her own author bio confirmed both the
 * real name and that she founded it) is the credibility line, not the
 * headline — see library-content.ts and study-content.ts for the
 * research this is grounded in.
 */
const DEFAULT_DESCRIPTION =
  "Author of Think Before You Speak, Beyond the Mundane, Tranquility, and Black Is Beautiful. Founder and Vice-President, Threesixty Africa Media.";

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string; // e.g. "/library"
  image?: string; // absolute or root-relative OG image path
  noIndex?: boolean;
};

/**
 * Builds a Next.js Metadata object with sane, consistent OG/Twitter
 * defaults so every page doesn't hand-roll its own social card config.
 * Usage: `export const metadata = pageMetadata({ title: "The Library", path: "/library" })`
 */
export function pageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/og-default.png",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const fullTitle = path === "/" ? SITE_NAME : `${title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/** Root metadata, spread into app/layout.tsx's `export const metadata`. */
export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  // No favicon asset yet — add app/icon.png once her visual assets land,
  // Next.js will pick it up automatically without touching this file.
};

/**
 * JSON-LD structured data for the Person schema — every page can include
 * this via the <StructuredData> pattern below so search engines associate
 * the site with her as an author/executive, not just a generic business.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Author",
    description: DEFAULT_DESCRIPTION,
    sameAs: [] as string[], // fill in confirmed social/press profile URLs
  };
}

/** JSON-LD for an individual book — used on The Library's detail views. */
export function bookJsonLd(book: { title: string; description: string; isbn?: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: SITE_NAME },
    description: book.description,
    ...(book.isbn ? { isbn: book.isbn } : {}),
    url: book.url,
  };
}
