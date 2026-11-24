import type { StaticImageData } from "next/image";

import { aromasOf } from "@/features/catalog/aroma";
import { getAromaPhoto } from "@/features/catalog/aroma-photos";
import { getProductPhotos } from "@/features/catalog/product-photos";

export type GalleryPhoto = {
  src: string | StaticImageData;
  // What the photo shows, read out by screen readers.
  alt: string;
  // A short name for its thumbnail button.
  label: string;
};

export function galleryPhotos(product: {
  slug: string;
  note_primary?: string | null;
  note_secondary?: string | null;
}): GalleryPhoto[] {
  const photos = getProductPhotos(product.slug);
  if (!photos) return [];

  const gallery: GalleryPhoto[] = [
    {
      src: photos.card,
      alt: "Botol-botol Station Parfume di atas nampan kayu",
      label: "Botol",
    },
    {
      src: photos.detail,
      alt: "Close-up botol Station Parfume",
      label: "Close-up botol",
    },
  ];

  // The main aroma's photo, or the second one's when the main has none.
  for (const aroma of aromasOf(product)) {
    const photo = getAromaPhoto(aroma.note);
    if (photo) {
      gallery.push({
        src: photo.src,
        alt: `Bahan aroma ${aroma.label}: ${photo.caption}`,
        label: `Aroma ${aroma.label}`,
      });
      break;
    }
  }
  return gallery;
}
