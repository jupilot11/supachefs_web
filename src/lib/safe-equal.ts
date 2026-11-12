import { timingSafeEqual } from "node:crypto";

/** Constant-time string compare that also copes with unequal lengths. */
export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
