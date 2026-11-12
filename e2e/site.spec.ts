import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  hydrated,
  ROUTES,
  scrollThrough,
  stubTurnstile,
  watchErrors,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await stubTurnstile(page);
});

for (const route of ROUTES) {
  test(`${route}: one h1, no console errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(route);
    await hydrated(page);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await scrollThrough(page);
    expect(errors).toEqual([]);
  });

  test(`${route}: axe has no serious or critical violations`, async ({
    page,
  }) => {
    await page.goto(route);
    await hydrated(page);
    await scrollThrough(page);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const bad = violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      bad.map(
        (v) =>
          `${v.id}: ${v.nodes
            .map((n) => n.target.join(" "))
            .slice(0, 4)
            .join(" | ")}`,
      ),
    ).toEqual([]);
  });

  test(`${route}: no horizontal scroll at 360px`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(route);
    await hydrated(page);
    await scrollThrough(page);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  for (const route of ROUTES) {
    test(`${route}: all section content is visible without scrolling`, async ({
      page,
    }) => {
      await page.goto(route);
      await hydrated(page);
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-reveal]")]
          .filter(
            (el) =>
              getComputedStyle(el).opacity !== "1" ||
              getComputedStyle(el).transform !== "none",
          )
          .map((el) => el.className.slice(0, 60)),
      );
      expect(hidden).toEqual([]);
    });
  }
});

test("desktop nav: How It Works dropdown opens by keyboard", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/");
  await hydrated(page);
  const trigger = page.getByRole("button", { name: "How It Works" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const customers = page.getByRole("link", { name: /For Customers/ });
  await expect(customers).toBeVisible();
  await expect(
    page.getByText("Order homemade meals in five steps"),
  ).toBeVisible();
  await expect(
    page.getByText("Cook from home, on your own schedule"),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(customers).toBeHidden();
  // and by mouse hover
  await trigger.hover();
  await expect(page.getByRole("link", { name: /For Chefs/ })).toBeVisible();
});

test("desktop: Download the App opens a popover with both badges and a QR code", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/");
  await hydrated(page);
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Download the App" })
    .click();
  await expect(
    page.getByText("Scan with your phone, or pick your store"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /App Store/ }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Google Play/ }).first(),
  ).toBeVisible();
  await expect(page.getByAltText(/QR code/).first()).toBeVisible();
});

test("mobile nav: sheet menu opens and closes by keyboard", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile-390");
  await page.goto("/");
  await hydrated(page);
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "For Customers" }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "Cook with us" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menu).toBeFocused();
});

test("mobile: Download the App links straight to the detected store", async ({
  browser,
}, info) => {
  test.skip(info.project.name !== "mobile-390");
  const ctx = await browser.newContext({
    baseURL: info.project.use.baseURL,
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
  });
  const page = await ctx.newPage();
  await page.goto("/");
  // After hydration the final CTA shows only the matching badge (before it, both).
  await expect(page.getByRole("link", { name: /App Store/ })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Google Play/ }).first(),
  ).toBeVisible();
  // Store URLs are null in fixtures, so the nav link falls back to /download.
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Download the App" }),
  ).toHaveAttribute("href", "/download");
  await ctx.close();
});

test("/faqs#chefs opens the Chefs tab and the hash follows the tabs", async ({
  page,
}) => {
  await page.goto("/faqs#chefs");
  await hydrated(page);
  const chefs = page.getByRole("tab", { name: "For Chefs" });
  await expect(chefs).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("How long does it take to start?")).toBeVisible();
  await page.getByRole("tab", { name: "For Customers" }).click();
  await expect(page).not.toHaveURL(/#chefs/);
  await expect(page.getByText("How do I order?")).toBeVisible();
  await chefs.click();
  await expect(page).toHaveURL(/#chefs$/);
});

test.describe("Become a Chef form", () => {
  const fill = async (page: import("@playwright/test").Page, name: string) => {
    await page.getByLabel("Full name").fill(name);
    await page.getByLabel("Mobile number").fill("917 123 4567");
    await page.getByLabel(/Barangay or area/).selectOption("Talamban");
    await page.getByLabel("What do you cook?").fill("Humba and pochero");
    await page.getByText("Mon", { exact: true }).click();
    await page.getByText("Sat", { exact: true }).click();
    await page
      .getByLabel("How did you hear about us?")
      .selectOption("Facebook");
    await page.waitForSelector('input[name="cf-turnstile-response"]', {
      state: "attached",
    });
  };
  const open = async (page: import("@playwright/test").Page) => {
    await page.goto("/become-a-chef");
    await hydrated(page);
    await page.locator("#apply").scrollIntoViewIfNeeded();
  };

  test("empty submit shows inline errors and focuses the first invalid field", async ({
    page,
  }) => {
    await open(page);
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Pick at least one day.")).toBeVisible();
    const name = page.getByLabel("Full name");
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", /full_name-error/);
    await expect(name).toBeFocused();
  });

  test("a valid submit shows the confirmation, focused", async ({ page }) => {
    await open(page);
    await fill(page, "Nena Cabahug");
    await page.getByRole("button", { name: "Send my application" }).click();
    const done = page
      .getByRole("status")
      .filter({ hasText: "Salamat! We got it." });
    await expect(done).toBeVisible();
    await expect(done).toBeFocused();
    await expect(page.getByLabel("Full name")).toHaveCount(0);
  });

  test("429 shows the rate-limit message, keeps the inputs and resets Turnstile", async ({
    page,
  }) => {
    await open(page);
    await fill(page, "ratelimit tester");
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(
      "Too many tries. Wait a minute and send again.",
    );
    await expect(page.getByLabel("Full name")).toHaveValue("ratelimit tester");
    await expect(page.getByLabel("Mobile number")).toHaveValue("917 123 4567");
    await expect(page.getByLabel("What do you cook?")).toHaveValue(
      "Humba and pochero",
    );
    await expect(page.getByLabel(/Barangay or area/)).toHaveValue("Talamban");
    await expect(page.getByLabel("Mon")).toBeChecked();
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __turnstileResets: number })
            .__turnstileResets,
      ),
    ).toBeGreaterThan(0);
  });

  test("a 422 from Laravel lands on the field", async ({ page }) => {
    await open(page);
    await fill(page, "dupe tester");
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.getByText("That number already applied.")).toBeVisible();
    await expect(page.getByLabel("Mobile number")).toBeFocused();
  });

  test("a 5xx shows the connection message and keeps the inputs", async ({
    page,
  }) => {
    await open(page);
    await fill(page, "boom tester");
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.locator('form [role="alert"]')).toContainText(
      "We couldn't send that. Check your connection and try again.",
    );
    await expect(page.getByLabel("Full name")).toHaveValue("boom tester");
  });
});
