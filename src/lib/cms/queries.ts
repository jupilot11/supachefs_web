import "server-only";
import { fixturesEnabled } from "../env";
import { cmsFetch, parse } from "./client";
import {
  faqsSchema,
  legalSchema,
  pageSchema,
  settingsSchema,
  type Audience,
  type Faqs,
  type Legal,
  type LegalPage,
  type Page,
  type PageSlug,
  type Settings,
} from "./schemas";
import {
  faqFixtures,
  legalFixtures,
  pageFixtures,
  settingsFixture,
} from "./fixtures";
import { CmsError } from "./errors";

// Fixtures run through the same parser as live data, so they cannot drift from the schemas.

export async function getSettings(): Promise<Settings> {
  if (fixturesEnabled())
    return parse(settingsSchema, settingsFixture, "settings");
  return cmsFetch("/api/v1/site/settings", settingsSchema, { tag: "settings" });
}

export async function getPage(
  slug: PageSlug,
  { preview = false }: { preview?: boolean } = {},
): Promise<Page> {
  if (fixturesEnabled()) {
    const raw = pageFixtures[slug];
    if (!raw) throw new CmsError("http", `No fixture for ${slug}`, 404);
    return parse(pageSchema, raw, `page ${slug}`);
  }
  const path = `/api/v1/site/pages/${slug}${preview ? "?preview=1" : ""}`;
  return cmsFetch(path, pageSchema, { tag: `page:${slug}`, preview });
}

export async function getFaqs(audience: Audience): Promise<Faqs> {
  if (fixturesEnabled())
    return parse(faqsSchema, faqFixtures[audience], "faqs");
  return cmsFetch(`/api/v1/site/faqs?audience=${audience}`, faqsSchema, {
    tag: "faqs",
  });
}

export async function getLegal(page: LegalPage): Promise<Legal> {
  if (fixturesEnabled())
    return parse(legalSchema, legalFixtures[page], `legal ${page}`);
  return cmsFetch(`/api/legal/${page}`, legalSchema, { tag: "legal" });
}
