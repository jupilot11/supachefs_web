import { getSettings } from "@/lib/cms";
import { loadPage } from "@/lib/cms/route";
import type { PageSlug } from "@/lib/cms/schemas";
import { Sections } from "./registry";

/** Renders one CMS page: its sections, in the order the API sends them. */
export async function CmsPage({ slug }: { slug: PageSlug }) {
  const [page, settings] = await Promise.all([loadPage(slug), getSettings()]);
  return <Sections sections={page.sections} settings={settings} slug={slug} />;
}
