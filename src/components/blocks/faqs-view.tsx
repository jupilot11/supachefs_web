"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { DownloadButton } from "@/components/layout/download-button";
import { cn } from "cn";
import type { Audience, Faqs, Settings } from "@/lib/cms/schemas";
import { FaqAccordion } from "./faq-accordion";
import { filterGroups, START_HERE, startPicks } from "./faq-search";

// The tab lives in the URL hash so /faqs#chefs opens the Chefs tab and stays shareable.
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
// "#faq-chefs-N" are the chef topic anchors; they must keep the Chefs tab open.
const readHash = () =>
  /^#(chefs$|faq-chefs-)/.test(location.hash) ? "chefs" : "customers";

function setTab(next: Audience) {
  history.replaceState(
    null,
    "",
    next === "chefs" ? "#chefs" : location.pathname + location.search,
  );
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

const label: Record<Audience, string> = {
  customers: "For Customers",
  chefs: "For Chefs",
};
const intro: Record<Audience, string> = {
  customers:
    "Straight answers about ordering, paying and how we check every chef.",
  chefs: "Straight answers about starting, earning and running your kitchen.",
};
const closing: Record<Audience, string> = {
  customers: "Ready to eat?",
  chefs: "Ready to cook?",
};
const count = (groups: { items: unknown[] }[]) =>
  groups.reduce((n, g) => n + g.items.length, 0);

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
  // Search text and the open answer belong to one tab: switching tabs (or a hash change) starts them fresh.
  const [search, setSearch] = useState<{ tab: Audience; q: string }>({
    tab,
    q: "",
  });
  const [pick, setPick] = useState<{ tab: Audience; id: string | null } | null>(
    null,
  );
  const { contact, store } = settings;

  const query = search.tab === tab ? search.q : "";
  const visible = filterGroups(data[tab].groups, query);
  const total = count(visible);
  const other: Audience = tab === "chefs" ? "customers" : "chefs";
  const otherTotal = count(filterGroups(data[other].groups, query));
  const picks = startPicks(data[tab].groups, START_HERE[tab]);

  // Which answer is open: the user's own choice, else the only search hit, else (no search) the first.
  const onlyHit = total === 1 ? String(visible[0].items[0].id) : null;
  const firstId = String(data[tab].groups[0]?.items[0]?.id ?? "");
  const openId =
    pick?.tab === tab ? pick.id : query ? onlyHit : firstId || null;

  const switchTo = (next: Audience, keepQuery = false) => {
    setSearch({ tab: next, q: keepQuery ? query : "" });
    setPick(null);
    setTab(next);
  };
  const type = (q: string) => {
    setSearch({ tab, q });
    setPick(null);
  };
  const startHere = (id: string) => {
    setSearch({ tab, q: "" });
    setPick({ tab, id });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(
      () =>
        document.getElementById(`faq-q-${id}`)?.scrollIntoView({
          block: "center",
          behavior: reduce ? "auto" : "smooth",
        }),
      60,
    );
  };
  const anchor = (a: Audience, topic: string) =>
    `faq-${a}-${data[a].groups.findIndex((g) => g.topic === topic)}`;

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => switchTo(v as Audience)}
      className="gap-0"
    >
      <section
        className={cn(
          "py-10 transition-colors duration-300 lg:py-16",
          tab === "chefs"
            ? "bg-charcoal text-off-white"
            : "bg-orange-dark text-white",
        )}
      >
        <div className="container-page flex flex-wrap items-end gap-x-16 gap-y-10">
          <div className="flex min-w-0 flex-[999_1_26rem] flex-col gap-6">
            <h1 className="text-[clamp(44px,8.4vw,112px)] leading-[0.94] font-extrabold tracking-[-0.045em] text-balance">
              Questions, answered.
            </h1>
            <p className="max-w-[44ch] text-lg text-pretty">{intro[tab]}</p>

            <TabsList className="h-auto w-fit flex-wrap gap-2 bg-transparent p-0">
              {(["customers", "chefs"] as const).map((a) => (
                <TabsTrigger
                  key={a}
                  value={a}
                  className="h-12 flex-none rounded-full border-2 border-current/75 px-6 text-base font-bold text-white hover:text-white focus-visible:ring-0 data-active:border-off-white data-active:bg-off-white data-active:text-charcoal data-active:shadow-none"
                >
                  {label[a]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div>
              <label htmlFor="faq-search" className="sr-only">
                Search the questions
              </label>
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-secondary"
                />
                <Input
                  id="faq-search"
                  type="search"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => type(e.target.value)}
                  placeholder="Search “pay”, “delivery”…"
                  className="h-[60px] rounded-[14px] border-2 border-transparent bg-white pr-14 pl-14 text-[17px] font-semibold text-primary placeholder:font-medium placeholder:text-secondary focus-visible:border-transparent focus-visible:ring-0 md:text-[17px] [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => type("")}
                    className="absolute top-1/2 right-1.5 grid size-12 -translate-y-1/2 place-items-center rounded-xl text-primary hover:bg-orange-tint"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </button>
                )}
              </div>
              <p aria-live="polite" className="mt-3 text-sm font-semibold">
                {query
                  ? `${total} ${total === 1 ? "result" : "results"} for “${query.trim()}”`
                  : `${total} questions`}
              </p>
            </div>
          </div>

          {picks.length > 0 && (
            <div className="flex min-w-0 flex-[1_1_20rem] flex-col gap-2.5">
              <h2 className="mb-1 text-xl font-extrabold">Start here</h2>
              {picks.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => startHere(String(p.id))}
                  className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-white/15 px-5 py-4 text-left text-[19px] leading-snug font-bold transition-colors hover:bg-white/25"
                >
                  {p.question}
                  <span
                    aria-hidden="true"
                    className="grid size-10 flex-none place-items-center rounded-full bg-off-white text-charcoal"
                  >
                    <ArrowRight className="size-5" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {(["customers", "chefs"] as const).map((a) => {
        // A panel that is animating out keeps its own audience's questions, not the new tab's
        const groups = a === tab ? visible : data[a].groups;
        return (
          <TabsContent key={a} value={a} className="py-10 lg:py-16">
            <div className="container-page grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
              {groups.length > 0 && (
                <>
                  <nav aria-label={`${a} topics`} className="hidden lg:block">
                    <div className="sticky top-28 flex flex-col">
                      {groups.map((g) => (
                        <a
                          key={g.topic}
                          href={`#${anchor(a, g.topic)}`}
                          className="flex min-h-12 items-center gap-3 text-xl font-bold text-primary hover:text-orange-dark"
                        >
                          <span
                            aria-hidden="true"
                            className="size-2.5 flex-none rounded-[2px] bg-brand"
                          />
                          {g.topic}
                        </a>
                      ))}
                    </div>
                  </nav>
                  <nav
                    aria-label="Jump to a topic"
                    className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:-mx-10 md:px-10 lg:hidden"
                  >
                    {groups.map((g) => (
                      <a
                        key={g.topic}
                        href={`#${anchor(a, g.topic)}`}
                        className="inline-flex min-h-11 flex-none items-center rounded-full bg-orange-tint px-[18px] font-bold text-orange-deep"
                      >
                        {g.topic}
                      </a>
                    ))}
                  </nav>
                </>
              )}
              <div
                className={cn(
                  "flex min-w-0 flex-col gap-12",
                  groups.length > 0
                    ? "lg:col-start-2 lg:row-start-1"
                    : "lg:col-span-2",
                )}
              >
                {groups.map((g) => (
                  <div
                    key={g.topic}
                    id={anchor(a, g.topic)}
                    className="scroll-mt-28"
                  >
                    <h2 className="mb-5 text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] text-primary lg:text-[40px]">
                      {g.topic}
                    </h2>
                    <FaqAccordion
                      items={g.items}
                      value={
                        openId && g.items.some((i) => String(i.id) === openId)
                          ? [openId]
                          : []
                      }
                      onValueChange={(v) => setPick({ tab, id: v[0] ?? null })}
                    />
                  </div>
                ))}
                {groups.length === 0 && (
                  <div className="flex flex-col items-start gap-4 rounded-2xl bg-subtle p-6 lg:p-10">
                    <h2 className="text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] text-primary lg:text-4xl">
                      Nothing matches “{query.trim()}”.
                    </h2>
                    <p className="max-w-[52ch] text-lg text-subhead">
                      Try a shorter word
                      {otherTotal > 0 ? ", check the other tab," : ""} or email
                      us. A real person on our Cebu team replies within the day.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => type("")}
                        className={buttonVariants({ size: "lg" })}
                      >
                        Clear search
                      </button>
                      {otherTotal > 0 && (
                        <button
                          type="button"
                          onClick={() => switchTo(other, true)}
                          className={buttonVariants({
                            variant: "outline",
                            size: "lg",
                          })}
                        >
                          See {otherTotal} in {label[other]}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        );
      })}

      <section className="bg-charcoal py-12 text-off-white lg:py-20">
        <div className="container-page flex flex-wrap items-end justify-between gap-x-16 gap-y-10">
          <div className="flex min-w-0 flex-[999_1_24rem] flex-col gap-5">
            <h2 className="max-w-[16ch] text-[clamp(34px,4.2vw,56px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance">
              Still have a question? Ask a real person.
            </h2>
            <p className="max-w-[44ch] text-lg text-orange-tint">
              Our team is in Cebu and replies within the day.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className={buttonVariants({ variant: "inverse", size: "lg" })}
                >
                  Email {contact.email}
                </a>
              )}
              {contact.messenger_url && (
                <a
                  href={contact.messenger_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-bold text-orange-tint underline underline-offset-4 hover:text-white"
                >
                  Message us on Facebook
                </a>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_18rem] flex-col items-start gap-2">
            <b className="text-xl font-extrabold">{closing[tab]}</b>
            {tab === "customers" ? (
              <>
                <DownloadButton
                  store={store}
                  label="Download the App"
                  size="lg"
                  variant="inverse"
                />
                <Link
                  href="/become-a-chef"
                  className="inline-flex min-h-11 items-center font-bold text-orange-tint underline underline-offset-4 hover:text-white"
                >
                  Love to cook? Become a Chef
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/become-a-chef"
                  className={buttonVariants({ variant: "inverse", size: "lg" })}
                >
                  Become a Chef
                </Link>
                <DownloadButton
                  store={store}
                  label="Just hungry? Download the App"
                  variant="link"
                  className="text-orange-tint underline underline-offset-4 hover:text-white"
                />
              </>
            )}
          </div>
        </div>
      </section>
    </Tabs>
  );
}
