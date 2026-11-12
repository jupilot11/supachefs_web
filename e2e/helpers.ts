import type { Page } from "@playwright/test";

export const ROUTES = [
  "/",
  "/how-it-works/customers",
  "/how-it-works/chefs",
  "/become-a-chef",
  "/about",
  "/faqs",
  "/terms",
  "/privacy",
];

// Cloudflare's script is stubbed: render() drops the hidden token field the real widget adds.
const TURNSTILE_STUB = `
window.__turnstileResets = 0;
window.turnstile = {
  render(el) {
    const i = document.createElement("input");
    i.type = "hidden"; i.name = "cf-turnstile-response"; i.value = "test-token";
    el.append(i);
    return "w1";
  },
  reset() { window.__turnstileResets++; },
  remove() {},
};`;

export async function stubTurnstile(page: Page) {
  await page.route("https://challenges.cloudflare.com/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: TURNSTILE_STUB,
    }),
  );
}

/** Collects console errors and uncaught exceptions. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return errors;
}

/** Scrolls top to bottom so whileInView reveals fire, then returns to the top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, innerHeight / 2);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
    scrollTo(0, 0);
  });
  // let the last reveal animations finish before measuring contrast
  await page.waitForTimeout(800);
}

/** Waits for hydration: the download button swaps from a plain link to the popover trigger. */
export async function hydrated(page: Page) {
  await page.waitForFunction(
    () => !document.querySelector('header a[href="/download"]'),
  );
}
