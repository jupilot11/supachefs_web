import { draftMode } from "next/headers";

export async function PreviewBar() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <div
      role="status"
      className="relative z-40 flex items-center justify-center gap-3 bg-charcoal px-4 py-2 text-[13px] font-semibold text-white"
    >
      Preview, not live
      <a
        href="/api/draft?exit=1"
        className="inline-flex min-h-11 items-center underline hover:text-orange-mid"
      >
        Exit preview
      </a>
    </div>
  );
}
