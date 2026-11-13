import type { Audience } from "@/lib/cms/schemas";
import type { FaqEntry } from "./faq-accordion";

type Group = { topic: string; items: FaqEntry[] };

/** Every word typed must appear in the question or the answer. Groups left empty are dropped. */
export function filterGroups<G extends Group>(groups: G[], query: string): G[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return groups;
  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => {
        const text = `${i.question} ${i.answer}`.toLowerCase();
        return words.every((w) => text.includes(w));
      }),
    }))
    .filter((g) => g.items.length);
}

// shortcut: "Start here" finds its questions by wording because the CMS has no featured flag; upgrade when it does.
export const START_HERE: Record<Audience, RegExp[]> = {
  customers: [/check chefs/i, /how do i order/i, /how can i pay/i],
  chefs: [/how long/i, /limit on orders/i, /pause/i],
};

/** The first question matching each pattern; a pattern that matches nothing is skipped. */
export function startPicks(groups: Group[], patterns: RegExp[]): FaqEntry[] {
  const all = groups.flatMap((g) => g.items);
  return patterns.flatMap((p) => all.find((i) => p.test(i.question)) ?? []);
}
