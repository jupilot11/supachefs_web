import { describe, expect, it } from "vitest";
import { chefLeadSchema } from "./schema";

// The form checks the mobile field on blur with this exact schema member, so it cannot drift from the server.
const check = (v: string) => chefLeadSchema.shape.mobile.safeParse(v);

describe("mobile number check used on blur", () => {
  it.each(["917 123 4567", "0917-123-4567", "+639171234567"])(
    "accepts %s",
    (v) => expect(check(v).success).toBe(true),
  );
  it.each(["12345", "abc", "8171234567", "0917 123 456"])("rejects %s", (v) => {
    const r = check(v);
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe(
      "Enter a Philippine mobile number, like 917 123 4567.",
    );
  });
});
