import type { StaticImageData } from "next/image";

type HomePhoto =
  | "mejaRacik"
  | "menakar"
  | "kemasan"
  | "souvenir"
  | "parfumMobil"
  | "reedDiffuser";

export const HOME_PHOTOS: Record<HomePhoto, StaticImageData | null> = {
  mejaRacik: null,
  menakar: null,
  kemasan: null,
  souvenir: null,
  parfumMobil: null,
  reedDiffuser: null,
};
