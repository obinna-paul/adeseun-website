import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata, siteJsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { PageTransition } from "@/components/transitions/PageTransition";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/layout/ReadingProgress";
import { SkipLink } from "@/components/layout/SkipLink";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = siteJsonLd();

  return (
    <html lang="en-NG" className={fontVariables}>
      <body className="font-body antialiased" data-cursor-zone>
        <SkipLink />
        {/* Stable WebSite + Person entity graph — see lib/seo.ts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <CursorProvider>
            <Header />
            <ReadingProgress />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </CursorProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
