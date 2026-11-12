import "server-only";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CmsError } from "./errors";
import { getPage } from "./queries";
import type { Page, PageSlug } from "./schemas";

/** Loads a page for a route: draft content in draft mode, 404 when the API says so. */
export async function loadPage(slug: PageSlug): Promise<Page> {
  const { isEnabled } = await draftMode();
  try {
    return await getPage(slug, { preview: isEnabled });
  } catch (e) {
    if (e instanceof CmsError && e.notFound) notFound();
    throw e;
  }
}

export async function pageMetadata(
  slug: PageSlug,
  path: string,
): Promise<Metadata> {
  const { seo } = await loadPage(slug);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: path,
      ...(seo.og_image_url && { images: [seo.og_image_url] }),
    },
  };
}
