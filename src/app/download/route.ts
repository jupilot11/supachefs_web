import { getSettings } from "@/lib/cms";
import { env } from "@/lib/env";

// Request-time redirect: the no-JS download links point here, so it is never cached.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Phones only: iPadOS sends a Mac user agent, so use-platform.ts also checks touch points client-side.
  const ua = request.headers.get("user-agent") ?? "";
  const { store } = await getSettings();
  const target = /iPhone|iPad|iPod/.test(ua)
    ? store.app_store_url
    : /Android/.test(ua)
      ? store.play_store_url
      : null;
  // Desktop or an unset store URL: land on the home page's download section. The public URL, not request.url:
  // behind the host's proxy that is the bind address (https://0.0.0.0:3000).
  return Response.redirect(target ?? new URL("/#download", env().NEXT_PUBLIC_SITE_URL), 307);
}
