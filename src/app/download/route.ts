import { getSettings } from "@/lib/cms";

// Request-time redirect: the QR code and no-JS download links point here, so it is never cached.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  const { store } = await getSettings();
  const target = /iPhone|iPad|iPod/.test(ua)
    ? store.app_store_url
    : /Android/.test(ua)
      ? store.play_store_url
      : null;
  // Desktop or an unset store URL: land on the home page's download section.
  return Response.redirect(target ?? new URL("/#download", request.url), 307);
}
