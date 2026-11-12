"use client";

import { useSyncExternalStore } from "react";

/** "server" = before hydration. Pages are statically cached, so the store is never picked on the server. */
export type Platform = "server" | "ios" | "android" | "desktop";

const subscribe = () => () => {};

function detect(): Platform {
  const ua = navigator.userAgent;
  // iPadOS reports a Mac user agent but has touch.
  if (
    /iPhone|iPad|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  )
    return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export const usePlatform = (): Platform =>
  useSyncExternalStore(subscribe, detect, () => "server");
