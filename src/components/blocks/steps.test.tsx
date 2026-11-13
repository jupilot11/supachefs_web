import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { settingsFixture } from "@/lib/cms/fixtures";
import type { Section } from "@/lib/cms/schemas";
import { renderSection } from "./registry";

const step = (title: string, image_url: string | null = null) => ({
  title,
  body: `${title} text`,
  chips: [],
  image_url,
});
const steps = (
  image2: string | null,
  image1: string | null = null,
  chips: string[] = [],
): Section => ({
  key: "steps",
  type: "steps",
  data: {
    eyebrow: "",
    title: "From craving to doorstep",
    body: "",
    items: [
      step("Download the app", image1),
      { ...step("Browse chefs", image2), chips },
    ],
  },
});
const html = (section: Section, slug: string) =>
  renderToStaticMarkup(
    renderSection(section, { settings: settingsFixture, slug }),
  );
const PHONE = "aspect-[10/17]";

describe("customers steps with phone screenshots", () => {
  it("shows each step's screenshot in a phone frame, one frame per step", () => {
    const out = html(
      steps("https://cdn.supachefs.com/site/browse.png"),
      "how-it-works-customers",
    );
    expect(out).toContain("browse.png");
    expect(out.split(PHONE)).toHaveLength(3);
    expect(out).toContain("Browse chefs: app screen");
  });

  it("shows chips as one muted line under the phone steps", () => {
    const out = html(
      steps("https://cdn.supachefs.com/site/browse.png", null, [
        "GCash",
        "Maya",
        "Card",
      ]),
      "how-it-works-customers",
    );
    expect(out).toContain("GCash · Maya · Card");
    expect(out).not.toContain("rounded-full bg-orange-tint");
  });

  it("keeps the plain layout, with no frames, when no step has a screenshot yet", () => {
    const out = html(steps(null), "how-it-works-customers");
    expect(out).not.toContain(PHONE);
    expect(out).toContain("Browse chefs");
  });

  it("leaves the other steps pages as they were", () => {
    const out = html(
      steps("https://cdn.supachefs.com/site/browse.png"),
      "how-it-works-chefs",
    );
    expect(out).not.toContain(PHONE);
    expect(out).toContain("browse.png");
  });
});
