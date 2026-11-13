import { cn } from "cn";
import { Reveal } from "@/components/motion/reveal";
import { StoreBadges } from "@/components/layout/store-badges";
import type { BlockData, Settings } from "@/lib/cms/schemas";
import { hasStore } from "@/lib/cms/store";
import { CmsLink, Eyebrow, Photo, Section, paragraphs } from "./shared";

type Props = {
  id: string;
  data: BlockData<"cta">;
  settings: Settings;
  variant?: string;
};

/** One block, three looks: "band" (orange), "download" (store badges), else a centred call to action. */
export function Cta(props: Props) {
  if (props.variant === "band") return <Band {...props} />;
  if (props.variant === "download")
    return hasStore(props.settings.store) ? <Download {...props} /> : null;
  return <Centered {...props} />;
}

function Band({ id, data, settings }: Props) {
  const hasPhoto = Boolean(data.image_url);
  return (
    // An inset panel in the page's margins, like the hero and card photos, instead of a full-bleed slab.
    // The neighbouring sections supply the space above and below. No eyebrow: the headline already speaks to cooks.
    <section id={id} className="container-page">
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-orange-dark text-white lg:rounded-[18px]",
          hasPhoto && "lg:grid lg:grid-cols-2",
        )}
      >
        <Reveal className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:gap-5 lg:p-12">
          <h2 className="max-w-[14em] text-[30px] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance lg:text-4xl lg:leading-[1.08] lg:tracking-[-0.025em] xl:text-[44px]">
            {data.title}
          </h2>
          <p className="max-w-[440px] text-orange-wash lg:text-xl lg:leading-[1.55]">
            {data.body}
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:mt-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-7 lg:gap-y-3">
            <CmsLink
              cta={data.primary_cta}
              store={settings.store}
              variant="inverse"
              size="lg"
            />
            <CmsLink
              cta={data.secondary_cta}
              store={settings.store}
              variant="link"
              className="justify-center text-base text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white lg:justify-start"
            />
          </div>
        </Reveal>
        {hasPhoto && (
          <Photo
            src={data.image_url}
            alt=""
            sizes="(min-width:1024px) 544px, 100vw"
            className="h-[240px] md:h-[340px] lg:h-auto lg:min-h-[500px]"
          />
        )}
      </div>
    </section>
  );
}

function Download({ id, data, settings }: Props) {
  return (
    <Section
      id={id}
      className="lg:py-24"
      inner="flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-between lg:gap-12 lg:text-left"
    >
      <Reveal className="flex max-w-[560px] flex-col gap-3.5">
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <h2 className="text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance text-primary lg:text-[46px] lg:leading-[1.1] lg:tracking-[-0.025em]">
          {data.title}
        </h2>
        <p className="text-secondary lg:text-lg">{data.body}</p>
      </Reveal>
      <Reveal
        delay={0.1}
        className="flex flex-col items-center gap-3 lg:items-end"
      >
        <StoreBadges store={settings.store} />
        <CmsLink
          cta={data.secondary_cta}
          store={settings.store}
          variant="link"
          className="text-[15px]"
        />
      </Reveal>
    </Section>
  );
}

function Centered({ id, data, settings }: Props) {
  return (
    <Section
      id={id}
      className="bg-orange-wash"
      inner="flex flex-col items-center gap-4 text-center"
    >
      <Reveal className="flex max-w-2xl flex-col items-center gap-4">
        <Eyebrow>{data.eyebrow}</Eyebrow>
        <h2 className="text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance text-primary lg:text-[42px]">
          {data.title}
        </h2>
        {paragraphs(data.body).map((p, idx) => (
          <p key={`${idx}-${p}`} className="text-secondary lg:text-lg">
            {p}
          </p>
        ))}
        <div className="mt-2 flex flex-col items-center gap-2 lg:flex-row lg:gap-5">
          <CmsLink cta={data.primary_cta} store={settings.store} size="lg" />
          <CmsLink
            cta={data.secondary_cta}
            store={settings.store}
            variant="link"
          />
        </div>
      </Reveal>
    </Section>
  );
}
