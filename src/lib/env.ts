import "server-only";
import { z } from "zod";

// With CMS_FIXTURES=1 the API is never called, so its URL and secret are optional.
function buildSchema(fixtures: boolean) {
  const api = fixtures ? z.string().default("") : z.string().min(1);
  return z.object({
    API_BASE_URL: fixtures ? api : api.pipe(z.url()),
    SITE_SERVER_SECRET: api,
    SITE_REVALIDATE_SECRET: z.string().min(1),
    SITE_PREVIEW_TOKEN: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  });
}

export type Env = z.infer<ReturnType<typeof buildSchema>>;

// Dev and tests only. A production build must also set CMS_FIXTURES_IN_PROD=1 (e2e does), so a stray
// CMS_FIXTURES=1 in a real deployment cannot silently serve fixture copy. Same rule in next.config.ts.
export const fixturesEnabled = () =>
  process.env.CMS_FIXTURES === "1" &&
  (process.env.NODE_ENV !== "production" ||
    process.env.CMS_FIXTURES_IN_PROD === "1");

/** Validated env. Throws one clear message listing every missing or bad variable. */
export function env(): Env {
  const parsed = buildSchema(fixturesEnabled()).safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (i) => `  - ${i.path.join(".")}: ${i.message}`,
    );
    throw new Error(
      `Invalid environment. Fix these in .env.local (see .env.example):\n${lines.join("\n")}`,
    );
  }
  return parsed.data;
}
