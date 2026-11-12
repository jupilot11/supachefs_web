import Link from "next/link";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="SupaChefs, home"
      className={`inline-flex min-h-11 items-center text-[20px] font-extrabold tracking-[-0.03em] text-primary no-underline lg:text-[22px] ${className ?? ""}`}
    >
      Supa<span className="text-brand">Chefs</span>
    </Link>
  );
}
