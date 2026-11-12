import type { Metadata } from "next";
import { LegalDocument } from "@/components/blocks/legal";
import { getLegal } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { title } = await getLegal("terms");
  return { title: `${title} | SupaChefs`, alternates: { canonical: "/terms" } };
}

export default function Page() {
  return <LegalDocument page="terms" />;
}
