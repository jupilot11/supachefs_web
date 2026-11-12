import type { Legal, LegalPage } from "../schemas";

// Real text lives in the admin; these stand-ins keep the routes testable offline.
export const legalFixtures: Record<LegalPage, Legal> = {
  terms: {
    title: "Terms",
    content:
      "[Placeholder: Terms text is managed in the SupaChefs admin.]\n\n[Placeholder: second paragraph.]",
    updated_at: "2026-11-12T08:00:00+08:00",
  },
  privacy: {
    title: "Privacy Policy",
    content:
      "[Placeholder: Privacy Policy text is managed in the SupaChefs admin.]\n\n[Placeholder: second paragraph.]",
    updated_at: "2026-11-12T08:00:00+08:00",
  },
};
