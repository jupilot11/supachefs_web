import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: "mobile-390",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: false,
        hasTouch: true,
      },
    },
    { name: "desktop-1280", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: [
    { command: "node e2e/mock-api.mjs", port: 4010, reuseExistingServer: true },
    {
      // Production build, fixtures for reads, mock API for the form.
      command: `npm run build && npx next start -p ${PORT}`,
      port: PORT,
      timeout: 240_000,
      reuseExistingServer: true,
      env: {
        CMS_FIXTURES: "1",
        CMS_FIXTURES_IN_PROD: "1",
        API_BASE_URL: "http://localhost:4010",
        SITE_SERVER_SECRET: "dev-server-secret",
        SITE_REVALIDATE_SECRET: "dev-revalidate-secret",
        SITE_PREVIEW_TOKEN: "dev-preview-token",
        NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      },
    },
  ],
});
