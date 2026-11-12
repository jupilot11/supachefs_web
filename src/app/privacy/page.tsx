import type { Metadata } from "next";
import { LegalDocument } from "@/components/blocks/legal";
import { getLegal } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { title } = await getLegal("privacy");
  return {
    title: `${title} | SupaChefs`,
    alternates: { canonical: "/privacy" },
  };
}

export default function Page() {
  return <LegalDocument page="privacy" />;
}
