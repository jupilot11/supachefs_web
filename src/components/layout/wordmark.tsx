import Image from "next/image";
import Link from "next/link";

export function Wordmark({
  className,
  logoUrl,
}: {
  className?: string;
  logoUrl?: string | null;
}) {
  return (
    <Link
      href="/"
      aria-label="SupaChefs, home"
      className={`inline-flex min-h-11 items-center no-underline ${className ?? ""}`}
    >
      <Image
        src={logoUrl || "/images/supachefs-wordmark.png"}
        // shortcut: unoptimized so an admin-uploaded host outside remotePatterns cannot crash the page, optimize if logos get large.
        unoptimized={!!logoUrl}
        alt=""
        width={800}
        height={182}
        priority
        className="h-[22px] w-auto lg:h-[26px]"
      />
    </Link>
  );
}
