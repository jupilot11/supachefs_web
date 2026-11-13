import { Check } from "lucide-react";
import { cn } from "cn";
import { CmsIcon } from "@/lib/icons";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import { Eyebrow, Photo, Section, SectionHeader } from "./shared";

type Props = { id: string; data: BlockData<"cards">; variant?: string };

/** One block, three looks: "checklist", "numbered", or the default icon-card grid. */
export function Cards({ id, data, variant }: Props) {
  if (variant === "checklist") return <Checklist data={data} id={id} />;
  if (variant === "numbered") return <Numbered data={data} id={id} />;
  return <Grid data={data} id={id} />;
}

function Grid({ id, data }: Props) {
  const n = data.items.length;
  return (
    <Section
      id={id}
      className={id === "why" ? "bg-off-white" : undefined}
      inner="flex flex-col gap-5 lg:gap-10"
    >
      <SectionHeader
        eyebrow={data.eyebrow}
        title={data.title}
        body={data.body}
      />
      <RevealList
        as="ul"
        className={cn(
          "grid gap-3 sm:grid-cols-2 lg:gap-5",
          n % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4",
        )}
      >
        {data.items.map((i, idx) => (
          <RevealItem
            key={`${idx}-${i.title}`}
            as="li"
            className="flex gap-3.5 rounded-xl border border-sand-light bg-white p-4 shadow-xs lg:flex-col lg:rounded-[14px] lg:p-7"
          >
            {i.icon && (
              <span className="grid size-10 flex-none place-items-center rounded-xl bg-orange-tint text-orange-dark lg:size-12">
                <CmsIcon name={i.icon} className="size-5 lg:size-6" />
              </span>
            )}
            <div className="flex flex-col gap-1 lg:gap-3.5">
              <h3 className="text-base font-bold text-primary lg:text-xl">
                {i.title}
              </h3>
              <p className="text-sm leading-[1.55] text-secondary lg:text-base lg:leading-[1.7]">
                {i.body}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}

function Checklist({ id, data }: Props) {
  const link = data.link?.label && data.link.href ? data.link : null;
  const hasPhoto = Boolean(data.image_url);
  return (
    <Section
      id={id}
      inner={
        hasPhoto
          ? "grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-[72px]"
          : "grid gap-5 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-20"
      }
    >
      {/* With a photo, the text column dissolves on a phone (title, photo, list, link in that order) and is the right half on desktop. */}
      <div
        className={
          hasPhoto ? "contents lg:flex lg:flex-col lg:gap-6" : "contents"
        }
      >
        <SectionHeader
          eyebrow={data.eyebrow}
          title={data.title}
          body={data.body}
          className={hasPhoto ? "order-1" : undefined}
        />
        <RevealList
          as="ul"
          className={cn("flex flex-col", hasPhoto && "order-3")}
        >
          {data.items.map((i, idx) => (
            <RevealItem
              key={`${idx}-${i.title}`}
              as="li"
              className="flex gap-3 border-b border-sand-light py-4 first:pt-0 lg:gap-3.5 lg:py-5 lg:first:pt-0"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-[22px] flex-none place-items-center rounded-full bg-brand text-white lg:size-6"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-primary lg:text-lg">{i.title}</h3>
                <p className="text-sm leading-[1.55] text-secondary lg:text-base lg:leading-[1.7]">
                  {i.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealList>
        {link && (
          <a
            href={link.href}
            className="order-4 inline-flex min-h-11 items-center self-start text-[15px] font-semibold text-primary hover:underline lg:col-start-2"
          >
            {link.label}
          </a>
        )}
      </div>
      {hasPhoto && (
        <Photo
          src={data.image_url}
          alt=""
          sizes="(min-width:1024px) 600px, 100vw"
          className="order-2 h-[200px] rounded-[14px] lg:-order-1 lg:h-[480px] lg:rounded-[18px]"
        />
      )}
    </Section>
  );
}

function Numbered({ id, data }: Props) {
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
      <RevealList as="ol" className="flex max-w-3xl flex-col">
        {data.items.map((i, n) => (
          <RevealItem
            key={`${n}-${i.title}`}
            as="li"
            className="flex gap-4 border-b border-sand-light py-4 first:pt-0 lg:gap-6 lg:py-5"
          >
            <Eyebrow className="w-7 pt-1 lg:w-9">
              {String(n + 1).padStart(2, "0")}
            </Eyebrow>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[17px] font-bold text-primary lg:text-xl">
                {i.title}
              </h3>
              <p className="text-secondary">{i.body}</p>
            </div>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
