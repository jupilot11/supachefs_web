import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DownloadButton } from "./download-button";
import { usePlatform } from "./use-platform";

vi.mock("./use-platform", () => ({ usePlatform: vi.fn() }));

const IOS = "https://apps.apple.com/ph/app/supachefs/id1";
const PLAY = "https://play.google.com/store/apps/details?id=com.supachefs";
const html = (store: {
  app_store_url: string | null;
  play_store_url: string | null;
}) =>
  renderToStaticMarkup(
    <DownloadButton store={store} label="Download the App" />,
  );

beforeEach(() => vi.mocked(usePlatform).mockReset());

describe("a phone whose own store link is not set", () => {
  it("tells an iPhone visitor the app is coming, with nothing to tap", () => {
    vi.mocked(usePlatform).mockReturnValue("ios");
    const out = html({ app_store_url: null, play_store_url: PLAY });
    expect(out).toContain("Coming soon to iPhone");
    expect(out).not.toContain("<a ");
    expect(out).not.toContain(PLAY); // never sends an iPhone to Google Play
  });

  it("does the same for Android when only the App Store is set", () => {
    vi.mocked(usePlatform).mockReturnValue("android");
    const out = html({ app_store_url: IOS, play_store_url: null });
    expect(out).toContain("Coming soon to Android");
    expect(out).not.toContain("<a ");
  });

  it("still links straight to the store when that phone's link is set", () => {
    vi.mocked(usePlatform).mockReturnValue("ios");
    const out = html({ app_store_url: IOS, play_store_url: PLAY });
    expect(out).toContain(`href="${IOS}"`);
    expect(out).not.toContain("Coming soon");
  });
});
