"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

/**
 * The top half of the footer panel: the "ask a real person" prompt, shown on /faqs only.
 * A layout cannot take props from a page, so this reads the path; it still renders on the server.
 */
export function FooterLead({
  email,
  messengerUrl,
}: {
  email: string | null;
  messengerUrl: string | null;
}) {
  const pathname = usePathname();
  if (pathname !== "/faqs" || (!email && !messengerUrl)) return null;

  return (
    <section
      aria-labelledby="footer-lead-title"
      className="flex flex-col items-start gap-4 border-b border-white/12 px-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-7"
    >
      <div>
        <h2
          id="footer-lead-title"
          className="text-2xl leading-[1.1] font-extrabold tracking-[-0.03em] text-balance lg:text-[28px]"
        >
          Still have a question? Ask a real person.
        </h2>
        <p className="mt-1 text-[15px] text-orange-tint">
          Our team is in Cebu and replies within the day.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        {email && (
          <a
            href={`mailto:${email}`}
            className={buttonVariants({ variant: "inverse" })}
          >
            Email {email}
          </a>
        )}
        {messengerUrl && (
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-bold text-orange-tint underline underline-offset-4 hover:text-white"
          >
            Message us on Facebook
          </a>
        )}
      </div>
    </section>
  );
}
