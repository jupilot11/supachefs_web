import { z } from "zod";

// Links come from the CMS. React 19 already blocks javascript: hrefs; this states what we accept.
// An unset store or social link may arrive as "" and means null.
const url = z
  .union([z.literal(""), z.string().regex(/^https?:\/\//)])
  .nullable()
  .transform((v) => v || null);
// Page-level CTA links: a site path, #anchor, absolute http(s), mailto or tel. Not "//host".
const href = z
  .string()
  .regex(/^(?:|https?:\/\/.+|\/(?!\/).*|#.*|mailto:.+|tel:.+)$/);

export const settingsSchema = z.object({
  store: z.object({ app_store_url: url, play_store_url: url }),
  social: z.object({
    facebook_url: url,
    instagram_url: url,
    tiktok_url: url,
  }),
  contact: z.object({ email: z.string().nullable(), messenger_url: url }),
  chef_form: z.object({
    areas: z.array(z.string()),
    heard_from: z.array(z.string()),
  }),
  platform_fee_percent: z.number(),
});
export type Settings = z.infer<typeof settingsSchema>;

// ---- Blocks (CONTRACT.md "Block types") ----

const str = z.string();
const image = z.string().nullish();
const cta = z.object({ label: str, href });
const nullableCta = cta.nullish();

export const heroSchema = z.object({
  eyebrow: str,
  title: str,
  body: str,
  primary_cta: nullableCta,
  secondary_cta: nullableCta,
  image_url: image,
  image_caption: str,
});

export const stepsSchema = z.object({
  eyebrow: str,
  title: str,
  body: str,
  items: z.array(
    z.object({
      title: str,
      body: str,
      chips: z.array(str),
      image_url: image,
    }),
  ),
});

export const cardsSchema = z.object({
  eyebrow: str,
  title: str,
  body: str,
  items: z.array(z.object({ icon: str, title: str, body: str })),
  // Added after launch: published pages saved earlier have neither key.
  image_url: image,
  link: nullableCta,
});

export const comparisonSchema = z.object({
  eyebrow: str,
  title: str,
  body: str,
  us_label: str,
  them_label: str,
  rows: z.array(z.object({ label: str, us: str, them: str })),
});

export const quoteSchema = z.object({
  text: str,
  author: str,
  author_meta: str,
  attribution: str,
});

export const chefsSchema = z.object({
  eyebrow: str,
  title: str,
  items: z.array(
    z.object({
      name: str,
      area: str,
      cuisine: str,
      dish: str,
      story: str,
      image_url: image,
    }),
  ),
});

export const richTextSchema = z.object({
  eyebrow: str,
  title: str,
  paragraphs: z.array(str),
});

export const earningsSchema = z.object({
  eyebrow: str,
  title: str,
  body: str,
  rows: z.array(z.object({ label: str, value: str })),
  payout_schedule: str,
  payout_method: str,
});

export const faqPreviewSchema = z.object({
  title: str,
  audience: z.enum(["customers", "chefs"]),
  limit: z.number().int().positive(),
});

export const ctaSchema = z.object({
  eyebrow: str,
  title: str,
  body: str,
  primary_cta: cta,
  secondary_cta: nullableCta,
  image_url: image,
});

export const blockSchemas = {
  hero: heroSchema,
  steps: stepsSchema,
  cards: cardsSchema,
  comparison: comparisonSchema,
  quote: quoteSchema,
  chefs: chefsSchema,
  rich_text: richTextSchema,
  earnings: earningsSchema,
  faq_preview: faqPreviewSchema,
  cta: ctaSchema,
} as const;

export type BlockType = keyof typeof blockSchemas;
export type BlockData<T extends BlockType> = z.infer<(typeof blockSchemas)[T]>;

export type Block = {
  [T in BlockType]: { key: string; type: T; data: BlockData<T> };
}[BlockType];
export type UnknownBlock = { key: string; type: string; data: unknown };
export type Section = Block | UnknownBlock;

/**
 * A known type with bad data fails the whole page (CmsError); an unknown type
 * passes through untouched so the renderer can skip it and warn.
 */
const sectionSchema = z
  .object({ key: str, type: str, data: z.unknown() })
  .transform((s, ctx): Section => {
    if (!(s.type in blockSchemas)) return s;
    const schema = blockSchemas[s.type as BlockType];
    const result = schema.safeParse(s.data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({
          code: "custom",
          path: ["data", ...issue.path],
          message: `section "${s.key}" (${s.type}): ${issue.message}`,
        });
      }
      return z.NEVER;
    }
    return { key: s.key, type: s.type, data: result.data } as Block;
  });

export const pageSchema = z.object({
  slug: str,
  title: str,
  seo: z.object({
    title: str,
    description: str,
    og_image_url: z.string().nullish(),
  }),
  sections: z.array(sectionSchema),
  updated_at: str,
});
export type Page = z.infer<typeof pageSchema>;

export const faqsSchema = z.object({
  audience: z.enum(["customers", "chefs"]),
  groups: z.array(
    z.object({
      topic: str,
      items: z.array(z.object({ id: z.number(), question: str, answer: str })),
    }),
  ),
});
export type Faqs = z.infer<typeof faqsSchema>;
export type Audience = Faqs["audience"];

export const legalSchema = z.object({
  title: str,
  content: str,
  updated_at: z.string().nullish(),
});
export type Legal = z.infer<typeof legalSchema>;
export type LegalPage = "terms" | "privacy";

// ---- Live data: real chefs and reviews from the app, never CMS copy ----
const photo = z
  .string()
  .regex(/^https?:\/\//)
  .nullable();

export const topChefsSchema = z.object({
  chefs: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1),
      area: z.string().nullable(),
      cuisine: z.string().nullable(),
      story: z.string().nullable(),
      image_url: photo,
      rating: z.number().nullable(),
      reviews: z.number(),
    }),
  ),
});
export type TopChef = z.infer<typeof topChefsSchema>["chefs"][number];

export const testimonialsSchema = z.object({
  testimonials: z.array(
    z.object({
      id: z.number(),
      text: z.string().min(1),
      rating: z.number(),
      author: z.string().min(1),
      chef: z.string().nullable(),
      area: z.string().nullable(),
      dish: z.string().nullable(),
      created_at: z.string(),
    }),
  ),
});
export type Testimonial = z.infer<
  typeof testimonialsSchema
>["testimonials"][number];

export const PAGE_SLUGS = [
  "home",
  "how-it-works-customers",
  "how-it-works-chefs",
  "become-a-chef",
  "about",
] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];
