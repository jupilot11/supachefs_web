"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Settings } from "@/lib/cms/schemas";
import { cn } from "cn";
import type { VariantProps } from "class-variance-authority";
import { hasStore } from "@/lib/cms/store";
import { StoreBadges } from "./store-badges";
import { usePlatform } from "./use-platform";

type Props = VariantProps<typeof buttonVariants> & {
  store: Settings["store"];
  label: string;
  className?: string;
};

/**
 * Phone: a direct link to the matching store. Desktop: a popover with both
 * badges. Before hydration it is a plain link to /download, so it
 * works without JavaScript too.
 */
export function DownloadButton({
  store,
  label,
  variant,
  size,
  className,
}: Props) {
  const platform = usePlatform();
  const classes = cn(buttonVariants({ variant, size }), className);

  // No store set at all: nothing to show. A phone whose own store has no link gets a plain note instead of a
  // vanished button, so an iPhone visitor is told the truth rather than left with nothing to tap.
  if (!hasStore(store)) return null;
  if (platform === "ios" || platform === "android") {
    const url = platform === "ios" ? store.app_store_url : store.play_store_url;
    if (!url)
      return (
        <span
          className={cn(
            buttonVariants({ variant: "ghost", size }),
            "pointer-events-none border-[1.5px] border-sand-light",
            className,
          )}
        >
          Coming soon to {platform === "ios" ? "iPhone" : "Android"}
        </span>
      );
    return (
      <a href={url} className={classes}>
        {label}
      </a>
    );
  }
  if (platform === "server") {
    return (
      <a href="/download" className={classes}>
        {label}
      </a>
    );
  }
  return (
    <Popover>
      <PopoverTrigger className={classes}>{label}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-max gap-3.5 rounded-[14px] p-5"
      >
        <p className="text-sm font-semibold">Pick your store</p>
        <StoreBadges store={store} />
      </PopoverContent>
    </Popover>
  );
}
