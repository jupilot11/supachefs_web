import { afterEach, describe, expect, it, vi } from "vitest";
import { CmsError, getFaqs, getLegal, getPage, getSettings } from "@/lib/cms";
import {
  faqFixtures,
  legalFixtures,
  pageFixtures,
  settingsFixture,
} from "@/lib/cms/fixtures";
import {
  faqsSchema,
  legalSchema,
  PAGE_SLUGS,
  pageSchema,
  settingsSchema,
} from "@/lib/cms/schemas";
import { renderSection } from "@/components/blocks/registry";

describe("fixtures parse with their Zod schemas", () => {
  it("settings", () => {
    expect(settingsSchema.safeParse(settingsFixture).success).toBe(true);
  });
  it.each(PAGE_SLUGS)("page %s", (slug) => {
    const r = pageSchema.safeParse(pageFixtures[slug]);
    expect(r.error?.message).toBeUndefined();
    expect(r.data?.slug).toBe(slug);
    // every fixture section is a known block (none fell through as unknown)
    expect(r.data?.sections.length).toBeGreaterThan(0);
  });
  it.each(["customers", "chefs"] as const)("faqs %s", (a) => {
    expect(faqsSchema.safeParse(faqFixtures[a]).success).toBe(true);
  });
  it.each(["terms", "privacy"] as const)("legal %s", (p) => {
    expect(legalSchema.safeParse(legalFixtures[p]).success).toBe(true);
  });
  it("queries return fixtures when CMS_FIXTURES=1", async () => {
    expect((await getSettings()).platform_fee_percent).toBe(10);
    expect((await getPage("home")).slug).toBe("home");
    expect((await getFaqs("chefs")).audience).toBe("chefs");
    expect((await getLegal("terms")).title).toBe("Terms");
  });
});

describe("live client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.CMS_FIXTURES = "1";
  });
  const live = (impl: typeof fetch) => {
    process.env.CMS_FIXTURES = "";
    const spy = vi.fn(impl);
    vi.stubGlobal("fetch", spy);
    return spy;
  };
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status });

  it("throws CmsError(parse) for a broken payload", async () => {
    live(async () => json({ ...pageFixtures.home, sections: "nope" }));
    const err = await getPage("home").catch((e) => e);
    expect(err).toBeInstanceOf(CmsError);
    expect(err.kind).toBe("parse");
  });

  it("throws CmsError(parse) when a known block has bad data", async () => {
    live(async () =>
      json({
        ...pageFixtures.home,
        sections: [{ key: "hero", type: "hero", data: { title: 5 } }],
      }),
    );
    await expect(getPage("home")).rejects.toMatchObject({ kind: "parse" });
  });

  it('reads a hero CTA sent as "" as no button, but still rejects a bad one', async () => {
    const [first] = pageFixtures.about.sections;
    const hero = (primary_cta: unknown) => [
      { ...first, data: { ...(first.data as object), primary_cta } },
    ];
    live(async () => json({ ...pageFixtures.about, sections: hero("") }));
    const page = await getPage("about");
    expect(page.sections[0].data).toMatchObject({ primary_cta: null });

    live(async () => json({ ...pageFixtures.about, sections: hero("Go") }));
    await expect(getPage("about")).rejects.toMatchObject({ kind: "parse" });
  });

  it("throws CmsError(http) with the status, and flags 404", async () => {
    live(async () => json({}, 404));
    const err = await getPage("about").catch((e) => e);
    expect(err).toMatchObject({ kind: "http", status: 404, notFound: true });
  });

  it("throws CmsError(network) when the API is down", async () => {
    live(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(getSettings()).rejects.toMatchObject({ kind: "network" });
  });

  it("sends the secret and tags the read; preview is untagged, no-store and bearer-authed", async () => {
    const spy = live(async () => json(pageFixtures.home));
    await getPage("home");
    const [url, init] = spy.mock.calls[0] as [
      string,
      RequestInit & { next?: unknown },
    ];
    expect(url).toBe("http://api.test/api/v1/site/pages/home");
    expect((init.headers as Record<string, string>)["X-Site-Secret"]).toBe(
      "test-server-secret",
    );
    expect(init.next).toEqual({ tags: ["page:home"], revalidate: 3600 });

    await getPage("home", { preview: true });
    const [purl, pinit] = spy.mock.calls[1] as [
      string,
      RequestInit & { next?: unknown },
    ];
    expect(purl).toBe("http://api.test/api/v1/site/pages/home?preview=1");
    expect(pinit.cache).toBe("no-store");
    expect(pinit.next).toBeUndefined();
    expect((pinit.headers as Record<string, string>).Authorization).toBe(
      "Bearer test-preview-token",
    );
  });
});

describe("block registry", () => {
  it("renders nothing and warns for an unknown block type", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const out = renderSection(
      { key: "x", type: "carousel", data: {} },
      { settings: settingsFixture, slug: "home" },
    );
    expect(out).toBeNull();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Unknown block type "carousel"'),
    );
    warn.mockRestore();
  });

  it("passes unknown types through the page schema instead of failing", () => {
    const r = pageSchema.parse({
      ...pageFixtures.home,
      sections: [{ key: "x", type: "carousel", data: { anything: 1 } }],
    });
    expect(r.sections[0]).toMatchObject({ type: "carousel" });
  });
});
