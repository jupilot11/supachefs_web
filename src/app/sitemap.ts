import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const paths = [
  "/",
  "/how-it-works/customers",
  "/how-it-works/chefs",
  "/become-a-chef",
  "/about",
  "/faqs",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = env().NEXT_PUBLIC_SITE_URL;
  return paths.map((p) => ({ url: new URL(p, base).toString() }));
}
