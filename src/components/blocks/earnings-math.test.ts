import { describe, expect, it } from "vitest";
import { isFeeRow, parseAmount, receiveAmount } from "./earnings-math";

describe("parseAmount", () => {
  it.each([
    ["₱800", 800],
    ["₱1,800", 1800],
    ["₱ 1,234,567.50", 1234567.5],
    ["250", 250],
  ])("reads %s", (raw, want) => expect(parseAmount(raw)).toBe(want));

  it.each(["₱1,500–2,000", "₱[—]", "", "₱0", "₱1.200,00", "about ₱500"])(
    "refuses %j instead of guessing",
    (raw) => expect(parseAmount(raw)).toBeNull(),
  );
});

describe("isFeeRow", () => {
  it("matches the platform fee row only", () => {
    expect(isFeeRow("SupaChefs fee [XX%]")).toBe(true);
    expect(isFeeRow("SupaChefs fee (12%)")).toBe(true);
    expect(isFeeRow("Delivery fee (paid by customer)")).toBe(false);
    expect(isFeeRow("Tips (100% yours)")).toBe(false);
  });
});

describe("receiveAmount", () => {
  it("deducts the live fee percent", () => {
    expect(receiveAmount(1800, 10)).toEqual({ fee: 180, net: 1620 });
  });
});
