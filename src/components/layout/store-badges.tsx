"use client";

import Image from "next/image";
import { Apple, Play } from "lucide-react";
import { cn } from "cn";
import type { Settings } from "@/lib/cms/schemas";
import { usePlatform } from "./use-platform";

type Store = Settings["store"];

function Badge({
  href,
  kicker,
  name,
  icon,
}: {
  href: string;
  kicker: string;
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex h-[50px] min-w-[170px] items-center gap-2.5 rounded-[10px] bg-near-black pr-[18px] pl-3 text-white transition-transform duration-150 ease-out hover:-translate-y-px active:translate-y-px"
    >
      <span aria-hidden="true" className="grid size-6 place-items-center">
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px]">{kicker}</span>
        <span className="text-[17px] font-semibold tracking-[-0.01em]">
          {name}
        </span>
      </span>
    </a>
  );
}

/**
 * Phone: only the matching store badge. Desktop (and before hydration): both,
 * plus a QR code when `qr` is set. A store URL the admin left empty falls back
 * to /download, which redirects at request time.
 */
export function StoreBadges({
  store,
  qr = false,
  row = false,
  className,
}: {
  store: Store;
  qr?: boolean;
  row?: boolean;
  className?: string;
}) {
  const platform = usePlatform();
  const ios = store.app_store_url ?? "/download";
  const android = store.play_store_url ?? "/download";
  const showIos = platform !== "android";
  const showAndroid = platform !== "ios";
  const showQr = qr && (platform === "desktop" || platform === "server");

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {showQr && (
        <div className="hidden shrink-0 flex-col items-center gap-1.5 lg:flex">
          <Image
            src="/download-qr.svg"
            alt="QR code: scan with your phone to download the SupaChefs app"
            width={112}
            height={112}
            unoptimized
            className="rounded-[10px] border-[1.5px] border-brand bg-white p-2.5"
          />
          <span className="text-xs text-secondary">Scan to download</span>
        </div>
      )}
      <div
        className={cn("flex gap-2.5", row ? "flex-row flex-wrap" : "flex-col")}
      >
        {showIos && (
          <Badge
            href={ios}
            kicker="Download on the"
            name="App Store"
            icon={<Apple className="size-5 fill-current" />}
          />
        )}
        {showAndroid && (
          <Badge
            href={android}
            kicker="GET IT ON"
            name="Google Play"
            icon={<Play className="size-5 fill-current" />}
          />
        )}
      </div>
    </div>
  );
}
