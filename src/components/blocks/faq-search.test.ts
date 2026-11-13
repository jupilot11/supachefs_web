import { describe, expect, it } from "vitest";
import { faqFixtures } from "@/lib/cms/fixtures";
import { faqsSchema, type Audience } from "@/lib/cms/schemas";
import { dropPlaceholders } from "@/lib/cms/placeholders";
import { filterGroups, START_HERE, startPicks } from "./faq-search";

// The same data the page gets: parsed, with unfinished [Placeholder] answers already dropped.
const groups = (a: Audience) =>
  dropPlaceholders(faqsSchema.parse(faqFixtures[a])).groups;
const questions = (a: Audience, q: string) =>
  filterGroups(groups(a), q).flatMap((g) => g.items.map((i) => i.question));

describe("filterGroups", () => {
  it("returns everything for an empty or blank query", () => {
    expect(filterGroups(groups("customers"), "")).toEqual(groups("customers"));
    expect(filterGroups(groups("customers"), "   ")).toEqual(
      groups("customers"),
    );
  });

  it("matches a word in the question or the answer, any case", () => {
    expect(questions("customers", "GCASH")).toEqual(["How can I pay?"]);
    expect(questions("customers", "tip")).toContain("Can I tip my chef?");
  });

  it("needs every word, and drops topics left empty", () => {
    expect(questions("customers", "pay maya")).toEqual(["How can I pay?"]);
    expect(questions("customers", "pay zzzz")).toEqual([]);
    const g = filterGroups(groups("customers"), "kitchen visit");
    expect(g.map((x) => x.topic)).toEqual(["Safety"]);
  });
});

describe("startPicks", () => {
  it.each(["customers", "chefs"] as const)(
    "finds three real %s questions, verification first for customers",
    (a) => {
      const picks = startPicks(groups(a), START_HERE[a]);
      expect(picks).toHaveLength(3);
      if (a === "customers")
        expect(picks[0].question).toBe("How do you check chefs?");
    },
  );

  it("skips a pattern that matches nothing instead of failing", () => {
    expect(
      startPicks(groups("customers"), [/nope/i, /how do i order/i]),
    ).toHaveLength(1);
  });
});
