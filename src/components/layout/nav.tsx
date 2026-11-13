"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Settings } from "@/lib/cms/schemas";
import { DownloadButton } from "./download-button";
import { Wordmark } from "./wordmark";

const hiw = [
  {
    href: "/how-it-works/customers",
    label: "For Customers",
    blurb: "Order homemade meals in five steps",
  },
  {
    href: "/how-it-works/chefs",
    label: "For Chefs",
    blurb: "Cook from home, on your own schedule",
  },
];

const topLinks = [
  { href: "/become-a-chef", label: "Become a Chef" },
  { href: "/about", label: "About" },
  { href: "/faqs", label: "FAQs" },
];

const itemClass =
  "relative inline-flex h-11 items-center rounded-none border-b-2 border-transparent bg-transparent px-0 text-[15px] font-medium text-primary hover:bg-transparent focus:bg-transparent aria-[current=page]:border-brand data-popup-open:bg-transparent";

export function Nav({ store }: { store: Settings["store"] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = (href: string) =>
    (href === "/" ? pathname === "/" : pathname.startsWith(href))
      ? "page"
      : undefined;
  // A cook reading the chef pages gets the chef action in the header; everyone else gets the download.
  const onApply = pathname.startsWith("/become-a-chef");
  const chefSide = onApply || pathname.startsWith("/how-it-works/chefs");

  return (
    <header className="sticky top-0 z-30 border-b border-sand-light bg-white/92 backdrop-blur-lg">
      <div className="mx-auto flex h-[62px] max-w-[1440px] items-center gap-2.5 pr-3.5 pl-5 lg:h-[84px] lg:gap-11 lg:px-12">
        <Wordmark className="flex-1 lg:flex-none" />

        <NavigationMenu
          aria-label="Main"
          className="hidden flex-1 justify-start lg:flex"
        >
          <NavigationMenuList className="gap-7">
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/" />}
                aria-current={current("/")}
                className={itemClass}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={cn(
                  itemClass,
                  pathname.startsWith("/how-it-works") && "border-brand",
                )}
              >
                How It Works
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-[310px] flex-col gap-0.5 p-1">
                  {hiw.map((l) => (
                    <li key={l.href}>
                      <NavigationMenuLink
                        render={<Link href={l.href} />}
                        aria-current={current(l.href)}
                        className="flex-col items-start gap-1 p-3 hover:bg-orange-wash focus:bg-orange-wash"
                      >
                        <span className="font-semibold">{l.label}</span>
                        <span className="text-[13px] font-normal text-secondary">
                          {l.blurb}
                        </span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {topLinks.map((l) => (
              <NavigationMenuItem key={l.href}>
                <NavigationMenuLink
                  render={<Link href={l.href} />}
                  aria-current={current(l.href)}
                  className={itemClass}
                >
                  {l.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {chefSide ? (
          <Link
            href={onApply ? "#apply" : "/become-a-chef#apply"}
            className={cn(buttonVariants({ size: "default" }), "lg:px-5")}
          >
            Apply now
          </Link>
        ) : (
          <DownloadButton
            store={store}
            label="Download the App"
            size="default"
            className="whitespace-nowrap lg:px-5"
          />
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "border-sand-light text-primary hover:bg-subtle lg:hidden",
            )}
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[88%] gap-0 p-5 pt-16">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav
              aria-label="Mobile"
              className="flex flex-col text-base font-medium"
            >
              <MobileLink href="/" onNavigate={() => setOpen(false)}>
                Home
              </MobileLink>
              <span className="pt-4 pb-1 text-xs font-semibold tracking-[0.1em] text-secondary uppercase">
                How it works
              </span>
              {hiw.map((l) => (
                <MobileLink
                  key={l.href}
                  href={l.href}
                  nested
                  onNavigate={() => setOpen(false)}
                >
                  {l.label}
                </MobileLink>
              ))}
              {topLinks.map((l) => (
                <MobileLink
                  key={l.href}
                  href={l.href}
                  onNavigate={() => setOpen(false)}
                >
                  {l.label}
                </MobileLink>
              ))}
              <Link
                href="/become-a-chef"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "mt-5 h-12",
                )}
              >
                Cook with us
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function MobileLink({
  href,
  nested,
  onNavigate,
  children,
}: {
  href: string;
  nested?: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={pathname === href ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center border-b border-sand-light py-3 text-primary aria-[current=page]:text-orange-dark",
        nested && "border-b-0 pl-3.5",
      )}
    >
      {children}
    </Link>
  );
}
