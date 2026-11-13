import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { settingsFixture } from "@/lib/cms/fixtures";
import type { Section } from "@/lib/cms/schemas";
import { renderSection } from "./registry";

const hero = (extra: object = {}): Section => ({
  key: "hero",
  type: "hero",
  data: {
    eyebrow: "ABOUT SUPACHEFS",
    title: "The best food in Cebu was always in someone's home.",
    body: "",
    primary_cta: null,
    secondary_cta: null,
    image_url: null,
    image_caption: "The team sharing lunch from three different chefs",
    ...extra,
  },
});
const html = (section: Section, slug = "about") =>
  renderToStaticMarkup(
    renderSection(section, { settings: settingsFixture, slug }),
  );

describe("about hero (banner)", () => {
  it("shows a wide X placeholder with a PHOTO chip while no photo is set", () => {
    const out = html(hero());
    expect(out).toContain("ABOUT SUPACHEFS");
    expect(out).toContain(
      "PHOTO · The team sharing lunch from three different chefs",
    );
    expect(out).toContain("<svg");
    expect(out).not.toContain("<img");
    expect(out).not.toContain("lg:grid-cols-");
  });

  it("swaps in the CMS photo with a plain caption once one is uploaded", () => {
    const out = html(
      hero({ image_url: "https://cdn.supachefs.com/site/team.jpg" }),
    );
    expect(out).toContain("team.jpg");
    expect(out).toContain("The team sharing lunch from three different chefs");
    expect(out).not.toContain("PHOTO ·");
    expect(out).not.toContain("<svg");
  });

  it("omits the chip when there is no caption", () => {
    expect(html(hero({ image_caption: "" }))).not.toContain("PHOTO ·");
  });
});

describe("other heroes", () => {
  it("keep the two-column layout and draw no placeholder tile without a photo", () => {
    const out = html(hero(), "home");
    expect(out).not.toContain("PHOTO ·");
    expect(out).not.toContain("<svg");
  });
});
