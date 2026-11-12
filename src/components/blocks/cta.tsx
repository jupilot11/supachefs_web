import { Reveal } from "@/components/motion/reveal";
import { StoreBadges } from "@/components/layout/store-badges";
import type { BlockData, Settings } from "@/lib/cms/schemas";
import { CmsLink, Eyebrow, Section, paragraphs } from "./shared";

type Props = {
  id: string;
  data: BlockData<"cta">;
  settings: Settings;
  variant?: string;
};

/** One block, three looks: "band" (orange), "download" (store badges + QR), else a centred call to action. */
export function Cta(props: Props) {
  if (props.variant === "band") return <Band {...props} />;
  if (props.variant === "download") return <Download {...props} />;
  return <Centered {...props} />;
}

function Band({ id, data, settings }: Props) {
  return (
    <section id={id} className="bg-orange-dark py-11 text-white lg:py-[88px]">
      <Reveal className="container-page flex max-w-[1280px] flex-col gap-4 lg:gap-[18px]">
        <Eyebrow className="text-orange-tint">{data.eyebrow}</Eyebrow>
        <h2 className="max-w-2xl text-[26px] leading-[1.2] font-bold tracking-[-0.015em] text-balance lg:text-[42px] lg:leading-[1.12] lg:tracking-[-0.02em]">
          {data.title}
        </h2>
        <p className="max-w-[460px] text-orange-wash lg:text-lg">{data.body}</p>
        <div className="mt-1 flex flex-col gap-3 lg:mt-2 lg:flex-row lg:items-center lg:gap-[22px]">
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
            className="justify-center text-white lg:justify-start"
          />
        </div>
      </Reveal>
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
        <StoreBadges store={settings.store} qr />
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
        {paragraphs(data.body).map((p) => (
          <p key={p} className="text-secondary lg:text-lg">
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
