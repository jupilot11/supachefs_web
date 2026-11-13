import { cn } from "cn";
import { Photo, CmsLink, Eyebrow, paragraphs } from "./shared";
import type { BlockData, Settings } from "@/lib/cms/schemas";

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
    data.primary_cta?.label || data.secondary_cta?.label,
  );
  // "banner" (About): headline first, then a wide photo, always shown (a placeholder until one is set).
  const banner = variant === "banner";
  // Otherwise no photo set: a headline without an empty picture slot.
  const textOnly = !banner && !data.image_url;

  return (
    <section
      id={id}
      className={
        banner
          ? "pt-7 pb-10 lg:pt-[88px] lg:pb-14"
          : textOnly
            ? "py-12 lg:py-24"
            : "py-7 lg:py-[72px]"
      }
    >
      <div
        className={
          textOnly || banner
            ? "container-page"
            : "container-page grid items-center gap-[18px] lg:grid-cols-[1.05fr_1fr] lg:gap-16"
        }
      >
        <div className="flex flex-col gap-4 lg:gap-5">
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h1
            className={
              banner
                ? "max-w-[960px] text-[34px] leading-[1.1] font-extrabold tracking-[-0.025em] text-balance text-primary lg:text-[64px] lg:leading-[1.03] lg:tracking-[-0.03em]"
                : "max-w-4xl text-[36px] leading-[1.08] font-extrabold tracking-[-0.025em] text-balance text-primary lg:text-[56px] lg:leading-[1.04] lg:tracking-[-0.03em]"
            }
          >
            {data.title}
          </h1>
          {paragraphs(data.body).map((p, idx) => (
            <p
              key={`${idx}-${p}`}
              className="max-w-[520px] text-secondary lg:text-[19px]"
            >
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
        </div>
        {banner && (
          <BannerPhoto
            src={data.image_url}
            caption={data.image_caption}
            className="mt-6 lg:mt-14"
          />
        )}
        {!textOnly && !banner && (
          <div className="relative">
            <Photo
              src={data.image_url}
              alt=""
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
          </div>
        )}
      </div>
    </section>
  );
}

/** The wide About photo. With no upload yet it is a peach crossed tile that says what photo belongs here. */
function BannerPhoto({
  src,
  caption,
  className,
}: {
  src?: string | null;
  caption: string;
  className?: string;
}) {
  const frame = "h-60 rounded-2xl lg:h-[460px] lg:rounded-[18px]";
  return (
    <div className={cn("relative", className)}>
      {src ? (
        <Photo
          src={src}
          alt={caption}
          sizes="(min-width:1280px) 1088px, 100vw"
          priority
          className={frame}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn("overflow-hidden bg-orange-tint", frame)}
        >
          <svg
            className="size-full text-orange-mid"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {["0 0 100 100", "100 0 0 100"].map((d) => {
              const [x1, y1, x2, y2] = d.split(" ");
              return (
                <line
                  key={d}
                  {...{ x1, y1, x2, y2 }}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </div>
      )}
      {caption && (
        <span
          className={cn(
            "absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-lg bg-white/95 px-3 py-1.5 text-orange-dark lg:bottom-4 lg:left-4",
            src ? "text-[13px] lg:text-sm" : "font-mono text-xs lg:text-[13px]",
          )}
        >
          {src ? caption : `PHOTO · ${caption}`}
        </span>
      )}
    </div>
  );
}
