// Strict on purpose: a range ("₱1,500–2,000") or a placeholder ("₱[—]") must read as unknown, not as a wrong number.
const AMOUNT = /^\s*₱?\s*(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?\s*$/;

export function parseAmount(raw: string): number | null {
  const m = AMOUNT.exec(raw);
  if (!m) return null;
  const n = Number(m[1].replaceAll(",", "") + (m[2] ?? ""));
  return n > 0 ? n : null;
}

/** The platform fee row, not any row that happens to say "fee" (a "Delivery fee" row is not ours). */
export const isFeeRow = (label: string) =>
  /\[XX%\]|^supachefs fee/i.test(label.trim());

export function receiveAmount(example: number, feePercent: number) {
  const fee = (example * feePercent) / 100;
  return { fee, net: example - fee };
}
