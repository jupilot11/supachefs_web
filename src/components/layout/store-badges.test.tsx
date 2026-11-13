import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { hasStore } from "@/lib/cms/store";
import { DownloadButton } from "./download-button";
import { StoreBadges } from "./store-badges";

const IOS = "https://apps.apple.com/ph/app/supachefs/id1";
const PLAY = "https://play.google.com/store/apps/details?id=com.supachefs";
const none = { app_store_url: null, play_store_url: null };

// Server render = the "server" platform: every set store shows, and the download button is a plain /download link.
describe("a store whose link is not set never appears", () => {
  it("renders nothing at all when neither store is set", () => {
    expect(hasStore(none)).toBe(false);
    expect(renderToStaticMarkup(<StoreBadges store={none} />)).toBe("");
    expect(
      renderToStaticMarkup(<DownloadButton store={none} label="Get it" />),
    ).toBe("");
  });

  it("shows only Google Play when only its link is set, with no App Store badge", () => {
    const store = { app_store_url: null, play_store_url: PLAY };
    const html = renderToStaticMarkup(<StoreBadges store={store} />);
    expect(html).toContain(`href="${PLAY}"`);
    expect(html).toContain("Get it on Google Play");
    expect(html).not.toContain("App Store");
    expect(html).not.toContain("QR code");
  });

  it("shows only the App Store when only its link is set, with no Google Play badge", () => {
    const store = { app_store_url: IOS, play_store_url: null };
    const html = renderToStaticMarkup(<StoreBadges store={store} />);
    expect(html).toContain(`href="${IOS}"`);
    expect(html).toContain("Download on the App Store");
    expect(html).not.toContain("Google Play");
  });

  it("shows both official badges when both are set, and keeps the button", () => {
    const store = { app_store_url: IOS, play_store_url: PLAY };
    const html = renderToStaticMarkup(<StoreBadges store={store} />);
    expect(html).toContain("/badges/app-store.svg");
    expect(html).toContain("/badges/google-play.svg");
    expect(
      renderToStaticMarkup(<DownloadButton store={store} label="Get it" />),
    ).toContain('href="/download"');
  });
});
