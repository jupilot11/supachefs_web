import { cn } from "cn";
import { RevealList, RevealItem } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import { Eyebrow, Photo, Section, SectionHeader } from "./shared";

const cols: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

const Chips = ({ chips }: { chips: string[] }) =>
  chips.length > 0 && (
    <ul className="mt-1 flex flex-wrap gap-2">
      {chips.map((c, idx) => (
        <li
          key={`${idx}-${c}`}
          className="rounded-full bg-orange-tint px-3 py-1 text-[13px] font-semibold text-orange-dark"
        >
          {c}
        </li>
      ))}
    </ul>
  );

export function Steps({
  id,
  data,
  variant,
}: {
  id: string;
  data: BlockData<"steps">;
  variant?: string;
}) {
  const { items } = data;
  // "timeline": a timeline where the first chip is the "when" label, not a step number.
  const timeline = variant === "timeline";
  // Five or more steps read better as one column than as cramped cards.
  const list = items.length > 4;
  // "phones": each step's app screenshot in a phone frame. With no screenshot yet it falls back to the plain
  // layout rather than showing empty frames.
  const phones = variant === "phones" && items.some((s) => s.image_url);

  return (
    <Section
      id={id}
      className={timeline ? "bg-off-white" : undefined}
      inner="flex flex-col gap-6 lg:gap-10"
    >
      <SectionHeader
        eyebrow={data.eyebrow}
        title={data.title}
        body={data.body}
      />
      <RevealList
        as="ol"
        className={cn(
          "grid gap-5 lg:gap-8",
          phones
            ? cn("sm:grid-cols-2", cols[items.length] ?? "lg:grid-cols-3")
            : list
              ? "max-w-3xl"
              : (cols[items.length] ?? "lg:grid-cols-3"),
        )}
      >
        {items.map((s, i) => (
          <RevealItem
            key={`${i}-${s.title}`}
            as="li"
            className="flex flex-col gap-4"
          >
            {phones && (
              // The number sits on its own row above the phone, so the title below gets the full column.
              <div aria-hidden="true" className="flex items-center gap-3">
                <span className="grid size-8 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                {cols[items.length] && i < items.length - 1 && (
                  <span className="hidden h-px flex-1 bg-border lg:block" />
                )}
              </div>
            )}
            {phones && (
              <Photo
                src={s.image_url}
                alt={`${s.title}: app screen`}
                sizes="(min-width:1024px) 20vw, (min-width:640px) 45vw, 80vw"
                className="aspect-[10/17] w-full max-w-[260px] rounded-[28px] border-[6px] border-border sm:max-w-none"
              />
            )}
            {!phones && s.image_url && (
              <Photo
                src={s.image_url}
                sizes="(min-width:1024px) 400px, 100vw"
                className="h-[180px] rounded-[14px] lg:h-[240px]"
              />
            )}
            <div className="flex gap-3.5">
              {!timeline && !phones && (
                <span
                  aria-hidden="true"
                  className="grid size-9 flex-none place-items-center rounded-full border-[1.5px] border-brand font-bold text-primary"
                >
                  {i + 1}
                </span>
              )}
              <div
                className={cn(
                  "flex flex-col gap-1 lg:gap-1.5",
                  !timeline && !phones && "pt-1.5",
                )}
              >
                {timeline && <Eyebrow>{s.chips[0]}</Eyebrow>}
                <h3
                  className={cn(
                    "font-bold text-primary",
                    phones
                      ? "text-lg leading-snug text-balance"
                      : "text-[17px] lg:text-[19px]",
                  )}
                >
                  {s.title}
                </h3>
                <p
                  className={cn(
                    "text-secondary",
                    phones
                      ? "text-[15px] leading-[1.55] lg:text-sm"
                      : "text-[15px] leading-[1.55] lg:text-base lg:leading-[1.7]",
                  )}
                >
                  {s.body}
                </p>
                {phones && s.chips.length > 0 && (
                  <p className="mt-1 text-[13px] font-semibold text-orange-dark">
                    {s.chips.join(" · ")}
                  </p>
                )}
                {!timeline && !phones && <Chips chips={s.chips} />}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
