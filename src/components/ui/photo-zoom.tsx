"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { XIcon, ZoomInIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Makes the photo it sits in clickable. A transparent button covers the photo (so the layout never changes) and
 * opens it full screen: it fits the screen, shows a placeholder until it has loaded, and closes with Esc, the X or a
 * click on the empty space. Put it inside a `relative` box that is the photo.
 */
export function PhotoZoom({
  src,
  alt,
  unoptimized,
}: {
  src: string;
  alt: string;
  /** Same as the photo it opens: for hosts next/image is not set up for. */
  unoptimized?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setLoaded(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt || "photo"}`}
        className="group absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand"
      >
        {/* Always visible so a phone, which has no hover, shows that the photo opens */}
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-white text-primary transition-transform group-hover:scale-105 motion-reduce:transition-none"
        >
          <ZoomInIcon className="size-[18px]" />
        </span>
      </button>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-charcoal/95 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[71] flex flex-col items-center justify-center gap-3 p-4 transition-opacity duration-150 outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
        >
          <Dialog.Title className="sr-only">
            {alt || "Photo preview"}
          </Dialog.Title>
          <Dialog.Close
            aria-label="Close preview"
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-white text-primary transition-colors hover:bg-orange-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
          >
            <XIcon className="size-5" />
          </Dialog.Close>
          <div className="relative h-[min(78dvh,900px)] w-[min(94vw,1100px)]">
            {!loaded && (
              <Skeleton
                role="status"
                aria-label="Loading photo"
                className="absolute inset-0 rounded-xl bg-white/15"
              />
            )}
            <Image
              src={src}
              alt={alt}
              fill
              sizes="94vw"
              unoptimized={unoptimized}
              onLoad={() => setLoaded(true)}
              className="object-contain"
            />
          </div>
          {alt && (
            <p className="max-w-full truncate text-sm text-white">{alt}</p>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
