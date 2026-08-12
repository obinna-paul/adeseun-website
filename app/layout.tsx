import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { rootMetadata, personJsonLd } from "@/lib/seo";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { PageTransition } from "@/components/transitions/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/layout/ReadingProgress";
import "./globals.css";

export const metadata: Metadata = rootMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = personJsonLd();

  return (
    <html lang="en" className={fontVariables}>
      <body className="font-body antialiased" data-cursor-zone>
        {/* Person structured data on every page — see lib/seo.ts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <CursorProvider>
            <ReadingProgress />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </CursorProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
