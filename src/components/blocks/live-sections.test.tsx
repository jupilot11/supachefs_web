import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as cms from "@/lib/cms";
import { cmsFetch } from "@/lib/cms/client";
import { getTestimonials, getTopChefs } from "@/lib/cms/queries";
import type { Settings, TopChef } from "@/lib/cms/schemas";
import { settingsFixture } from "@/lib/cms/fixtures";
import { initials, LiveChefs } from "./live-chefs";
import { LiveTestimonials } from "./live-testimonials";
import { renderSection } from "./registry";

// Components read through "@/lib/cms"; the query tests below use the real queries over a mocked fetch.
vi.mock("@/lib/cms", () => ({
  getTopChefs: vi.fn(),
  getTestimonials: vi.fn(),
}));
vi.mock("@/lib/cms/client", async (original) => ({
  ...(await original<typeof import("@/lib/cms/client")>()),
  cmsFetch: vi.fn(),
}));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const chef = (n: number, over: Partial<TopChef> = {}): TopChef => ({
  id: n,
  name: `Chef Number${n}`,
  area: "Lahug",
  cuisine: "Filipino",
  story: `Story ${n}`,
  image_url: `https://img.test/chef-${n}.jpg`,
  rating: 4.8,
  reviews: 12,
  ...over,
});
const review = (n: number, over = {}) => ({
  id: n,
  text: `Review text ${n} that is long enough`,
  rating: 5,
  author: "Maria S.",
  chef: "Chef Tess",
  area: "Banilad",
  dish: "Beef pochero",
  created_at: "2026-11-10T08:00:00+00:00",
  ...over,
});
const html = async (node: Promise<ReactElement | null>) =>
  renderToStaticMarkup(await node);
const count = (s: string, needle: string) => s.split(needle).length - 1;

describe("the home chefs section", () => {
  it("shows each real chef with area, cuisine, rating and story", async () => {
    vi.mocked(cms.getTopChefs).mockResolvedValue([
      chef(1),
      chef(2, { rating: null, reviews: 0, story: null }),
      chef(3),
    ]);
    const out = await html(LiveChefs({ id: "chefs" }));
    expect(count(out, "<li")).toBe(3);
    expect(out).toContain("Chef Number1");
    expect(out).toContain("Lahug");
    expect(out).toContain("4.8");
    expect(out).toContain("(12 reviews)");
    expect(out).toContain("Story 1");
    // A chef with no reviews shows no rating at all, not a fake one, and says so
    expect(count(out, "out of 5 from")).toBe(2);
    expect(count(out, "No reviews yet")).toBe(1);
  });

  it("gives a chef without a photo an initials tile, and a chef with one the photo", async () => {
    vi.mocked(cms.getTopChefs).mockResolvedValue([
      chef(1, { name: "Chef Kenji Tanaka", image_url: null }),
      chef(2, { name: "Nena Cabahug", image_url: "https://img.test/nena.jpg" }),
      chef(3),
      chef(4),
    ]);
    const out = await html(LiveChefs({ id: "chefs" }));
    expect(out).toContain(">KT<");
    expect(count(out, "<img")).toBe(3);
    expect(out).toContain("nena.jpg");
    expect(out).not.toContain(">NC<"); // the one with a photo gets no initials tile
  });

  it("makes initials from the first two words, ignoring a leading Chef", () => {
    expect(initials("Chef Maria Santos")).toBe("MS");
    expect(initials("Jufiel Lariosa")).toBe("JL");
    expect(initials("chef  tess")).toBe("T");
    expect(initials("Nena")).toBe("N");
  });

  it("shows all five when there are five", async () => {
    vi.mocked(cms.getTopChefs).mockResolvedValue(
      [1, 2, 3, 4, 5].map((n) => chef(n)),
    );
    expect(count(await html(LiveChefs({ id: "chefs" })), "<li")).toBe(5);
  });

  it("renders nothing at all when there are no chefs", async () => {
    vi.mocked(cms.getTopChefs).mockResolvedValue([]);
    expect(await html(LiveChefs({ id: "chefs" }))).toBe("");
  });

  it("stays hidden until three chefs have a photo, however many there are", async () => {
    const noPhoto = (n: number) => chef(n, { image_url: null });
    vi.mocked(cms.getTopChefs).mockResolvedValue([chef(1), noPhoto(2)]);
    expect(await html(LiveChefs({ id: "chefs" }))).toBe("");
    vi.mocked(cms.getTopChefs).mockResolvedValue([
      chef(1),
      chef(2),
      noPhoto(3),
      noPhoto(4),
      noPhoto(5),
    ]);
    expect(await html(LiveChefs({ id: "chefs" }))).toBe("");
  });

  it("shows at exactly three photos, with the photo-less chefs still in the row", async () => {
    vi.mocked(cms.getTopChefs).mockResolvedValue([
      chef(1),
      chef(2),
      chef(3),
      chef(4, { image_url: null }),
    ]);
    expect(count(await html(LiveChefs({ id: "chefs" })), "<li")).toBe(4);
  });
});

describe("the home testimonials section", () => {
  it("renders nothing at all when there are no reviews", async () => {
    vi.mocked(cms.getTestimonials).mockResolvedValue([]);
    expect(await html(LiveTestimonials({ id: "testimonial" }))).toBe("");
  });

  it("shows a single review large, with the author and where it was ordered", async () => {
    vi.mocked(cms.getTestimonials).mockResolvedValue([review(1)]);
    const out = await html(LiveTestimonials({ id: "testimonial" }));
    expect(out).toContain("Review text 1 that is long enough");
    expect(out).toContain("Maria S.");
    expect(out).toContain("Beef pochero from Chef Tess · Banilad");
    expect(count(out, "<li")).toBe(0);
  });

  it("shows several reviews as cards with their stars", async () => {
    vi.mocked(cms.getTestimonials).mockResolvedValue([
      review(1),
      review(2, { rating: 4, dish: null }),
      review(3),
    ]);
    const out = await html(LiveTestimonials({ id: "testimonial" }));
    expect(count(out, "<li")).toBe(3);
    expect(out).toContain("4 out of 5 stars");
    expect(out).toContain("Ordered from Chef Tess · Banilad");
  });
});

describe("the CMS no longer writes these two sections", () => {
  const settings = settingsFixture as unknown as Settings;
  const fake = {
    eyebrow: "FAKE",
    title: "Made-up chefs",
    items: [
      {
        name: "Nena",
        area: "Talamban",
        cuisine: "x",
        dish: "x",
        story: "x",
        image_url: null,
      },
    ],
  };
  const make = (key: string, type: string, data: unknown, slug: string) =>
    renderSection({ key, type, data } as never, {
      settings,
      slug,
    }) as ReactElement;

  it("home chefs and testimonial render the live sections whatever the CMS holds", () => {
    expect(make("chefs", "chefs", fake, "home").type).toBe(LiveChefs);
    expect(make("testimonial", "quote", { text: "Fake" }, "home").type).toBe(
      LiveTestimonials,
    );
  });

  it("other pages keep their CMS chefs block", () => {
    expect(make("chefs", "chefs", fake, "about").type).not.toBe(LiveChefs);
  });
});

describe("loading the live data", () => {
  it("keeps only five chefs and five reviews even if the API sends more", async () => {
    vi.stubEnv("CMS_FIXTURES", "0");
    vi.mocked(cmsFetch).mockResolvedValueOnce({
      chefs: [1, 2, 3, 4, 5, 6, 7].map((n) => chef(n)),
    });
    expect(await getTopChefs()).toHaveLength(5);
    vi.mocked(cmsFetch).mockResolvedValueOnce({
      testimonials: [1, 2, 3, 4, 5, 6].map((n) => review(n)),
    });
    expect(await getTestimonials()).toHaveLength(5);
  });

  it("gives an empty list, not an error, when the API is down", async () => {
    vi.stubEnv("CMS_FIXTURES", "0");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(cmsFetch).mockRejectedValue(new Error("API down"));
    expect(await getTopChefs()).toEqual([]);
    expect(await getTestimonials()).toEqual([]);
  });

  it("asks the API for the live data with a short cache and its own tag", async () => {
    vi.stubEnv("CMS_FIXTURES", "0");
    vi.mocked(cmsFetch).mockResolvedValue({ chefs: [], testimonials: [] });
    await getTopChefs();
    await getTestimonials();
    const calls = vi.mocked(cmsFetch).mock.calls;
    expect(calls[0][0]).toBe("/api/v1/site/top-chefs");
    expect(calls[0][2]).toMatchObject({ tag: "top-chefs", revalidate: 300 });
    expect(calls[1][0]).toBe("/api/v1/site/testimonials");
    expect(calls[1][2]).toMatchObject({ tag: "testimonials", revalidate: 300 });
  });
});
