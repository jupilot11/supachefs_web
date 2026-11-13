import "server-only";
import { fixturesEnabled } from "../env";
import { cmsFetch, parse } from "./client";
import {
  faqsSchema,
  legalSchema,
  pageSchema,
  settingsSchema,
  testimonialsSchema,
  topChefsSchema,
  type Audience,
  type Faqs,
  type Legal,
  type LegalPage,
  type Page,
  type PageSlug,
  type Settings,
  type Testimonial,
  type TopChef,
} from "./schemas";
import {
  faqFixtures,
  legalFixtures,
  pageFixtures,
  settingsFixture,
  testimonialsFixture,
  topChefsFixture,
} from "./fixtures";
import { CmsError } from "./errors";
import { dropPlaceholders } from "./placeholders";

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
    return dropPlaceholders(parse(pageSchema, raw, `page ${slug}`));
  }
  const path = `/api/v1/site/pages/${slug}${preview ? "?preview=1" : ""}`;
  const page = await cmsFetch(path, pageSchema, {
    tag: `page:${slug}`,
    preview,
  });
  // Editors previewing a draft still see their to-do notes; visitors never do.
  return preview ? page : dropPlaceholders(page);
}

export async function getFaqs(audience: Audience): Promise<Faqs> {
  const faqs = fixturesEnabled()
    ? parse(faqsSchema, faqFixtures[audience], "faqs")
    : await cmsFetch(`/api/v1/site/faqs?audience=${audience}`, faqsSchema, {
        tag: "faqs",
      });
  return dropPlaceholders(faqs);
}

export async function getLegal(page: LegalPage): Promise<Legal> {
  if (fixturesEnabled())
    return parse(legalSchema, legalFixtures[page], `legal ${page}`);
  return cmsFetch(`/api/legal/${page}`, legalSchema, { tag: "legal" });
}

// Live data: refreshed every 5 minutes. Nothing to show, or the API failing, gives [] so the section hides
// instead of breaking the whole page.
const LIVE_REVALIDATE = 300;
const LIVE_LIMIT = 5;

export async function getTopChefs(): Promise<TopChef[]> {
  try {
    const data = fixturesEnabled()
      ? parse(topChefsSchema, topChefsFixture, "top chefs")
      : await cmsFetch("/api/v1/site/top-chefs", topChefsSchema, {
          tag: "top-chefs",
          revalidate: LIVE_REVALIDATE,
        });
    return data.chefs.slice(0, LIVE_LIMIT);
  } catch (e) {
    console.warn("[cms] top chefs unavailable, section hidden:", e);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = fixturesEnabled()
      ? parse(testimonialsSchema, testimonialsFixture, "testimonials")
      : await cmsFetch("/api/v1/site/testimonials", testimonialsSchema, {
          tag: "testimonials",
          revalidate: LIVE_REVALIDATE,
        });
    return data.testimonials.slice(0, LIVE_LIMIT);
  } catch (e) {
    console.warn("[cms] testimonials unavailable, section hidden:", e);
    return [];
  }
}
