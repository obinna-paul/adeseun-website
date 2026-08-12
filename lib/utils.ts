import clsx, { type ClassValue } from "clsx";

/** Thin wrapper so components import one `cn()` instead of clsx directly. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
