"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { DownloadButton } from "@/components/layout/download-button";
import { cn } from "cn";
import type { Audience, Faqs, Settings } from "@/lib/cms/schemas";
import { FaqAccordion } from "./faq-accordion";
import { Eyebrow } from "./shared";

// The tab lives in the URL hash so /faqs#chefs opens the Chefs tab and stays shareable.
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readHash = () => (location.hash === "#chefs" ? "chefs" : "customers");

function setTab(next: Audience) {
  history.replaceState(
    null,
    "",
    next === "chefs" ? "#chefs" : location.pathname + location.search,
  );
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

const closing: Record<Audience, { question: string }> = {
  customers: { question: "Ready to eat?" },
  chefs: { question: "Ready to cook?" },
};

export function FaqsView({
  data,
  settings,
}: {
  data: Record<Audience, Faqs>;
  settings: Settings;
}) {
  const tab = useSyncExternalStore<Audience>(
    subscribe,
    readHash,
    () => "customers",
  );
  const { contact, store } = settings;

  return (
    <>
      <section className="py-10 lg:py-16">
        <div className="container-page flex flex-col gap-3">
          <Eyebrow>FAQs</Eyebrow>
          <h1 className="text-[36px] leading-[1.1] font-extrabold tracking-[-0.025em] text-primary lg:text-[56px]">
            Questions, answered.
          </h1>
        </div>
      </section>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as Audience)}
        className="gap-0"
      >
        <div className="container-page">
          <TabsList className="h-auto w-full rounded-xl bg-subtle p-1 lg:w-auto">
            {(["customers", "chefs"] as const).map((a) => (
              <TabsTrigger
                key={a}
                value={a}
                className="h-11 rounded-lg px-5 text-sm font-semibold text-secondary data-active:bg-white data-active:text-primary data-active:shadow-xs"
              >
                {a === "customers" ? "For Customers" : "For Chefs"}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {(["customers", "chefs"] as const).map((a) => (
          <TabsContent key={a} value={a} className="py-8 lg:py-12">
            <div className="container-page grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
              <nav aria-label={`${a} topics`} className="hidden lg:block">
                <div className="sticky top-28 flex flex-col">
                  <span className="caps-label mb-2 text-secondary">Topics</span>
                  {data[a].groups.map((g, i) => (
                    <a
                      key={g.topic}
                      href={`#faq-${a}-${i}`}
                      className="flex min-h-11 items-center justify-between gap-3 text-primary hover:text-orange-dark"
                    >
                      <span>{g.topic}</span>
                      <span className="text-sm text-secondary">
                        {g.items.length}
                      </span>
                    </a>
                  ))}
                </div>
              </nav>
              <div className="flex flex-col gap-10">
                {data[a].groups.map((g, i) => (
                  <div
                    key={g.topic}
                    id={`faq-${a}-${i}`}
                    className="scroll-mt-28"
                  >
                    <h2 className="mb-2 text-[13px] font-bold tracking-[0.1em] text-orange-dark uppercase lg:text-2xl lg:tracking-normal lg:text-primary lg:normal-case">
                      {g.topic}
                    </h2>
                    <FaqAccordion items={g.items} openFirst={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <section className="bg-off-white py-10 lg:py-16">
        <div className="container-page flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-lg flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-[-0.015em] text-primary lg:text-4xl">
              Still have questions?
            </h2>
            <p className="text-secondary">
              Talk to a real person. Our team is in Cebu and replies within the
              day.
            </p>
            <div className="flex flex-wrap gap-x-5">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={cn(buttonVariants({ variant: "link" }))}
                >
                  Email {contact.email}
                </a>
              )}
              {contact.messenger_url && (
                <a
                  href={contact.messenger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "link" }))}
                >
                  Message us on Facebook
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <b className="text-lg text-primary">{closing[tab].question}</b>
            {tab === "customers" ? (
              <>
                <DownloadButton
                  store={store}
                  label="Download the App"
                  size="lg"
                />
                <Link
                  href="/become-a-chef"
                  className={buttonVariants({ variant: "link" })}
                >
                  Love to cook? Become a Chef →
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/become-a-chef"
                  className={buttonVariants({ size: "lg" })}
                >
                  Become a Chef
                </Link>
                <DownloadButton
                  store={store}
                  label="Just hungry? Download the App →"
                  variant="link"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
