import { Reveal } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import { Section } from "./shared";

export function Quote({ id, data }: { id: string; data: BlockData<"quote"> }) {
  return (
    <Section
      id={id}
      className="bg-off-white lg:py-24"
      inner="flex flex-col items-start gap-5 lg:items-center lg:gap-7 lg:text-center"
    >
      <Reveal className="flex flex-col items-start gap-5 lg:items-center lg:gap-7">
        <span
          aria-hidden="true"
          className="text-[56px] leading-[0.6] font-extrabold text-brand lg:text-[80px]"
        >
          “
        </span>
        <figure className="flex flex-col gap-5 lg:items-center lg:gap-7">
          <blockquote className="max-w-[860px] font-serif text-2xl leading-[1.35] font-normal tracking-[-0.01em] text-balance text-primary italic lg:text-[40px] lg:leading-[1.25]">
            <p>{data.text}</p>
          </blockquote>
          <figcaption className="flex items-center gap-3 text-left text-sm lg:gap-3.5 lg:text-[15px]">
            <span
              aria-hidden="true"
              className="size-11 flex-none rounded-full bg-orange-mid lg:size-[52px]"
            />
            <span className="flex flex-col">
              <b>{data.author}</b>
              <span className="text-secondary">{data.author_meta}</span>
              {data.attribution && (
                <span className="text-secondary">{data.attribution}</span>
              )}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}
