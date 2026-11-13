import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { settingsFixture } from "@/lib/cms/fixtures";
import type { Section } from "@/lib/cms/schemas";
import { renderSection } from "./registry";

const trust = (extra: object = {}): Section => ({
  key: "trust",
  type: "cards",
  data: {
    eyebrow: "TRUST & SAFETY",
    title: "Who's cooking your food? We check.",
    body: "",
    items: [
      {
        icon: "shield-check",
        title: "Every chef is verified",
        body: "ID check.",
      },
      {
        icon: "badge-check",
        title: "Food safety on every order",
        body: "Checklist.",
      },
    ],
    ...extra,
  },
});
const html = (section: Section, slug = "home") =>
  renderToStaticMarkup(
    renderSection(section, { settings: settingsFixture, slug }),
  );

describe("cards checklist layout", () => {
  it("puts the CMS photo and link beside the list on the home Trust & Safety section", () => {
    const out = html(
      trust({
        image_url: "https://cdn.supachefs.com/site/kitchen.jpg",
        link: {
          label: "How we keep it safe →",
          href: "/how-it-works/customers#trust",
        },
      }),
    );
    expect(out).toContain("kitchen.jpg");
    expect(out).toContain('href="/how-it-works/customers#trust"');
    expect(out).toContain("How we keep it safe →");
    // the photo is the left half on desktop and sits between the title and the list on a phone (CSS order)
    expect(out).toContain("lg:-order-1");
  });

  it("keeps the old layout, with no photo slot or link, when the CMS has neither (and for pages saved before the fields existed)", () => {
    for (const extra of [{}, { image_url: null, link: null }]) {
      const out = html(trust(extra));
      expect(out).not.toContain("<img");
      expect(out).not.toContain("lg:-order-1");
      expect(out).toContain("Every chef is verified");
    }
  });

  it("keeps the link under the list, in the list's column, when there is a link but no photo", () => {
    const out = html(
      trust({
        image_url: null,
        link: { label: "How we keep it safe →", href: "/x" },
      }),
    );
    expect(out).toContain("How we keep it safe →");
    expect(out).toMatch(/<a [^>]*lg:col-start-2/);
  });

  it("ignores the photo on the card-grid layout", () => {
    const out = html(
      {
        ...trust({ image_url: "https://cdn.supachefs.com/x.jpg" }),
        key: "why",
      },
      "home",
    );
    expect(out).not.toContain("x.jpg");
  });
});
