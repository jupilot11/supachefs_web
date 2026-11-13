import Image from "next/image";
import { Utensils } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { DownloadButton } from "@/components/layout/download-button";
import type { Settings } from "@/lib/cms/schemas";
import type { VariantProps } from "class-variance-authority";

export const paragraphs = (text: string) =>
  text.split(/\n\s*\n/).filter(Boolean);

export function Section({
  id,
  className,
  inner,
  children,
}: {
  id?: string;
  className?: string;
  inner?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-10 lg:py-[88px]", className)}>
      <div className={cn("container-page", inner)}>{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <span className={cn("caps-label block text-orange-dark", className)}>
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  body,
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
}) {
  if (!eyebrow && !title && !body) return null;
  return (
    <div className={cn("flex max-w-2xl flex-col gap-2 lg:gap-2.5", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      {title && (
        <h2 className="text-2xl leading-[1.2] font-bold tracking-[-0.015em] text-balance text-primary lg:text-4xl lg:leading-[1.15] lg:tracking-[-0.02em]">
          {title}
        </h2>
      )}
      {body && <p className="text-secondary lg:text-lg">{body}</p>}
    </div>
  );
}

type LinkProps = VariantProps<typeof buttonVariants> & {
  cta: { label: string; href: string } | null | undefined;
  store: Settings["store"];
  className?: string;
};

/** href: a site path, "#download" (store badges), a page anchor, or an absolute URL. */
export function CmsLink({ cta, store, variant, size, className }: LinkProps) {
  if (!cta || !cta.label || !cta.href) return null;
  if (cta.href === "#download") {
    return (
      <DownloadButton
        store={store}
        label={cta.label}
        variant={variant}
        size={size}
        className={className}
      />
    );
  }
  const classes = cn(buttonVariants({ variant, size }), className);
  // Links with a #hash use a plain anchor so same-page hash changes (/faqs#chefs) fire hashchange.
  if (cta.href.startsWith("/") && !cta.href.includes("#")) {
    return (
      <Link href={cta.href} className={classes}>
        {cta.label}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(cta.href);
  return (
    <a
      href={cta.href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {cta.label}
    </a>
  );
}

/** Real photo when the admin set one, otherwise a warm placeholder tile. */
export function Photo({
  src,
  alt = "",
  className,
  sizes,
  priority,
  unoptimized,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** For photos from hosts next/image is not set up for (a chef's own upload on any storage). */
  unoptimized?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-orange-tint", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center bg-orange-tint text-orange-mid"
        >
          <Utensils className="size-12" />
        </div>
      )}
    </div>
  );
}
