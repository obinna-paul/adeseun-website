"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReaderSessionActions() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function signOut() {
    setBusy(true);
    await fetch("/api/reader/session", { method: "DELETE" }).catch(() => undefined);
    router.replace("/read");
    router.refresh();
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={signOut}
      className="font-mono text-xs text-text-subdued underline decoration-line-strong underline-offset-4 transition-colors duration-150 ease-gallery-standard hover:text-emerald-ink disabled:opacity-60"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
