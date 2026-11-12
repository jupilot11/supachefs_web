import { createHmac } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { PAGE_PATHS } from "@/lib/cms/paths";
import { PAGE_SLUGS, type PageSlug } from "@/lib/cms/schemas";
import { env } from "@/lib/env";
import { safeEqual } from "@/lib/safe-equal";

const unauthorized = () =>
  Response.json({ error: "Unauthorized" }, { status: 401 });

/**
 * Signed preview link (CONTRACT.md): sig = hex HMAC-SHA256("{slug}|{exp}") keyed with
 * SITE_PREVIEW_TOKEN, exp in the future. A bare /api/draft never enables drafts.
 * /api/draft?exit=1 leaves draft mode.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  if (params.get("exit") === "1") {
    (await draftMode()).disable();
    redirect("/");
  }

  const slug = params.get("slug") ?? "";
  const exp = params.get("exp") ?? "";
  const sig = params.get("sig") ?? "";

  if (!(PAGE_SLUGS as readonly string[]).includes(slug)) return unauthorized();
  if (!/^\d+$/.test(exp) || Number(exp) <= Date.now() / 1000)
    return unauthorized();

  const expected = createHmac("sha256", env().SITE_PREVIEW_TOKEN)
    .update(`${slug}|${exp}`)
    .digest("hex");
  if (!safeEqual(sig, expected)) return unauthorized();

  (await draftMode()).enable();
  redirect(PAGE_PATHS[slug as PageSlug]);
}
