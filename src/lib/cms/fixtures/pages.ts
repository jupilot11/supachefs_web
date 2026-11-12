// Offline copy for CMS_FIXTURES=1: a snapshot of GET /api/v1/site/pages/{slug} from the seeded
// Laravel app (copy from website-plan/design-reference). Raw API-shaped JSON: lib/cms parses it
// through the same Zod schemas as live data. Refresh with the curl loop in README.md.
import type { z } from "zod";
import type { pageSchema, PageSlug } from "../schemas";
import pages from "./pages.json";

export const pageFixtures = pages as unknown as Record<
  PageSlug,
  z.input<typeof pageSchema>
>;
