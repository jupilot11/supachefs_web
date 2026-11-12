import { getFaqs } from "@/lib/cms";
import type { BlockData } from "@/lib/cms/schemas";
import { FaqAccordion } from "./faq-accordion";
import { Section } from "./shared";

export async function FaqPreview({
  id,
  data,
}: {
  id: string;
  data: BlockData<"faq_preview">;
}) {
  const faqs = await getFaqs(data.audience);
  const items = faqs.groups.flatMap((g) => g.items).slice(0, data.limit);
  const chefs = data.audience === "chefs";

  return (
    <Section id={id} inner="grid gap-5 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
      <div className="flex flex-col items-start gap-2 lg:gap-3">
        <h2 className="text-2xl leading-[1.2] font-bold tracking-[-0.015em] text-primary lg:text-4xl">
          {data.title}
        </h2>
        <a
          href={chefs ? "/faqs#chefs" : "/faqs"}
          className="inline-flex min-h-11 items-center text-[15px] font-semibold text-orange-dark hover:underline"
        >
          {chefs ? "All chef FAQs →" : "All customer FAQs →"}
        </a>
      </div>
      <FaqAccordion items={items} />
    </Section>
  );
}
