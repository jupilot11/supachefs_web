// Test-only values; no real secrets.
process.env.CMS_FIXTURES = "1";
process.env.API_BASE_URL = "http://api.test";
process.env.SITE_SERVER_SECRET = "test-server-secret";
process.env.SITE_REVALIDATE_SECRET = "test-revalidate-secret";
process.env.SITE_PREVIEW_TOKEN = "test-preview-token";
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
