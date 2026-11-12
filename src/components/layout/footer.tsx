import Link from "next/link";
import type { Settings } from "@/lib/cms/schemas";
import { StoreBadges } from "./store-badges";
import { Wordmark } from "./wordmark";

type Item = { label: string; href: string | null };

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-primary no-underline hover:text-orange-dark hover:underline lg:min-h-9";

export function Footer({ settings }: { settings: Settings }) {
  const { contact, social, store } = settings;
  const mail = contact.email ? `mailto:${contact.email}` : null;

  const groups: { title: string; items: Item[] }[] = [
    {
      title: "Company",
      items: [
        { label: "About", href: "/about" },
        { label: "Contact", href: mail },
      ],
    },
    {
      title: "For customers",
      items: [
        { label: "How It Works", href: "/how-it-works/customers" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
    {
      title: "For chefs",
      items: [
        { label: "Become a Chef", href: "/become-a-chef" },
        { label: "Chef FAQs", href: "/faqs#chefs" },
      ],
    },
    {
      title: "Legal & social",
      items: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Facebook", href: social.facebook_url },
        { label: "Instagram", href: social.instagram_url },
        { label: "TikTok", href: social.tiktok_url },
      ],
    },
  ];

  return (
    <footer className="border-t border-sand-light bg-off-white px-5 pt-10 lg:px-24 lg:pt-16">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 lg:gap-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-10">
          <div className="flex flex-col gap-3.5 lg:gap-4">
            <Wordmark className="self-start" />
            <p className="max-w-60 text-sm text-secondary">
              Real food. Real people. From home kitchens near you.
            </p>
            <StoreBadges store={store} row className="mt-1" />
          </div>
          <div className="col-span-full grid grid-cols-2 gap-x-5 gap-y-7 lg:col-span-4 lg:grid-cols-4 lg:gap-10">
            {groups.map((g) => {
              const items = g.items.filter((i) => i.href);
              return (
                <nav
                  key={g.title}
                  aria-label={g.title}
                  className="flex flex-col"
                >
                  <h2 className="caps-label mb-1.5 text-secondary">
                    {g.title}
                  </h2>
                  {items.map((i) =>
                    i.href!.startsWith("/") && !i.href!.includes("#") ? (
                      <Link key={i.label} href={i.href!} className={linkClass}>
                        {i.label}
                      </Link>
                    ) : (
                      <a
                        key={i.label}
                        href={i.href!}
                        className={linkClass}
                        {...(i.href!.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {i.label}
                      </a>
                    ),
                  )}
                </nav>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-sand-light py-5 text-[13px] text-secondary lg:flex-row lg:gap-5 lg:pb-6">
          <span>© 2026 SupaChefs, operated by SupaLabs, Inc.</span>
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex min-h-11 items-center text-secondary lg:min-h-0"
            >
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
