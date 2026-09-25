export const MIN_PAPERBACK_QUANTITY = 1;
export const MAX_PAPERBACK_QUANTITY = 20;

export const PAPERBACK_QUANTITIES = Array.from(
  { length: MAX_PAPERBACK_QUANTITY - MIN_PAPERBACK_QUANTITY + 1 },
  (_, index) => index + MIN_PAPERBACK_QUANTITY,
);

/**
 * Accepts the JSON number sent by checkout and numeric strings echoed by
 * payment providers, while rejecting fractions and out-of-range bulk orders.
 */
export function parsePaperbackQuantity(value: unknown): number | null {
  const quantity =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  return Number.isInteger(quantity) && quantity >= MIN_PAPERBACK_QUANTITY && quantity <= MAX_PAPERBACK_QUANTITY
    ? quantity
    : null;
}

export function formatCopyCount(quantity: number): string {
  return `${quantity} ${quantity === 1 ? "copy" : "copies"}`;
}

export function calculateOrderTotal(unitPriceNaira: number, quantity: number): number {
  return unitPriceNaira * quantity;
}
