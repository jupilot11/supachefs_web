import type { Metadata, Viewport } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { PreviewBar } from "@/components/layout/preview-bar";
import { MotionRoot } from "@/components/motion/motion-root";
import { getSettings } from "@/lib/cms";
import { env } from "@/lib/env";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#E84C1E" };

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(env().NEXT_PUBLIC_SITE_URL),
    title: { default: "SupaChefs", template: "%s" },
    openGraph: { siteName: "SupaChefs", type: "website" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  const { social, contact } = settings;
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SupaChefs",
    url: env().NEXT_PUBLIC_SITE_URL,
    sameAs: [
      social.facebook_url,
      social.instagram_url,
      social.tiktok_url,
    ].filter(Boolean),
    ...(contact.email && {
      contactPoint: {
        "@type": "ContactPoint",
        email: contact.email,
        contactType: "customer support",
      },
    }),
  };

  return (
    <html lang="en" className={`${jakarta.variable} ${lora.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <MotionRoot>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-white focus:px-4 focus:py-3"
          >
            Skip to content
          </a>
          <PreviewBar />
          <Nav store={settings.store} />
          <main id="main">{children}</main>
          <Footer settings={settings} />
        </MotionRoot>
      </body>
    </html>
  );
}
