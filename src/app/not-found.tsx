import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center gap-4 py-16">
      <span className="caps-label text-orange-dark">404</span>
      <h1 className="max-w-xl text-[36px] leading-[1.1] font-extrabold tracking-[-0.025em] text-primary lg:text-5xl">
        This page isn&apos;t on the menu.
      </h1>
      <p className="max-w-md text-secondary">
        The link may be old, or the page may have moved.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg" })}>
        Back to home
      </Link>
    </section>
  );
}
