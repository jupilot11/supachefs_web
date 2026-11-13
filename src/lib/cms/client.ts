import "server-only";
import type { z } from "zod";
import { env } from "../env";
import { CmsError } from "./errors";

export type CmsTag =
  | `page:${string}`
  | "faqs"
  | "settings"
  | "legal"
  | "top-chefs"
  | "testimonials";

// `revalidate` is seconds: CMS content is refreshed on demand (tags), live data (chefs, reviews) by time.
type Options = { tag: CmsTag; preview?: boolean; revalidate?: number };

/**
 * The one place that talks to the Laravel API. Sends X-Site-Secret on every
 * read (the API skips its rate limit for it). Preview reads are never cached
 * or tagged and carry the draft token.
 */
export async function cmsFetch<S extends z.ZodType>(
  path: string,
  schema: S,
  { tag, preview = false, revalidate = 3600 }: Options,
): Promise<z.output<S>> {
  const e = env();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Site-Secret": e.SITE_SERVER_SECRET,
  };
  // Generous: `next build` prerenders on several workers. Next drops the signal when it
  // revalidates in the background, so only foreground reads are bounded.
  const signal = AbortSignal.timeout(15_000);
  let init: RequestInit & { next?: { tags?: string[]; revalidate?: number } };
  if (preview) {
    headers.Authorization = `Bearer ${e.SITE_PREVIEW_TOKEN}`;
    init = { headers, cache: "no-store", signal };
  } else {
    init = { headers, signal, next: { tags: [tag], revalidate } };
  }

  const url = new URL(path, e.API_BASE_URL).toString();
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (cause) {
    throw new CmsError("network", `CMS unreachable: ${path}`, undefined, {
      cause,
    });
  }
  if (!res.ok) {
    throw new CmsError("http", `CMS ${res.status} for ${path}`, res.status);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (cause) {
    throw new CmsError(
      "parse",
      `CMS sent invalid JSON for ${path}`,
      undefined,
      {
        cause,
      },
    );
  }
  return parse(schema, json, path);
}

export function parse<S extends z.ZodType>(
  schema: S,
  json: unknown,
  label: string,
): z.output<S> {
  const result = schema.safeParse(json);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new CmsError(
      "parse",
      `CMS payload for ${label} is invalid: ${detail}`,
    );
  }
  return result.data;
}
