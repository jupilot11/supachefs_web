import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSettings } from "@/lib/cms";
import { settingsFixture } from "@/lib/cms/fixtures";
import { loadPage } from "@/lib/cms/route";
import Page from "./page";

vi.mock("@/lib/cms", () => ({ getSettings: vi.fn() }));
vi.mock("@/lib/cms/route", () => ({
  loadPage: vi.fn(),
  pageMetadata: vi.fn(),
}));
vi.mock("@/lib/env", () => ({
  env: () => ({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test-key" }),
}));

afterEach(() => vi.clearAllMocks());

/** The page with only its `apply` section, so no async block renders beside it. */
async function apply(extra: object) {
  vi.mocked(getSettings).mockResolvedValue(settingsFixture);
  vi.mocked(loadPage).mockResolvedValue({
    sections: [
      {
        key: "apply",
        type: "rich_text",
        data: { eyebrow: "", title: "T", paragraphs: [], ...extra },
      },
    ],
  } as never);
  return renderToStaticMarkup(await Page());
}
// The list's own markup: the form beside it has no <li>.
const list = (html: string) =>
  /<ul[^>]*data-testid="apply-points">([\s\S]*?)<\/ul>/.exec(html)?.[1] ?? "";

describe("become-a-chef apply points", () => {
  it("shows the points the admin set, not the built-in three", async () => {
    const html = await apply({
      points: [{ title: "Free to apply", body: "No fee, ever." }],
    });
    expect(list(html)).toContain("Free to apply");
    expect(list(html)).toContain("No fee, ever.");
    expect(html).not.toContain("A 10-minute form");
  });

  it("falls back to the three it always showed when the section has no points", async () => {
    const html = await apply({});
    for (const t of [
      "A 10-minute form",
      "We text you within 3 days",
      "No commitment",
    ])
      expect(list(html)).toContain(t);
  });

  it("shows no list when the admin emptied it", async () => {
    const html = await apply({ points: [] });
    expect(html).toContain('data-testid="apply-points"');
    expect(list(html)).toBe("");
    expect(html).not.toContain("A 10-minute form");
  });
});
