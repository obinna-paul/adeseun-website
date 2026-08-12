import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "The Foyer", path: "/" });

/**
 * Placeholder — The Foyer's real seven-act build (see The Walkthrough)
 * is separate scope from this technical foundation pass. This stub only
 * exists so the app has a root route to build, and so the 404 page's
 * "Return to the Foyer" link goes somewhere real.
 */
export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ground px-gutter text-center text-text">
      <h1 className="font-display text-5xl font-semibold tracking-tight">The Foyer</h1>
      <p className="max-w-prose-gallery text-text-subdued">
        The seven-act build lives here next. This is the scaffold checkpoint.
      </p>
    </main>
  );
}
