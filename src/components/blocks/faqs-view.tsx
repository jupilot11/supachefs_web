"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import type { Audience, Faqs } from "@/lib/cms/schemas";
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
const count = (groups: { items: unknown[] }[]) =>
  groups.reduce((n, g) => n + g.items.length, 0);

export function FaqsView({ data }: { data: Record<Audience, Faqs> }) {
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
      <section className="py-12 lg:py-[72px]">
        <div className="container-page flex flex-wrap items-center gap-x-16 gap-y-10">
          <div className="flex min-w-0 flex-[1_1_28rem] flex-col gap-4 lg:gap-5">
            <span className="caps-label block text-orange-dark">Help · FAQs</span>
            <h1 className="max-w-4xl text-[36px] leading-[1.08] font-extrabold tracking-[-0.025em] text-balance text-primary lg:text-[56px] lg:leading-[1.04] lg:tracking-[-0.03em]">
              Questions, answered.
            </h1>
            <p className="max-w-[520px] text-secondary lg:text-[19px]">
              {intro[tab]}
            </p>

            <TabsList className="mt-1.5 h-auto! w-fit flex-wrap gap-2.5 bg-transparent p-0 lg:gap-3.5">
              {(["customers", "chefs"] as const).map((a) => (
                <TabsTrigger
                  key={a}
                  value={a}
                  className="h-[50px] flex-none rounded-[10px] border-[1.5px] border-brand px-6 text-[15px] font-bold tracking-[-0.01em] text-orange-dark hover:bg-orange-wash hover:text-orange-dark data-active:border-orange-dark data-active:bg-orange-dark data-active:text-white data-active:shadow-none data-active:hover:bg-orange-dark data-active:hover:text-white md:h-[54px] md:text-base"
                >
                  {label[a]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="max-w-[520px]">
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
                  className="h-14 rounded-xl border-[1.5px] bg-white pr-14 pl-[52px] text-[17px] font-medium text-primary placeholder:text-secondary md:text-[17px] [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => type("")}
                    className="absolute top-1/2 right-1.5 grid size-11 -translate-y-1/2 place-items-center rounded-xl text-primary hover:bg-orange-tint"
                  >
                    <X aria-hidden="true" className="size-5" />
                  </button>
                )}
              </div>
              <p
                aria-live="polite"
                className="mt-2.5 text-sm font-semibold text-secondary"
              >
                {query
                  ? `${total} ${total === 1 ? "result" : "results"} for “${query.trim()}”`
                  : `${total} questions`}
              </p>
            </div>
          </div>

          {picks.length > 0 && (
            <div className="flex min-w-0 flex-[1_1_22rem] flex-col gap-3 rounded-2xl bg-orange-wash p-6 lg:rounded-[18px] lg:p-7">
              <h2 className="mb-1 text-[22px] font-extrabold tracking-[-0.015em] text-primary">
                Start here
              </h2>
              {picks.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => startHere(String(p.id))}
                  className="flex min-h-[60px] items-center justify-between gap-4 rounded-[14px] bg-white py-3.5 pr-4 pl-5 text-left text-[17px] leading-snug font-bold text-primary transition-colors hover:bg-orange-tint"
                >
                  {p.question}
                  <span
                    aria-hidden="true"
                    className="grid size-9 flex-none place-items-center rounded-full bg-orange-tint text-orange-dark"
                  >
                    <ArrowRight className="size-[18px]" />
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
          <TabsContent key={a} value={a} className="bg-subtle py-10 lg:py-[88px]">
            <div className="container-page grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-16">
              {groups.length > 0 && (
                <>
                  <nav aria-label={`${a} topics`} className="hidden lg:block">
                    <div className="sticky top-28 flex flex-col">
                      {groups.map((g) => (
                        <a
                          key={g.topic}
                          href={`#${anchor(a, g.topic)}`}
                          className="flex min-h-12 items-center gap-3 text-lg font-bold text-primary hover:text-orange-dark"
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
                    <h2 className="mb-5 text-[28px] leading-[1.15] font-extrabold tracking-[-0.025em] text-primary lg:text-4xl">
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
                  <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-white p-6 lg:rounded-[18px] lg:p-10">
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
    </Tabs>
  );
}
