import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The brief's model: fetch() with next.tags / next.revalidate (tag-based ISR).
  // create-next-app enables Cache Components by default, which replaces that model.
  cacheComponents: false,
  partialPrefetching: false,
  images: {
    // API host for CMS images (next/image only serves hosts listed here).
    remotePatterns: [
      new URL(`${process.env.API_BASE_URL || "http://localhost:4010"}/**`),
    ],
  },
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
