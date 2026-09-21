import clsx, { type ClassValue } from "clsx";

/** Thin wrapper so components import one `cn()` instead of clsx directly. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const nairaFormatter = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

/** One place a naira price is formatted — the book modal, the checkout page, and the order emails all read from here so a price never renders two different ways. */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}
