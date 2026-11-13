import { Fragment, type ReactNode } from "react";
import type { Section, Settings } from "@/lib/cms/schemas";
import { blockSchemas } from "@/lib/cms/schemas";
import { Cards } from "./cards";
import { Chefs } from "./chefs";
import { Comparison } from "./comparison";
import { Cta } from "./cta";
import { Earnings } from "./earnings";
import { FaqPreview } from "./faq-preview";
import { Hero } from "./hero";
import { LiveChefs } from "./live-chefs";
import { LiveTestimonials } from "./live-testimonials";
import { Quote } from "./quote";
import { RichText } from "./rich-text";
import { Steps } from "./steps";

type Ctx = { settings: Settings; slug: string };

// Layout variants the seeder fixes per page section ("slug/key"); anything not listed uses the
// block's default look. Keys alone collide (home and customers both have "trust").
const variants: Record<string, string> = {
  "how-it-works-customers/steps": "phones",
  "home/trust": "checklist",
  "home/chef_cta": "band",
  "home/download": "download",
  "how-it-works-customers/cta": "download",
  "how-it-works-chefs/handles": "checklist",
  "become-a-chef/requirements": "checklist",
  "become-a-chef/after": "timeline",
  "about/hero": "banner",
  "about/values": "numbered",
};
// Each entry receives the section key as `id` plus its parsed data (already validated by lib/cms).
type Renderer = (
  id: string,
  data: never,
  ctx: Ctx,
  variant?: string,
) => ReactNode;

export const registry: Record<keyof typeof blockSchemas, Renderer> = {
  hero: (id, data, { settings }, variant) => (
    <Hero id={id} data={data} settings={settings} variant={variant} />
  ),
  steps: (id, data, _c, variant) => (
    <Steps id={id} data={data} variant={variant} />
  ),
  cards: (id, data, _c, variant) => (
    <Cards id={id} data={data} variant={variant} />
  ),
  comparison: (id, data) => <Comparison id={id} data={data} />,
  quote: (id, data) => <Quote id={id} data={data} />,
  chefs: (id, data) => <Chefs id={id} data={data} />,
  rich_text: (id, data) => <RichText id={id} data={data} />,
  earnings: (id, data, { settings }) => (
    <Earnings id={id} data={data} settings={settings} />
  ),
  faq_preview: (id, data) => <FaqPreview id={id} data={data} />,
  cta: (id, data, { settings }, variant) => (
    <Cta id={id} data={data} settings={settings} variant={variant} />
  ),
};

// Sections filled with real data from the API ("slug/key"). The CMS keeps their place in the page but its
// content for them is ignored: chefs and reviews are never written by hand.
const live: Record<string, (id: string) => ReactNode> = {
  "home/chefs": (id) => <LiveChefs id={id} />,
  "home/testimonial": (id) => <LiveTestimonials id={id} />,
};

/** Unknown block types render nothing and log a warning on the server. */
export function renderSection(section: Section, ctx: Ctx): ReactNode {
  const fromApi = live[`${ctx.slug}/${section.key}`];
  if (fromApi) return fromApi(section.key);
  const render = (registry as Record<string, Renderer | undefined>)[
    section.type
  ];
  if (!render) {
    console.warn(
      `[cms] Unknown block type "${section.type}" (section "${section.key}") skipped.`,
    );
    return null;
  }
  return render(
    section.key,
    section.data as never,
    ctx,
    variants[`${ctx.slug}/${section.key}`],
  );
}

export function Sections({
  sections,
  settings,
  slug,
}: {
  sections: Section[];
  settings: Settings;
  slug: string;
}) {
  return sections.map((s) => (
    <Fragment key={s.key}>{renderSection(s, { settings, slug })}</Fragment>
  ));
}
