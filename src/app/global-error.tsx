"use client";

import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-off-white p-6">
        <main className="flex max-w-md flex-col items-start gap-4">
          <span className="text-xl font-extrabold tracking-[-0.03em]">
            Supa<span className="text-brand">Chefs</span>
          </span>
          <h1 className="text-[32px] leading-[1.1] font-extrabold tracking-[-0.025em] text-primary">
            Something went wrong.
          </h1>
          <p className="text-secondary">
            We couldn&apos;t load the site. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-[50px] items-center rounded-[10px] bg-orange-dark px-6 font-bold text-white"
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  );
}
