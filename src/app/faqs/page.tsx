import type { Metadata } from "next";
import { FaqsView } from "@/components/blocks/faqs-view";
import { getFaqs } from "@/lib/cms";

// /faqs has no CMS page: the FAQs come from /faqs?audience=, the headings are fixed design copy.
export const metadata: Metadata = {
  title: "FAQs | SupaChefs",
  alternates: { canonical: "/faqs" },
};

export default async function Page() {
  const [customers, chefs] = await Promise.all([
    getFaqs("customers"),
    getFaqs("chefs"),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [...customers.groups, ...chefs.groups].flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.question,
        acceptedAnswer: { "@type": "Answer", text: i.answer },
      })),
    ),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <FaqsView data={{ customers, chefs }} />
    </>
  );
}
