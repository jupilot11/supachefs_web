// node e2e/screenshots.mjs  (server must be running on :3100)
import { chromium } from "@playwright/test";

const routes = {
  home: "/",
  "hiw-customers": "/how-it-works/customers",
  "hiw-chefs": "/how-it-works/chefs",
  "become-a-chef": "/become-a-chef",
  about: "/about",
  faqs: "/faqs",
  terms: "/terms",
  privacy: "/privacy",
};
const browser = await chromium.launch();
for (const [w, h] of [
  [390, 844],
  [1280, 800],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  for (const [name, path] of Object.entries(routes)) {
    await page.goto(`http://localhost:3100${path}`);
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `screenshots/${name}-${w}.png`,
      fullPage: true,
    });
  }
  await ctx.close();
}
await browser.close();
