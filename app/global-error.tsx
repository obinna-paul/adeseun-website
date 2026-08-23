"use client";

import { useEffect } from "react";

/**
 * Root-level fallback — `error.tsx` catches failures inside a route
 * segment, but a failure in the root layout itself (Header, the
 * providers, anything above `{children}`) skips every route-level
 * boundary and needs its own `<html>`/`<body>`, since this replaces the
 * entire root layout when it renders. Kept deliberately plain (no
 * fonts/design tokens depended on — those live in the layout this is
 * standing in for) so it can't itself fail to render.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ display: "flex", minHeight: "100dvh", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", padding: "2rem", textAlign: "center", fontFamily: "system-ui, sans-serif", background: "#f4f3f1", color: "#1a1a2e" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 600 }}>Something went wrong.</h1>
          <p style={{ marginTop: "0.75rem", color: "#5a5a6a" }}>Try again, or reload the page.</p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          style={{ borderRadius: "4px", background: "#8a6d1f", color: "#fff", padding: "0.85rem 2rem", fontSize: "0.9rem", border: "none", cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
