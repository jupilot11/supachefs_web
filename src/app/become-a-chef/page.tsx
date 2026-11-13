import { Sections } from "@/components/blocks/registry";
import { Section, SectionHeader } from "@/components/blocks/shared";
import { Reveal } from "@/components/motion/reveal";
import { ChefLeadForm } from "@/features/chef-lead/form";
import { getSettings } from "@/lib/cms";
import { loadPage, pageMetadata } from "@/lib/cms/route";
import { env } from "@/lib/env";

export const generateMetadata = () =>
  pageMetadata("become-a-chef", "/become-a-chef");

// The seeder has no section for the form's intro (CONTRACT gap), so the design copy is the fallback.
// If an admin-editable rich_text section with key "apply" is added later, it wins.
const fallbackIntro = {
  eyebrow: "Application",
  title: "Tell us about you and your cooking",
  paragraphs: [
    "No essays, no menus yet. Just enough for us to call you. A real person from our Cebu team reads every application.",
  ],
};

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
        <Reveal className="flex flex-col gap-4">
          <SectionHeader eyebrow={intro.eyebrow} title={intro.title} />
          {intro.paragraphs.map((p) => (
            <p key={p} className="text-secondary lg:text-lg">
              {p}
            </p>
          ))}
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
