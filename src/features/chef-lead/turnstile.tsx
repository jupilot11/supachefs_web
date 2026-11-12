"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SRC}"]`,
    );
    const s =
      existing ??
      Object.assign(document.createElement("script"), {
        src: SRC,
        async: true,
      });
    s.addEventListener("load", () => resolve());
    s.addEventListener("error", () => reject(new Error("turnstile")));
    if (!existing) document.head.append(s);
  });
}

/**
 * Lazy: the Cloudflare script loads only when the widget scrolls near the viewport
 * or the form is touched. Rendered inside the <form>, it adds the hidden
 * cf-turnstile-response field itself. Tokens are single use, so `resetKey`
 * resets the widget after every response that is not a success.
 */
export function Turnstile({
  siteKey,
  resetKey,
}: {
  siteKey: string;
  resetKey: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let cancelled = false;
    const mount = () => {
      loadScript()
        .then(() => {
          if (cancelled || widget.current || !window.turnstile) return;
          widget.current = window.turnstile.render(el, {
            sitekey: siteKey,
            theme: "light",
          });
        })
        .catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          io.disconnect();
          mount();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey > 0 && widget.current) window.turnstile?.reset(widget.current);
  }, [resetKey]);

  return <div ref={box} className="min-h-[65px]" />;
}
