"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { paragraphs } from "./shared";

export type FaqEntry = { id: number; question: string; answer: string };

/** One open at a time; the first starts open. Panel height animates (see ui/accordion). */
export function FaqAccordion({
  items,
  openFirst = true,
}: {
  items: FaqEntry[];
  openFirst?: boolean;
}) {
  return (
    <Accordion
      defaultValue={openFirst && items[0] ? [String(items[0].id)] : []}
      className="border-t border-sand-light"
    >
      {items.map((f) => (
        <AccordionItem
          key={f.id}
          value={String(f.id)}
          className="border-b border-sand-light"
        >
          <AccordionTrigger className="min-h-14 items-center rounded-none border-0 py-3.5 text-base font-semibold text-primary hover:no-underline lg:text-[17px]">
            {f.question}
          </AccordionTrigger>
          <AccordionContent className="text-secondary">
            <div className="flex flex-col gap-3 pb-4 text-[15px] leading-[1.65] lg:text-base">
              {paragraphs(f.answer).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
