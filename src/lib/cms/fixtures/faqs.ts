import type { Faqs } from "../schemas";
import faqs from "./faqs.json";

// Snapshot of GET /api/v1/site/faqs?audience=...
export const faqFixtures = faqs as unknown as Record<Faqs["audience"], Faqs>;
