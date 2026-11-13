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

test("desktop: Download the App opens a popover with both badges", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop-1280");
  await page.goto("/");
  await hydrated(page);
  await page
    .getByRole("banner")
    .getByRole("button", { name: "Download the App" })
    .click();
  await expect(page.getByText("Pick your store")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /App Store/ }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Google Play/ }).first(),
  ).toBeVisible();
  await expect(page.getByAltText(/QR code/)).toHaveCount(0);
});

test("home: the chefs and reviews are the API's data, with the right sections in the right order", async ({
  page,
}) => {
  await page.goto("/");
  const chefs = page.locator("#chefs");
  await expect(chefs.getByRole("heading", { level: 3 })).toHaveCount(5);
  await expect(chefs.getByText("Chef Maria Santos")).toBeVisible();
  await expect(chefs.getByText("(12 reviews)")).toBeVisible();
  // The section only shows with 3+ photos (the fixture gives 3 of 5); Maria has none, so she gets an
  // initials tile, and the chef with no reviews says so
  await expect(chefs.getByText("MS", { exact: true })).toBeVisible();
  await expect(chefs.getByText("No reviews yet")).toBeVisible();
  const reviews = page.locator("#testimonial");
  await expect(reviews.getByRole("listitem")).toHaveCount(2);
  await expect(reviews.getByText("Mae D.")).toBeVisible();
  await expect(
    reviews.getByRole("img", { name: "5 out of 5 stars" }),
  ).toBeVisible();
  // Chefs come before reviews, and neither shows the made-up seed people
  const [a, b] = await Promise.all([
    chefs.boundingBox(),
    reviews.boundingBox(),
  ]);
  expect(a!.y).toBeLessThan(b!.y);
  await expect(page.getByText("Dodong")).toHaveCount(0);
});

test("home: the five chefs sit in one row; on a phone the row swipes, the page does not", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator("#chefs li")).toHaveCount(5);
  await page.locator("#chefs").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200); // the staggered reveal has finished
  const boxes = await page.locator("#chefs li").evaluateAll((els) =>
    els
      .map((e) => e.getBoundingClientRect())
      .map((r) => ({
        top: Math.round(r.top),
        left: r.left,
        right: r.right,
        width: r.width,
      })),
  );
  // Same line for every card
  expect(new Set(boxes.map((b) => b.top)).size).toBe(1);
  const row = page.getByRole("list", { name: "Top chefs" });
  const m = await row.evaluate((el) => ({
    scrolls: el.scrollWidth > el.clientWidth + 1,
    pageScrolls: document.documentElement.scrollWidth > window.innerWidth,
  }));
  expect(m.pageScrolls).toBe(false);
  if (info.project.name === "desktop-1280") {
    // All five fit inside the viewport, evenly sized, nothing to scroll
    expect(boxes.every((b) => b.left >= 0 && b.right <= 1280)).toBe(true);
    expect(
      Math.max(...boxes.map((b) => b.width)) -
        Math.min(...boxes.map((b) => b.width)),
    ).toBeLessThan(2);
    expect(m.scrolls).toBe(false);
  } else {
    // On a phone the row is wider than the screen and the next card peeks in
    expect(m.scrolls).toBe(true);
    expect(boxes[1].left).toBeLessThan(390);
    expect(boxes[2].left).toBeGreaterThan(390);
  }
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
  // On Android the nav button links straight to the Google Play URL from the fixtures.
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Download the App" }),
  ).toHaveAttribute(
    "href",
    "https://play.google.com/store/apps/details?id=com.supachefs",
  );
  await ctx.close();
});

test("/faqs#chefs opens the Chefs tab and the hash follows the tabs", async ({
  page,
}) => {
  await page.goto("/faqs#chefs");
  await hydrated(page);
  const chefs = page.getByRole("tab", { name: "For Chefs" });
  await expect(chefs).toHaveAttribute("aria-selected", "true");
  // Scoped to the open tab's panel: "Start here" above repeats a few questions
  const panel = page.getByRole("tabpanel");
  await expect(
    panel.getByText("How long does it take to start?"),
  ).toBeVisible();
  await page.getByRole("tab", { name: "For Customers" }).click();
  await expect(page).not.toHaveURL(/#chefs/);
  await expect(panel.getByText("How do I order?")).toBeVisible();
  await chefs.click();
  await expect(page).toHaveURL(/#chefs$/);
});

test("/faqs: a chef topic link keeps the For Chefs tab selected", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop-1280"); // the topic sidebar is desktop-only
  await page.goto("/faqs#chefs");
  await hydrated(page);
  await page
    .getByRole("navigation", { name: "chefs topics" })
    .getByRole("link")
    .nth(1)
    .click();
  await expect(page.getByRole("tab", { name: "For Chefs" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.getByRole("tab", { name: "For Customers" }),
  ).toHaveAttribute("aria-selected", "false");
});

test("/faqs: search narrows the list, opens a lone hit, and clears", async ({
  page,
}) => {
  await page.goto("/faqs");
  await hydrated(page);
  const box = page.getByLabel("Search the questions");
  await box.fill("gcash");
  await expect(page.getByText("1 result for “gcash”")).toBeVisible();
  await expect(
    page.locator("#faq-q-4").getByRole("button", { expanded: true }),
  ).toBeVisible();
  const panel = page.getByRole("tabpanel");
  await expect(panel.getByText("How do I order?")).toHaveCount(0);
  await box.fill("zzzz");
  await expect(
    page.getByRole("heading", { name: /Nothing matches/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).first().click();
  await expect(panel.getByText("How do I order?")).toBeVisible();
});

test("/faqs: Start here opens that answer and keeps the Chefs tab", async ({
  page,
}) => {
  await page.goto("/faqs");
  await hydrated(page);
  const pick = (name: string) =>
    page
      .getByRole("heading", { name: "Start here" })
      .locator("..")
      .getByRole("button", { name });
  await pick("How do you check chefs?").click();
  await expect(
    page.locator("#faq-q-7").getByRole("button", { expanded: true }),
  ).toBeVisible();

  await page.goto("/faqs#chefs");
  await hydrated(page);
  await pick("Can I pause my kitchen?").click();
  await expect(page.getByRole("tab", { name: "For Chefs" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.getByRole("button", {
      name: "Can I pause my kitchen?",
      expanded: true,
    }),
  ).toBeVisible();
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

  test("an invalid field errors on blur, clears when edited, and never scolds an empty one", async ({
    page,
  }) => {
    await open(page);
    const name = page.getByLabel("Full name");
    await name.focus();
    await name.blur();
    await expect(page.getByText("Enter your full name.")).toHaveCount(0);

    const email = page.getByLabel(/^Email/);
    await email.fill("not-an-email");
    await email.blur();
    await expect(
      page.getByText("Enter a valid email, or leave it blank."),
    ).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await email.fill("nena@email.com");
    await expect(
      page.getByText("Enter a valid email, or leave it blank."),
    ).toHaveCount(0);
  });

  test("an invalid submit is caught in the browser: no server action is sent", async ({
    page,
  }) => {
    const sent: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST" && r.headers()["next-action"])
        sent.push(r.url());
    });
    await open(page);
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Pick at least one day.")).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeFocused();
    expect(sent).toEqual([]);
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

  test("a blocked Turnstile script explains itself and offers a retry", async ({
    page,
  }) => {
    // Registered after the stub in beforeEach, so it wins.
    await page.route("https://challenges.cloudflare.com/**", (r) => r.abort());
    await open(page);
    await expect(
      page.getByRole("alert").filter({ hasText: "security check" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  });
});
