"use client";

import React from "react";
import Image from "next/image";
import { cn } from "cn";

import type { GalleryPhoto } from "@/features/catalog/gallery";

// The main photo's width: the gallery column (7 of 12) minus the thumbnail
// column, inside the 1320px container.
const MAIN_SIZES = "(min-width: 1320px) 560px, (min-width: 980px) 44vw, 100vw";

type ProductGalleryProps = {
  photos: GalleryPhoto[];
  // Shown on the cream tile when there is no photo yet, like on the card.
  fallback: string;
};

// The product page gallery: one big matted photo and a thumbnail button for
// each photo (a column on the left from 980px, a row under it on phones).
// With a mouse, the photo zooms in where the pointer is.
export default function ProductGallery({
  photos,
  fallback,
}: ProductGalleryProps) {
  const [current, setCurrent] = React.useState(0);
  const [zoomed, setZoomed] = React.useState(false);
  const photo = photos.at(current);

  // The pointer's place in the frame becomes the point the photo grows
  // from. Mouse only: on touch screens the buyer pinches to zoom instead.
  function followPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const frame = event.currentTarget;
    const box = frame.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    frame.style.setProperty("--zoom-x", `${x}%`);
    frame.style.setProperty("--zoom-y", `${y}%`);
    setZoomed(true);
  }

  function show(index: number) {
    setCurrent(index);
    setZoomed(false);
  }

  return (
    <div className="min-[980px]:grid min-[980px]:grid-cols-[5.25rem_minmax(0,1fr)] min-[980px]:gap-4">
      {/* The photo, matted like on the card. */}
      <div className="bg-white p-3 pb-8 ring-1 ring-border min-[980px]:col-start-2 min-[980px]:row-start-1 min-[980px]:p-4 min-[980px]:pb-10 dark:bg-cream dark:ring-0">
        <div
          className={cn(
            "relative aspect-square overflow-hidden bg-cream-2",
            photo && "[@media(hover:hover)]:cursor-zoom-in",
          )}
          onPointerMove={photo ? followPointer : undefined}
          onPointerLeave={() => setZoomed(false)}
        >
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={MAIN_SIZES}
              loading="eager"
              className={cn(
                "object-cover transition-transform duration-500 ease-atelier motion-reduce:transition-none",
                zoomed && "scale-190",
              )}
              style={{
                transformOrigin: "var(--zoom-x, 50%) var(--zoom-y, 50%)",
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-6 pb-8 text-center">
              <p className="font-primary text-2xl leading-snug font-light text-balance text-ink italic min-[980px]:text-4xl">
                {fallback}
              </p>
              <span
                aria-hidden
                className="absolute inset-x-4 bottom-4 takar h-2"
              />
            </div>
          )}
        </div>
      </div>

      {photos.length > 1 && (
        // role="list": Safari drops the list role when list-style is none.
        <ul
          role="list"
          aria-label="Foto produk"
          className="mt-3 grid grid-cols-4 gap-2.5 min-[980px]:col-start-1 min-[980px]:row-start-1 min-[980px]:mt-0 min-[980px]:flex min-[980px]:flex-col min-[980px]:gap-3"
        >
          {photos.map((item, index) => (
            <li key={item.label}>
              {/* The ring uses the border token, which already follows the
                  mode: a dark: override here would beat the gold ring of
                  the chosen photo. */}
              <button
                type="button"
                aria-pressed={index === current}
                aria-label={`Foto ${index + 1} dari ${photos.length}: ${item.label}`}
                onClick={() => show(index)}
                className={cn(
                  "relative block aspect-square w-full bg-white p-1 ring-1 ring-border transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:bg-cream",
                  index === current && "ring-2 ring-gold-accent",
                )}
              >
                <span className="relative block size-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="84px"
                    className="object-cover"
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
