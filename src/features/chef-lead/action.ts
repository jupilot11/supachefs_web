"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getSettings } from "@/lib/cms";
import { env } from "@/lib/env";
import {
  chefLeadSchema,
  MESSAGES,
  type ChefLeadState,
  type FieldErrors,
} from "./schema";

const laravelErrors = z.object({
  message: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

const error = (message: string, fieldErrors?: FieldErrors): ChefLeadState => ({
  status: "error",
  message,
  fieldErrors,
});

export async function submitChefLead(
  _prev: ChefLeadState,
  formData: FormData,
): Promise<ChefLeadState> {
  const parsed = chefLeadSchema.safeParse({
    full_name: formData.get("full_name") ?? "",
    mobile: formData.get("mobile") ?? "",
    email: formData.get("email") ?? "",
    area: formData.get("area") ?? "",
    cooks: formData.get("cooks") ?? "",
    days: formData.getAll("days"),
    heard_from: formData.get("heard_from") ?? "",
    turnstile_token: formData.get("cf-turnstile-response") ?? "",
  });
  const fieldErrors: FieldErrors = parsed.success
    ? {}
    : z.flattenError(parsed.error).fieldErrors;

  // area and heard_from must come from the admin-managed lists.
  const { chef_form } = await getSettings();
  const data = parsed.success ? parsed.data : null;
  if (data && !chef_form.areas.includes(data.area))
    fieldErrors.area = ["Choose your area."];
  if (data && !chef_form.heard_from.includes(data.heard_from))
    fieldErrors.heard_from = ["Choose one."];
  if (!data || Object.keys(fieldErrors).length) {
    return error(MESSAGES.invalid, fieldErrors);
  }

  const e = env();
  // Leftmost x-forwarded-for is the visitor; Laravel trusts it only with our secret.
  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  const clientIp = forwarded.split(",")[0]?.trim() ?? "";

  let res: Response;
  try {
    res = await fetch(new URL("/api/v1/site/chef-leads", e.API_BASE_URL), {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Site-Secret": e.SITE_SERVER_SECRET,
        "X-Client-IP": clientIp,
      },
      body: JSON.stringify({ ...data, email: data.email || undefined }),
    });
  } catch {
    return error(MESSAGES.network);
  }

  if (res.status === 201) return { status: "success" };
  if (res.status === 429) return error(MESSAGES.rateLimited);
  if (res.status === 422) {
    const body = laravelErrors.safeParse(await res.json().catch(() => null));
    const errs = body.success ? body.data.errors : undefined;
    return error(
      (body.success && body.data.message) || MESSAGES.invalid,
      errs ?? { _form: [MESSAGES.invalid] },
    );
  }
  // 5xx, 503 (Turnstile unreachable) and anything unexpected.
  return error(MESSAGES.network);
}
