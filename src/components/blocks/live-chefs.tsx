import { MapPin, Star } from "lucide-react";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { getTopChefs } from "@/lib/cms";
import type { TopChef } from "@/lib/cms/schemas";
import { Photo, Section, SectionHeader } from "./shared";

/** "Chef Kenji Tanaka" becomes "KT": the stand-in for a chef who has not uploaded a photo yet. */
export function initials(name: string) {
  const words = name
    .replace(/^chef\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function ChefCard({ chef: c }: { chef: TopChef }) {
  return (
    <RevealItem
      as="li"
      className="flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-[14px] border border-sand-light bg-white shadow-[0_1px_2px_rgba(42,31,26,0.06)] sm:w-[42%] lg:w-auto lg:max-w-[272px] lg:min-w-0 lg:flex-1 lg:shrink"
    >
      {c.image_url ? (
        <Photo
          src={c.image_url}
          unoptimized
          alt={`${c.name}${c.area ? `, home chef in ${c.area}` : ""}`}
          sizes="(min-width:1024px) 272px, (min-width:640px) 42vw, 78vw"
          className="aspect-[4/3] w-full"
        />
      ) : (
        <div
          aria-hidden="true"
          className="grid aspect-[4/3] w-full place-items-center bg-orange-tint text-5xl font-extrabold tracking-[-0.02em] text-brand"
        >
          {initials(c.name)}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5 lg:p-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg leading-snug font-bold tracking-[-0.01em] text-primary">
            {c.name}
          </h3>
          {c.area && (
            <p className="flex items-center gap-1 text-sm text-secondary">
              <MapPin aria-hidden="true" className="size-3.5 flex-none" />
              {c.area}
            </p>
          )}
        </div>
        {c.cuisine && (
          <span className="w-fit rounded-full bg-orange-tint px-3 py-1 text-[13px] font-semibold text-orange-dark">
            {c.cuisine}
          </span>
        )}
        {c.story && (
          <p className="line-clamp-3 text-sm leading-relaxed text-secondary">
            {c.story}
          </p>
        )}
        {/* mt-auto: the rating sits on the same line in every card of a row */}
        {c.rating !== null && c.reviews > 0 ? (
          <p
            className="mt-auto flex items-center gap-1.5 border-t border-sand-light pt-3 text-sm text-primary"
            aria-label={`Rated ${c.rating.toFixed(1)} out of 5 from ${c.reviews} ${c.reviews === 1 ? "review" : "reviews"}`}
          >
            <Star
              aria-hidden="true"
              className="size-4 fill-orange-dark text-orange-dark"
            />
            <b>{c.rating.toFixed(1)}</b>
            <span className="text-secondary">
              ({c.reviews} {c.reviews === 1 ? "review" : "reviews"})
            </span>
          </p>
        ) : (
          <p className="mt-auto border-t border-sand-light pt-3 text-sm text-secondary">
            No reviews yet
          </p>
        )}
      </div>
    </RevealItem>
  );
}

// shortcut: a photo is the stand-in for "a real, onboarded chef"; use an API flag if it ever sends one.
const MIN_WITH_PHOTO = 3;

/**
 * The home page's chefs: the top 5 from the app (real names, areas, photos, ratings), not CMS copy.
 * Until at least three of them have a photo the whole section is left out: a lone test profile or a row of
 * initials tiles reads as fake proof for "a name and a face behind every dish".
 */
export async function LiveChefs({ id }: { id: string }) {
  const chefs = await getTopChefs();
  if (chefs.filter((c) => c.image_url).length < MIN_WITH_PHOTO) return null;

  return (
    <Section id={id} inner="flex flex-col gap-6 lg:gap-10">
      <SectionHeader
        eyebrow="MEET THE CHEFS"
        title="Cooking in your neighborhood"
      />
      {/* One row at every width. Desktop: the cards share it equally (centred when there are fewer than five).
          Phone and tablet: the row swipes sideways and snaps to a card, the next one peeking in; it bleeds to the
          screen edge, and only the row scrolls, never the page. Focusable so a keyboard can scroll it. */}
      <RevealList
        as="ul"
        tabIndex={0}
        aria-label="Top chefs"
        className="-mx-5 flex snap-x snap-mandatory scroll-pl-5 [scrollbar-width:thin] gap-4 overflow-x-auto px-5 pt-px pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:-mx-10 md:scroll-pl-10 md:px-10 lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0"
      >
        {chefs.map((c) => (
          <ChefCard key={c.id} chef={c} />
        ))}
      </RevealList>
    </Section>
  );
}
