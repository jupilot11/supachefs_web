import Link from "next/link";
import type { Settings } from "@/lib/cms/schemas";
import { FooterLead } from "./footer-lead";
import { StoreBadges } from "./store-badges";
import { Wordmark } from "./wordmark";

type Item = { label: string; href: string | null };

const linkClass =
  "flex min-h-11 items-center text-[15px] font-medium whitespace-nowrap text-sand no-underline transition-colors hover:text-white lg:min-h-9";
const legalClass =
  "flex min-h-11 items-center text-sand underline underline-offset-4 hover:text-white lg:min-h-8";
const headingClass = "mb-1 text-[15px] font-bold text-white";

const legal: Item[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

function FooterLink({ item, className }: { item: Item; className: string }) {
  const href = item.href!;
  // Internal paths use <Link>; mailto: and external URLs use a plain <a>.
  if (href.startsWith("/"))
    return (
      <Link href={href} className={className}>
        {item.label}
      </Link>
    );
  return (
    <a
      href={href}
      className={className}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {item.label}
    </a>
  );
}

/** Soft disc and rings behind the top-right corner, the brand-coloured version of the reference's swirl. */
function Arcs() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      fill="none"
      className="pointer-events-none absolute -top-24 -right-28 size-[340px] text-brand lg:-top-36 lg:-right-24 lg:size-[560px]"
    >
      <circle cx="200" cy="200" r="198" fill="currentColor" fillOpacity=".07" />
      {[150, 108, 66].map((r) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="currentColor"
          strokeOpacity=".1"
          strokeWidth="24"
        />
      ))}
    </svg>
  );
}

export function Footer({ settings }: { settings: Settings }) {
  const { contact, social, store } = settings;

  // Items without a link (email or social not set in the CMS) drop out, so there is never a hole.
  const groups: { title: string; items: Item[] }[] = [
    {
      title: "For customers",
      items: [
        { label: "How it works", href: "/how-it-works/customers" },
        { label: "FAQs", href: "/faqs" },
      ],
    },
    {
      title: "For chefs",
      items: [
        { label: "Become a chef", href: "/become-a-chef" },
        { label: "How it works", href: "/how-it-works/chefs" },
        { label: "Chef FAQs", href: "/faqs#chefs" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/about" },
        {
          label: "Contact",
          href: contact.email ? `mailto:${contact.email}` : null,
        },
      ],
    },
  ]
    .map((g) => ({ ...g, items: g.items.filter((i) => i.href) }))
    .filter((g) => g.items.length > 0);

  const socials: Item[] = [
    { label: "Facebook", href: social.facebook_url },
    { label: "Instagram", href: social.instagram_url },
    { label: "TikTok", href: social.tiktok_url },
  ].filter((i) => i.href);

  const hasStore = Boolean(store.app_store_url || store.play_store_url);

  return (
    <footer className="pt-10 pb-5 lg:pt-16 lg:pb-6">
      <div className="container-page">
        {/* bg-charcoal stays as the base colour and the white focus-ring hook in globals.css; the gradient paints over it. */}
        <div className="relative overflow-hidden rounded-[28px] bg-charcoal bg-linear-[160deg] from-near-black from-45% to-orange-deep text-white">
          <Arcs />
          <div className="relative">
            <FooterLead
              email={contact.email}
              messengerUrl={contact.messenger_url}
            />
            <div className="px-5 pt-9 pb-2 text-sand lg:px-10 lg:pt-14">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,3.2fr)] lg:gap-12">
                <div className="flex max-w-xs flex-col items-start gap-4">
                  <Wordmark logoUrl={settings.logo_url} className="-ml-0.5" />
                  <p className="text-[17px] leading-snug font-bold text-white">
                    Real food. Real people.
                    <span className="block font-normal text-sand">
                      From home kitchens near you.
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:gap-x-8">
                  {groups.map((g) => (
                    <nav key={g.title} aria-label={g.title}>
                      <h2 className={headingClass}>{g.title}</h2>
                      {g.items.map((i) => (
                        <FooterLink key={i.label} item={i} className={linkClass} />
                      ))}
                    </nav>
                  ))}
                  {hasStore && (
                    <div>
                      <h2 className={headingClass}>Get the app</h2>
                      <StoreBadges store={store} className="mt-2" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 grid gap-1 border-t border-white/12 pt-2 pb-1 text-[13px] lg:mt-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
                <nav aria-label="Legal" className="flex gap-x-5">
                  {legal.map((i) => (
                    <FooterLink key={i.label} item={i} className={legalClass} />
                  ))}
                </nav>
                <span className="py-1 lg:text-center">
                  © {new Date().getFullYear()} SupaChefs, operated by SupaLabs,
                  Inc.
                </span>
                {socials.length > 0 ? (
                  <nav
                    aria-label="Social"
                    className="flex gap-x-5 lg:justify-end"
                  >
                    {socials.map((i) => (
                      <FooterLink
                        key={i.label}
                        item={i}
                        className={legalClass}
                      />
                    ))}
                  </nav>
                ) : (
                  <span aria-hidden />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
