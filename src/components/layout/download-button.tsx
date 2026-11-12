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
import { StoreBadges } from "./store-badges";
import { usePlatform } from "./use-platform";

type Props = VariantProps<typeof buttonVariants> & {
  store: Settings["store"];
  label: string;
  className?: string;
};

/**
 * Phone: a direct link to the matching store. Desktop: a popover with both
 * badges and a QR code. Before hydration it is a plain link to /download, so it
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

  if (platform === "ios" || platform === "android") {
    const url = platform === "ios" ? store.app_store_url : store.play_store_url;
    return (
      <a href={url ?? "/download"} className={classes}>
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
        <p className="text-sm font-semibold">
          Scan with your phone, or pick your store
        </p>
        <StoreBadges store={store} qr />
      </PopoverContent>
    </Popover>
  );
}
