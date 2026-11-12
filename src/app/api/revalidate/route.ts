import { revalidateTag } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";
import { safeEqual } from "@/lib/safe-equal";

const body = z.object({
  tags: z
    .array(
      z.union([
        z.enum(["faqs", "settings", "legal"]),
        z.string().regex(/^page:[a-z0-9-]+$/),
      ]),
    )
    .min(1),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret") ?? "";
  if (!safeEqual(secret, env().SITE_REVALIDATE_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  // expire: 0 so the very next load is fresh, not stale-while-revalidate.
  for (const tag of parsed.data.tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: parsed.data.tags });
}
