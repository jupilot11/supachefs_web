"use client";

import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { paragraphs } from "./shared";

export type FaqEntry = { id: number; question: string; answer: string };

/**
 * One open at a time. Uncontrolled by default (the first starts open); the FAQs page passes `value` so
 * search and "Start here" can open an answer. The open row turns into a solid orange block.
 */
export function FaqAccordion({
  items,
  openFirst = true,
  value,
  onValueChange,
}: {
  items: FaqEntry[];
  openFirst?: boolean;
  value?: string[];
  onValueChange?: (open: string[]) => void;
}) {
  const state =
    value === undefined
      ? { defaultValue: openFirst && items[0] ? [String(items[0].id)] : [] }
      : { value, onValueChange };
  return (
    <Accordion className="gap-2.5" {...state}>
      {items.map((f) => (
        <AccordionItem
          key={f.id}
          id={`faq-q-${f.id}`}
          value={String(f.id)}
          className="scroll-mt-28 rounded-2xl border-0 bg-subtle transition-colors hover:bg-orange-wash data-open:bg-orange-dark data-open:text-white data-open:hover:bg-orange-dark"
        >
          <AccordionTrigger
            icon={
              <span
                aria-hidden="true"
                className="grid size-10 flex-none place-items-center rounded-full bg-orange-tint text-orange-dark transition-transform duration-300 ease-out group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:bg-white"
              >
                <Plus className="size-5" />
              </span>
            }
            className="min-h-[72px] items-center gap-4 rounded-2xl border-0 px-5 py-3.5 text-[17px] leading-snug font-bold tracking-[-0.01em] hover:no-underline focus-visible:ring-0 lg:text-xl"
          >
            {f.question}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex max-w-[64ch] flex-col gap-3 px-5 pt-0 pb-6 text-base leading-[1.65] lg:text-[17px]">
              {paragraphs(f.answer).map((p, idx) => (
                <p key={`${idx}-${p}`}>{p}</p>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
