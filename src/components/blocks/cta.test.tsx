import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { settingsFixture } from "@/lib/cms/fixtures";
import type { Section } from "@/lib/cms/schemas";
import { renderSection } from "./registry";

const chefCta = (extra: object = {}): Section => ({
  key: "chef_cta",
  type: "cta",
  data: {
    eyebrow: "FOR HOME COOKS",
    title: "Your neighbors already love your cooking.",
    body: "Sell what you already cook.",
    primary_cta: { label: "Become a Chef", href: "/become-a-chef" },
    secondary_cta: null,
    ...extra,
  },
});
const html = (section: Section) =>
  renderToStaticMarkup(
    renderSection(section, { settings: settingsFixture, slug: "home" }),
  );

describe("cta band", () => {
  it("fills the right half with the CMS photo, under the text on a phone", () => {
    const out = html(
      chefCta({ image_url: "https://cdn.supachefs.com/site/ngohiong.jpg" }),
    );
    expect(out).toContain("ngohiong.jpg");
    expect(out).toContain("lg:grid-cols-2");
    expect(out).toContain("Become a Chef");
  });

  it("keeps the old full-width band with no photo slot when the CMS has none (and on pages saved before the field existed)", () => {
    for (const extra of [{}, { image_url: null }]) {
      const out = html(chefCta(extra));
      expect(out).not.toContain("<img");
      expect(out).not.toContain("lg:grid-cols-2");
      expect(out).toContain("Your neighbors already love your cooking.");
    }
  });
});
