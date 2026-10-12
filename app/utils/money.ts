/** Minor-units money as returned by the backend (see `Money` in `~/actions/sku.server`). */
export interface MoneyValue {
  amount: number;
  currency: string;
}

const formatters = new Map<string, Intl.NumberFormat>();

/** Format minor-unit money for display, e.g. `{ amount: 14000, currency: "INR" }` → "₹140.00". */
export function formatMoney({ amount, currency }: MoneyValue): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency });
    } catch {
      formatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
    }
    formatters.set(currency, formatter);
  }
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(amount / 10 ** fractionDigits);
}
