import { Check } from "lucide-react";
import { Sections } from "@/components/blocks/registry";
import { Photo, Section, SectionHeader } from "@/components/blocks/shared";
import { Reveal } from "@/components/motion/reveal";
import { ChefLeadForm } from "@/features/chef-lead/form";
import { getSettings } from "@/lib/cms";
import { loadPage, pageMetadata } from "@/lib/cms/route";
import { env } from "@/lib/env";

export const generateMetadata = () =>
  pageMetadata("become-a-chef", "/become-a-chef");

// The seeder has no section for the form's intro (CONTRACT gap), so the design copy is the fallback.
// An admin-editable rich_text section with key "apply" (eyebrow, title, paragraphs, image_url) wins.
const fallbackIntro = {
  eyebrow: "Application",
  title: "Tell us about you and your cooking",
  paragraphs: [
    "No essays, no menus yet. Just enough for us to call you. A real person from our Cebu team reads every application.",
  ],
  image_url: null as string | null | undefined,
  points: undefined as { title: string; body: string }[] | undefined,
};
// Shown until the admin sets a photo on the "apply" section.
const defaultImage = "/images/trust-and-safety.jpg";

// The ticked list under the photo, until an admin saves a `points` list on the "apply" section ([] hides it).
const reassurance = [
  {
    title: "A 10-minute form",
    body: "Rough answers are fine. You can change them anytime.",
  },
  {
    title: "We text you within 3 days",
    body: "Then a short, friendly call. No test.",
  },
  {
    title: "No commitment",
    body: "Applying doesn’t commit you to anything.",
  },
];

export default async function Page() {
  const [page, settings] = await Promise.all([
    loadPage("become-a-chef"),
    getSettings(),
  ]);
  const apply = page.sections.find(
    (s) => s.key === "apply" && s.type === "rich_text",
  );
  const intro =
    (apply?.data as typeof fallbackIntro | undefined) ?? fallbackIntro;
  const points = intro.points ?? reassurance;
  const sections = page.sections.filter((s) => s !== apply);
  // The form sits before the FAQ preview (or at the end).
  const at = sections.findIndex((s) => s.type === "faq_preview");
  const split = at === -1 ? sections.length : at;

  return (
    <>
      <Sections
        sections={sections.slice(0, split)}
        settings={settings}
        slug="become-a-chef"
      />
      <Section
        id="apply"
        className="bg-off-white"
        inner="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-20"
      >
        {/* Pinned so the left side is never empty while the long form scrolls. */}
        <Reveal className="flex flex-col gap-4 lg:sticky lg:top-28">
          <SectionHeader eyebrow={intro.eyebrow} title={intro.title} />
          {intro.paragraphs.map((p) => (
            <p key={p} className="text-secondary lg:text-lg">
              {p}
            </p>
          ))}
          <Photo
            src={intro.image_url || defaultImage}
            alt=""
            sizes="(min-width:1024px) 480px, 100vw"
            zoom={false}
            className="mt-2 hidden aspect-[4/3] rounded-[18px] lg:block"
          />
          <ul
            className="mt-2 flex flex-col gap-4 empty:hidden lg:gap-[18px]"
            data-testid="apply-points"
          >
            {points.map((r, i) => (
              <li key={`${i}-${r.title}`} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-[22px] flex-none place-items-center rounded-full bg-brand text-white lg:size-6"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-bold text-primary lg:text-lg">
                    {r.title}
                  </h3>
                  <p className="text-sm leading-[1.55] text-secondary lg:text-base">
                    {r.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <ChefLeadForm
          areas={settings.chef_form.areas}
          heardFrom={settings.chef_form.heard_from}
          siteKey={env().NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          helpHref={settings.contact.messenger_url}
        />
      </Section>
      <Sections
        sections={sections.slice(split)}
        settings={settings}
        slug="become-a-chef"
      />
    </>
  );
}
