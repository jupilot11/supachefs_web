"use client";

import Image from "next/image";
import { cn } from "cn";
import type { Settings } from "@/lib/cms/schemas";
import { usePlatform } from "./use-platform";

type Store = Settings["store"];

/** Apple's and Google's own badge artwork, unaltered (their brand rules), scaled evenly to 44px tall: the touch-target minimum. */
const BADGES = {
  ios: {
    src: "/badges/app-store.svg",
    alt: "Download on the App Store",
    width: 120,
  },
  android: {
    src: "/badges/google-play.svg",
    alt: "Get it on Google Play",
    width: 135,
  },
} as const;

function Badge({
  href,
  badge,
}: {
  href: string;
  badge: (typeof BADGES)[keyof typeof BADGES];
}) {
  return (
    <a
      href={href}
      className="inline-flex transition-transform duration-150 ease-out hover:-translate-y-px active:translate-y-px"
    >
      <Image
        src={badge.src}
        alt={badge.alt}
        width={badge.width}
        height={40}
        unoptimized
        className="h-11 w-auto"
      />
    </a>
  );
}

/**
 * Only the stores whose link the admin set. Phone: only the matching store.
 * Desktop (and before hydration): every set store. With no store set it
 * renders nothing.
 */
export function StoreBadges({
  store,
  row = false,
  className,
}: {
  store: Store;
  row?: boolean;
  className?: string;
}) {
  const platform = usePlatform();
  const showIos = Boolean(store.app_store_url) && platform !== "android";
  const showAndroid = Boolean(store.play_store_url) && platform !== "ios";
  if (!showIos && !showAndroid) return null;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div
        className={cn("flex gap-2.5", row ? "flex-row flex-wrap" : "flex-col")}
      >
        {showIos && (
          <Badge href={store.app_store_url as string} badge={BADGES.ios} />
        )}
        {showAndroid && (
          <Badge href={store.play_store_url as string} badge={BADGES.android} />
        )}
      </div>
    </div>
  );
}
