import { RevealItem, RevealList } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import { Photo, Section, SectionHeader } from "./shared";

export function Chefs({ id, data }: { id: string; data: BlockData<"chefs"> }) {
  return (
    <Section id={id} inner="flex flex-col gap-6 lg:gap-10">
      <SectionHeader eyebrow={data.eyebrow} title={data.title} />
      <RevealList as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((c) => (
          <RevealItem
            key={`${c.name}-${c.area}`}
            as="li"
            className="flex flex-col gap-3 rounded-[14px] border border-sand-light bg-white p-5"
          >
            <Photo
              src={c.image_url}
              alt={`${c.name}, home chef in ${c.area}`}
              sizes="(min-width:1024px) 360px, 100vw"
              className="h-48 rounded-xl"
            />
            <h3 className="text-xl font-bold text-primary">
              {c.name}{" "}
              <span className="text-base font-medium text-secondary">
                · {c.area}
              </span>
            </h3>
            <p className="text-sm font-semibold text-orange-dark">
              {[c.cuisine, c.dish].filter(Boolean).join(" · ")}
            </p>
            {c.story && <p className="text-secondary">{c.story}</p>}
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
