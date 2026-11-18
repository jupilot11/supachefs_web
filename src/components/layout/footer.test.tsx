import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import { settingsFixture } from "@/lib/cms/fixtures/settings";
import type { Settings } from "@/lib/cms/schemas";
import { Footer } from "./footer";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

const html = (patch: Partial<Settings["contact"]> = {}, social = {}) =>
  renderToStaticMarkup(
    <Footer
      settings={{
        ...settingsFixture,
        contact: { ...settingsFixture.contact, ...patch },
        social: { ...settingsFixture.social, ...social },
      }}
    />,
  );

beforeEach(() => vi.mocked(usePathname).mockReset());

describe("the footer panel", () => {
  it("shows the contact prompt on /faqs with the email button", () => {
    vi.mocked(usePathname).mockReturnValue("/faqs");
    const out = html();
    expect(out).toContain("Still have a question? Ask a real person.");
    expect(out).toContain('href="mailto:admin@supachefs.com"');
  });

  it("is the logo, link columns, app badges and legal on every other page", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const out = html();
    expect(out).not.toContain("Still have a question");
    for (const label of ["For customers", "For chefs", "Company", "Legal"])
      expect(out).toContain(`aria-label="${label}"`);
    expect(out).toContain('href="/become-a-chef"');
    expect(out).toContain('href="/privacy"');
    expect(out).toContain("Get the app");
    expect(out).toContain("Download on the App Store");
  });

  it("drops the Get the app column when no store link is set", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const out = renderToStaticMarkup(
      <Footer
        settings={{
          ...settingsFixture,
          store: { app_store_url: null, play_store_url: null },
        }}
      />,
    );
    expect(out).not.toContain("Get the app");
  });

  it("drops the contact prompt and the Contact link when no email is set", () => {
    vi.mocked(usePathname).mockReturnValue("/faqs");
    const out = html({ email: null });
    expect(out).not.toContain("Still have a question");
    expect(out).not.toContain("mailto:");
    expect(out).not.toContain(">Contact<");
  });

  it("keeps the prompt for Messenger alone, and adds social links only when set", () => {
    vi.mocked(usePathname).mockReturnValue("/faqs");
    const out = html(
      { email: null, messenger_url: "https://m.me/supachefs" },
      { instagram_url: "https://instagram.com/supachefs" },
    );
    expect(out).toContain("Message us on Facebook");
    expect(out).toContain('href="https://instagram.com/supachefs"');
    expect(out).not.toContain(">Facebook<"); // no facebook_url, so no footer link (Instagram above is the positive control)
    expect(out).not.toContain("TikTok");
  });
});
