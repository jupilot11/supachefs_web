import { getLegal } from "@/lib/cms";
import type { LegalPage } from "@/lib/cms/schemas";
import { paragraphs } from "./shared";

export async function LegalDocument({ page }: { page: LegalPage }) {
  const doc = await getLegal(page);
  const updated = doc.updated_at
    ? new Date(doc.updated_at).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Manila",
      })
    : null;
  return (
    <article className="container-page max-w-3xl py-12 lg:py-20">
      <h1 className="text-[36px] leading-[1.1] font-extrabold tracking-[-0.025em] text-primary lg:text-5xl">
        {doc.title}
      </h1>
      {updated && (
        <p className="mt-2 text-sm text-secondary">Last updated {updated}</p>
      )}
      <div className="mt-8 flex flex-col gap-4 text-secondary lg:text-lg">
        {paragraphs(doc.content).map((p, idx) => (
          <p key={`${idx}-${p}`} className="whitespace-pre-line">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
