import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/cms", () => ({
  getSettings: async () => ({
    store: { app_store_url: null, play_store_url: "https://play.google.com/store/apps/details?id=com.supachefs.supachef_app" },
  }),
}));

import { GET } from "./route";

// Behind the host's proxy the request arrives addressed to the bind address, not the public domain.
const open = (ua: string) => GET(new Request("https://0.0.0.0:3000/download", { headers: { "user-agent": ua } }));

describe("/download", () => {
  it("sends a desktop visitor to the public site's download section, not the server's bind address", async () => {
    const res = await open("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)");
    expect(res.headers.get("location")).toBe("http://localhost:3000/#download");
  });

  it("sends an iPhone to the download section while there is no App Store link", async () => {
    const res = await open("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)");
    expect(res.headers.get("location")).toBe("http://localhost:3000/#download");
  });

  it("sends an Android phone to the Play Store", async () => {
    const res = await open("Mozilla/5.0 (Linux; Android 14; Pixel 8)");
    expect(res.headers.get("location")).toBe("https://play.google.com/store/apps/details?id=com.supachefs.supachef_app");
  });
});
