import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Settings } from "@/lib/cms/schemas";
import { StoreBadges } from "./store-badges";
import { Wordmark } from "./wordmark";

type Item = { label: string; href: string | null };

const linkClass =
  "inline-flex min-h-11 items-center text-[15px] text-sand no-underline underline-offset-4 transition-colors hover:text-white hover:underline lg:min-h-9";

const legal: Item[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

function FooterLink({ item, className }: { item: Item; className?: string }) {
  const href = item.href!;
  const cls = className ?? linkClass;
  // Anchors with a hash and external URLs use a plain <a>, as before.
  if (href.startsWith("/") && !href.includes("#"))
    return (
      <Link href={href} className={cls}>
        {item.label}
      </Link>
    );
  return (
    <a
      href={href}
      className={cls}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {item.label}
    </a>
  );
}

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
        { label: "How It Works", href: "/how-it-works/chefs" },
      ],
    },
    {
      title: "Follow us",
      items: [
        { label: "Facebook", href: social.facebook_url },
        { label: "Instagram", href: social.instagram_url },
        { label: "TikTok", href: social.tiktok_url },
      ],
    },
  ]
    .map((g) => ({ ...g, items: g.items.filter((i) => i.href) }))
    .filter((g) => g.items.length > 0);

  return (
    <footer className="bg-charcoal text-white">
      <div className="container-page flex flex-col gap-12 py-14 lg:gap-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)] lg:gap-20">
          <div className="flex max-w-sm flex-col items-start gap-5">
            <Wordmark className="-ml-0.5 text-white!" />
            <p className="text-xl leading-snug font-bold tracking-[-0.01em]">
              Real food. Real people.
              <span className="block font-normal text-sand">
                From home kitchens near you.
              </span>
            </p>
            <StoreBadges store={store} row />
            <p className="flex gap-2.5 text-sm text-sand">
              <ShieldCheck
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-orange-light"
              />
              <span>
                Every chef is verified before going live: an ID check, a call
                with our team, and a kitchen visit.
              </span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
            {groups.map((g) => (
              <nav
                key={g.title}
                aria-label={g.title}
                className="flex flex-col"
              >
                <h2 className="mb-2 text-sm font-bold text-white">{g.title}</h2>
                {g.items.map((i) => (
                  <FooterLink key={i.label} item={i} />
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-white/15 pt-6 text-[13px] text-sand lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <span>
            © {new Date().getFullYear()} SupaChefs, operated by SupaLabs, Inc.
          </span>
          <nav aria-label="Legal" className="flex gap-x-6">
            {legal.map((i) => (
              <FooterLink
                key={i.label}
                item={i}
                className="inline-flex min-h-11 items-center text-sand underline-offset-4 hover:text-white hover:underline lg:min-h-0"
              />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
