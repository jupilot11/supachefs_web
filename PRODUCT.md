# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two co-equal audiences, confirmed by the owner. Neither is secondary.

- **Customers in Cebu** (Lahug, Mandaue, Talamban, Banilad and nearby): people who want a home-cooked lunch or dinner and today scroll Facebook posts and wait for replies. Job: find a trustworthy chef nearby, order, pay, and get it picked up or delivered. They arrive to download the iPhone/Android app.
- **Home cooks in Cebu**: people who already cook for family and neighbours and want to sell on their own schedule. Job: decide whether this is worth doing, then apply through the chef form (name, mobile, area, how they heard of us).

## Product Purpose

SupaChefs is a marketplace where home chefs in Cebu sell homemade meals to nearby customers through a mobile app. This website is the marketing site: it explains the service to both audiences, answers their questions, sends customers to the app stores, and collects chef applications. Success is app downloads and completed chef applications.

## Positioning

Every chef is verified before going live: an ID check, a call with the SupaChefs team, and an in-person kitchen visit. A Facebook seller or a delivery app listing cannot truthfully make that claim. Lead with it; "a name and a face" and fair pricing are supporting points, not the headline claim.

## Operating Context

- Content comes from a Laravel CMS API (pages, FAQs, settings); the site is static and revalidated by tag. Dev and e2e use fixtures in `src/lib/cms/fixtures`.
- Orders and chef accounts live in the native app; the web has no checkout.
- Payment inside the app: GCash, Maya or card. Delivery by Lalamove with a fee shown before paying; pickup from the chef is free.
- Chef onboarding takes roughly 1-2 weeks (short call, kitchen visit, orientation, menu setup). Platform fee is 10%; 100% of tips go to the chef.
- Contact is `admin@supachefs.com`; social links are not set yet.

## Capabilities and Constraints

- Pages: home, how it works (customers, chefs), become a chef, about, FAQs (customers and chefs), privacy, terms.
- Chef application form posts to the CMS API, protected by Cloudflare Turnstile; Philippine mobile numbers are normalised and validated.
- Site language is plain English with Filipino/Cebuano food and family words (humba, danggit, ngohiong, lola, apo).
- Undecided: the food-safety details (permits, orientation, kitchen checklist). The fixtures carry `[Placeholder]` text for them; real wording is not yet available.

## Brand Commitments

Name: SupaChefs. Tone in existing copy is warm, neighbourly and concrete ("Food that tastes like home, cooked by your neighbors"). No further identity constraints were stated.

## Evidence on Hand

Confirmed by the owner: all current chef profiles (Nena, Jose, Dodong, Liza, Tess), the quote from Mae, the "Now live in Cebu" status, and the sample dishes are placeholders, not real proof. Do not present them as real customers, chefs or reviews, and do not invent ratings, counts, press or logos. Real chef and testimonial sections come from the API (`top-chefs`, `testimonials`) or stay hidden. No real photography exists in the repo; store badges (`public/badges`) and a download QR code (`public/download-qr.svg`) are the only brand assets.

## Product Principles

- Trust is the product: verification comes before taste, price or convenience.
- Serve both audiences equally; neither funnel should be buried by the other.
- Never fabricate proof. If real content is absent, show less, not a fake.
- Say it the way a Cebu neighbour would: specific dishes, places and people over generic food-delivery language.
- Every path ends in a clear action: download the app, or apply as a chef.

## Accessibility & Inclusion

No product-specific standard has been stated. Open: device mix and connection quality of the audience have not been confirmed (inferred, not stated: mostly phones).
