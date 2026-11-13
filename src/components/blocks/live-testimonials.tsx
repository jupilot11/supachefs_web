import { Star } from "lucide-react";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { getTestimonials } from "@/lib/cms";
import type { Testimonial } from "@/lib/cms/schemas";
import { Quote } from "./quote";
import { Section, SectionHeader } from "./shared";

/** "Beef pochero from Chef Tess · Banilad", with whatever of the three the review has. */
const orderedLine = (t: Testimonial) =>
  [
    t.dish ? `${t.dish} from ` : "Ordered from ",
    t.chef ?? "a SupaChefs kitchen",
    t.area ? ` · ${t.area}` : "",
  ].join("");

const Stars = ({ rating }: { rating: number }) => (
  <span
    role="img"
    aria-label={`${rating} out of 5 stars`}
    className="flex gap-0.5 text-orange-dark"
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        aria-hidden="true"
        className={n <= rating ? "size-4 fill-current" : "size-4"}
      />
    ))}
  </span>
);

/**
 * The home page's testimonials: the most recent good reviews from the app (first name and initial only), not CMS
 * copy. One review is shown large, several as cards, none leaves the section out.
 */
export async function LiveTestimonials({ id }: { id: string }) {
  const items = await getTestimonials();
  if (!items.length) return null;

  if (items.length === 1) {
    const [t] = items;
    return (
      <Quote
        id={id}
        data={{
          text: t.text,
          author: t.author,
          author_meta: `${t.rating} out of 5 stars`,
          attribution: orderedLine(t),
        }}
      />
    );
  }

  return (
    <Section
      id={id}
      className="bg-off-white"
      inner="flex flex-col gap-6 lg:gap-10"
    >
      <SectionHeader
        eyebrow="WHAT CUSTOMERS SAY"
        title="Recent reviews from our customers"
      />
      <RevealList as="ul" className="flex flex-wrap justify-center gap-5">
        {items.map((t) => (
          <RevealItem
            key={t.id}
            as="li"
            className="flex w-full flex-col rounded-[14px] border border-sand-light bg-white p-6 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
          >
            <figure className="flex h-full flex-col gap-4">
              <Stars rating={t.rating} />
              <blockquote className="flex-1 text-primary">
                <p>“{t.text}”</p>
              </blockquote>
              <figcaption className="text-sm">
                <b className="block text-primary">{t.author}</b>
                <span className="text-secondary">{orderedLine(t)}</span>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
