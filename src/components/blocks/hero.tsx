import { Photo, CmsLink, Eyebrow, paragraphs } from "./shared";
import { Reveal } from "@/components/motion/reveal";
import type { BlockData } from "@/lib/cms/schemas";
import type { Settings } from "@/lib/cms/schemas";

export function Hero({
  id,
  data,
  settings,
  variant,
}: {
  id: string;
  data: BlockData<"hero">;
  settings: Settings;
  variant?: string;
}) {
  const { store } = settings;
  const hasActions = Boolean(
    data.primary_cta.label || data.secondary_cta?.label,
  );
  // "text" (About): a headline with no photo.
  const textOnly =
    variant === "text" || (!hasActions && !data.body && !data.image_url);

  return (
    <section
      id={id}
      className={textOnly ? "py-12 lg:py-24" : "py-7 lg:py-[72px]"}
    >
      <div
        className={
          textOnly
            ? "container-page"
            : "container-page grid items-center gap-[18px] lg:grid-cols-[1.05fr_1fr] lg:gap-16"
        }
      >
        <Reveal className="flex flex-col gap-[18px] lg:gap-[22px]">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h1 className="max-w-4xl text-[36px] leading-[1.08] font-extrabold tracking-[-0.025em] text-balance text-primary lg:text-[56px] lg:leading-[1.04] lg:tracking-[-0.03em]">
            {data.title}
          </h1>
          {paragraphs(data.body).map((p) => (
            <p key={p} className="max-w-[520px] text-secondary lg:text-[19px]">
              {p}
            </p>
          ))}
          {hasActions && (
            <div className="mt-1.5 flex flex-wrap gap-2.5 lg:gap-3.5">
              <CmsLink
                cta={data.primary_cta}
                store={store}
                size="lg"
                className="max-lg:flex-1"
              />
              <CmsLink
                cta={data.secondary_cta}
                store={store}
                variant="outline"
                size="lg"
                className="max-lg:flex-1"
              />
            </div>
          )}
        </Reveal>
        {!textOnly && (
          <Reveal delay={0.1} className="relative">
            <Photo
              src={data.image_url}
              alt={data.image_caption}
              sizes="(min-width:1024px) 600px, 100vw"
              priority
              className="h-[300px] rounded-2xl lg:h-[480px] lg:rounded-[18px]"
            />
            {data.image_caption && (
              <span className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white py-1.5 pr-3.5 pl-1.5 text-[13px] shadow-sm lg:top-[18px] lg:left-[18px] lg:text-sm">
                <span
                  aria-hidden="true"
                  className="size-7 rounded-full bg-orange-mid lg:size-[34px]"
                />
                {data.image_caption}
              </span>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
