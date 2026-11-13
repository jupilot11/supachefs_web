import type { NextConfig } from "next";

// Same rule as fixturesEnabled() in src/lib/env.ts (a config file cannot import it).
const fixtures =
  process.env.CMS_FIXTURES === "1" &&
  (process.env.NODE_ENV !== "production" ||
    process.env.CMS_FIXTURES_IN_PROD === "1");
// No silent localhost fallback in production: images would build against a host that cannot work.
const apiBase =
  process.env.API_BASE_URL ||
  (process.env.NODE_ENV === "production" && !fixtures
    ? ""
    : "http://localhost:4010");
if (!apiBase)
  throw new Error("API_BASE_URL is required for a production build.");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Static, nonce-free headers: a nonce CSP needs dynamic rendering and would end the static pages.
  // frame-ancestors 'self': if the Laravel admin embeds a preview, add its origin here.
  // HSTS is left to the host or CDN.
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
  // The brief's model: fetch() with next.tags / next.revalidate (tag-based ISR).
  // create-next-app enables Cache Components by default, which replaces that model.
  cacheComponents: false,
  partialPrefetching: false,
  images: {
    // next/image only serves hosts listed here: the API host, plus the CDN the API
    // returns image URLs on (staging-cdn.supachefs.com, cdn.supachefs.com).
    // shortcut: one-level wildcard on supachefs.com, narrow it if other subdomains host user content.
    remotePatterns: [
      new URL(`${apiBase}/**`),
      { protocol: "https", hostname: "*.supachefs.com" },
    ],
  },
  // Hostinger kills Turbopack's child-process pool during the Tailwind loader step ("node process exited
  // before we could connect"). Worker threads run inside the Next process instead.
  // shortcut: Next falls back to child processes on Node >= 24.13.1, so keep the host on Node 22.
  experimental: { turbopackPluginRuntimeStrategy: "workerThreads" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
