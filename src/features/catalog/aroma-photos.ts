import type { StaticImageData } from "next/image";

import atelier from "@/assets/aroma/atelier.jpg";
import citrus from "@/assets/aroma/citrus.jpg";
import floral from "@/assets/aroma/floral.jpg";
import fruity from "@/assets/aroma/fruity.jpg";
import powdery from "@/assets/aroma/powdery.jpg";
import woody from "@/assets/aroma/woody.jpg";
import type { AromaNote } from "@/features/catalog/aroma";

// Ingredient photos for the aroma menu, cut from the owner's product posters.
// Only five families have one so far; the rest use the atelier photo.
export type AromaPhoto = {
  src: StaticImageData;
  // What the photo shows, e.g. "kamboja".
  caption: string;
};

const PHOTOS: Partial<Record<AromaNote, AromaPhoto>> = {
  floral: { src: floral, caption: "kamboja" },
  woody: { src: woody, caption: "kayu manis & bunga lawang" },
  fruity: { src: fruity, caption: "blueberry" },
  powdery: { src: powdery, caption: "bunga aster" },
  citrus: { src: citrus, caption: "jeruk" },
};

// The owner's bottles on the blending tray.
export const ATELIER_PHOTO: AromaPhoto = {
  src: atelier,
  caption: "diracik di Karawang",
};

// The photo for one aroma family, or undefined when it has none yet.
export function getAromaPhoto(note: AromaNote): AromaPhoto | undefined {
  return PHOTOS[note];
}
