import { describe, expect, it } from "vitest";
import { dropPlaceholders } from "./placeholders";
import { faqFixtures, pageFixtures } from "./fixtures";
import { faqsSchema, PAGE_SLUGS, pageSchema } from "./schemas";

describe("dropPlaceholders", () => {
  it("strips a loose note and keeps the sentence", () => {
    expect(dropPlaceholders("So we built it. [Placeholder: year.]")).toBe(
      "So we built it.",
    );
    expect(dropPlaceholders("[Placeholder: x.] We walk you through it.")).toBe(
      "We walk you through it.",
    );
  });

  it("drops an array entry that has a note, keeps its siblings", () => {
    const out = dropPlaceholders({
      items: [
        { title: "Verified", body: "ID check." },
        { title: "Safety", body: "[Placeholder: permits.]" },
        { title: "[Placeholder: permits]", body: "x" },
      ],
    });
    expect(out.items).toEqual([{ title: "Verified", body: "ID check." }]);
  });

  it("works inside nested FAQ groups and leaves other values alone", () => {
    const out = dropPlaceholders({
      n: 3,
      ok: null,
      groups: [
        {
          topic: "Pay",
          items: [
            { id: 1, question: "Q1", answer: "A1" },
            { id: 2, question: "Q2", answer: "straight to your [Placeholder: x]" },
          ],
        },
      ],
    });
    expect(out.n).toBe(3);
    expect(out.ok).toBeNull();
    expect(out.groups[0].items).toHaveLength(1);
  });
});

describe("what visitors can receive", () => {
  it.each(PAGE_SLUGS)("page %s has no placeholder note", (slug) => {
    const page = dropPlaceholders(pageSchema.parse(pageFixtures[slug]));
    expect(JSON.stringify(page)).not.toMatch(/\[Placeholder/i);
  });
  it.each(["customers", "chefs"] as const)("faqs %s has none", (a) => {
    const faqs = dropPlaceholders(faqsSchema.parse(faqFixtures[a]));
    expect(JSON.stringify(faqs)).not.toMatch(/\[Placeholder/i);
    expect(faqs.groups.flatMap((g) => g.items).length).toBeGreaterThan(0);
  });
});
