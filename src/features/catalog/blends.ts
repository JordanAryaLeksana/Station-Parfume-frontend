import type { Concentration } from "@/features/catalog/types";

// How the two blends are named on the product page and the nota racik.
// "Murni" is what the shop calls bibit, "campur" what it calls parfum
// (PRODUCT.md, copy terms).
export const BLENDS: Record<
  Concentration,
  { name: string; alias: string; description: string }
> = {
  campur: {
    name: "Campur",
    alias: "parfum",
    description: "Lebih ringan, siap disemprot",
  },
  murni: {
    name: "Murni",
    alias: "bibit",
    description: "Pekat, tanpa campuran",
  },
};

// Campur first: it is what most buyers want, and the page opens on it.
export const BLEND_ORDER: readonly Concentration[] = ["campur", "murni"];
