import clsx, { type ClassValue } from "clsx";

/** Thin wrapper so components import one `cn()` instead of clsx directly. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const nairaFormatter = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

/** Shared with app/api/paystack/webhook's own copy (kept server-side there to avoid a client/server import edge) — used wherever a book's price is shown in the UI. */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}
