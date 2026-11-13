# SupaChefs web

Marketing site for SupaChefs (Next.js App Router, Tailwind 4). Page content comes from the Laravel
CMS API; the chef application form posts to the same API.

## Setup

```bash
cp .env.example .env.local   # fill every value, see below
npm install
npm run dev
```

The server checks the environment when it starts (`src/instrumentation.ts`) and stops with a message
listing every missing or invalid variable. `next dev` therefore needs a complete `.env.local`.

| Variable | Used for |
| --- | --- |
| `API_BASE_URL` | Laravel API origin. Required for any production build, also used for `next/image` hosts (`*.supachefs.com` CDN hosts are allowed too, see `next.config.ts`). |
| `SITE_SERVER_SECRET` | Sent as `X-Site-Secret` on every API call. |
| `SITE_REVALIDATE_SECRET` | Protects `POST /api/revalidate`. |
| `SITE_PREVIEW_TOKEN` | Signs preview links and authorises draft reads. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, metadata. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile on the chef form. |
| `CMS_FIXTURES` | `1` reads `src/lib/cms/fixtures` instead of the API (dev, tests). |
| `CMS_FIXTURES_IN_PROD` | Must also be `1` for a production build to accept fixtures. Only the e2e config sets it. |

## Content and caching

Pages are static and tagged (`page:<slug>`, `faqs`, `settings`, `legal`). The CMS refreshes them by
calling:

```
POST /api/revalidate
x-revalidate-secret: <SITE_REVALIDATE_SECRET>
{ "tags": ["page:home", "faqs"] }
```

**Preview link:** `/api/draft?slug=<slug>&exp=<unix seconds>&sig=<hex>` where `sig` is the hex
HMAC-SHA256 of `"<slug>|<exp>"` keyed with `SITE_PREVIEW_TOKEN`. It turns draft mode on for every page
in that browser; `/api/draft?exit=1` turns it off.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test        # unit tests (vitest)
npm run e2e     # builds the app with fixtures and a mock API, then runs Playwright
```

CI (`.github/workflows/ci.yml`) runs all four.

## Deploying

- Response headers are set in `next.config.ts` (CSP limited to `frame-ancestors 'self'`, `base-uri`,
  `object-src`, plus `nosniff` and `Referrer-Policy`). Add the CMS admin origin to `frame-ancestors`
  if the admin embeds previews. Set HSTS at the host or CDN.
- The chef form forwards the leftmost `X-Forwarded-For` value to the API as `X-Client-IP`. Confirm how
  your host treats that header before relying on per-IP rate limits.
