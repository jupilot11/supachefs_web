import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import { Section, SectionHeader } from "./shared";

export function Comparison({
  id,
  data,
}: {
  id: string;
  data: BlockData<"comparison">;
}) {
  return (
    <Section
      id={id}
      className="bg-off-white"
      inner="flex flex-col gap-6 lg:gap-10"
    >
      <SectionHeader
        eyebrow={data.eyebrow}
        title={data.title}
        body={data.body}
      />
      <Reveal className="overflow-hidden rounded-[14px] border border-sand-light bg-white">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[220px_1fr_1fr] gap-6 border-b border-sand-light bg-orange-wash px-7 py-4 lg:grid"
        >
          <span />
          <span className="caps-label text-orange-dark">{data.us_label}</span>
          <span className="caps-label text-secondary">{data.them_label}</span>
        </div>
        <ul>
          {data.rows.map((r, idx) => (
            <li
              key={`${idx}-${r.label}`}
              className="grid gap-2 border-b border-sand-light px-5 py-4 last:border-b-0 lg:grid-cols-[220px_1fr_1fr] lg:gap-6 lg:px-7 lg:py-5"
            >
              <span className="caps-label text-secondary lg:text-sm lg:font-semibold lg:tracking-normal lg:text-primary lg:normal-case">
                {r.label}
              </span>
              <span className="flex items-start gap-2.5 font-bold text-primary">
                <Check
                  className="mt-1 size-4 flex-none text-orange-dark"
                  aria-hidden="true"
                />
                <span>
                  <span className="sr-only">{data.us_label}: </span>
                  {r.us}
                </span>
              </span>
              <span className="flex items-start gap-2.5 text-secondary">
                <Minus className="mt-1 size-4 flex-none" aria-hidden="true" />
                <span>
                  <span className="lg:sr-only">{data.them_label}: </span>
                  {r.them}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
