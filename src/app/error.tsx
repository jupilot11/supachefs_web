"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center gap-4 py-16">
      <span className="caps-label text-orange-dark">Something went wrong</span>
      <h1 className="max-w-xl text-[36px] leading-[1.1] font-extrabold tracking-[-0.025em] text-primary lg:text-5xl">
        We couldn&apos;t load this page.
      </h1>
      <p className="max-w-md text-secondary">
        It&apos;s on our side, not yours. Try again in a moment.
      </p>
      <Button size="lg" onClick={reset}>
        Retry
      </Button>
    </section>
  );
}
