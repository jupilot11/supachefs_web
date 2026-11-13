import { Reveal } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import { Eyebrow, Section, SectionHeader } from "./shared";

export function RichText({
  id,
  data,
}: {
  id: string;
  data: BlockData<"rich_text">;
}) {
  if (id === "mission") {
    return (
      <Section
        id={id}
        className="bg-orange-wash"
        inner="flex flex-col gap-4 lg:gap-6"
      >
        <Reveal className="flex max-w-3xl flex-col gap-4 lg:gap-6">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className="font-serif text-[28px] leading-[1.25] font-semibold tracking-[-0.01em] text-balance text-primary italic lg:text-5xl lg:leading-[1.15]">
            {data.title}
          </h2>
          {data.paragraphs.map((p, idx) => (
            <p key={`${idx}-${p}`} className="text-secondary lg:text-lg">
              {p}
            </p>
          ))}
        </Reveal>
      </Section>
    );
  }
  return (
    <Section id={id} inner="flex flex-col gap-4 lg:gap-6">
      <SectionHeader eyebrow={data.eyebrow} title={data.title} />
      <Reveal className="flex max-w-2xl flex-col gap-4">
        {data.paragraphs.map((p, idx) => (
          <p key={`${idx}-${p}`} className="text-secondary lg:text-lg">
            {p}
          </p>
        ))}
      </Reveal>
    </Section>
  );
}
