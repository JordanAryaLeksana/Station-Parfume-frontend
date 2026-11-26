import { aromasOf, type AromaNote } from "@/features/catalog/aroma";
import { findVariant } from "@/features/catalog/pricing";
import { getProductPhotos } from "@/features/catalog/product-photos";
import type { ProductCard, ProductDetail } from "@/features/catalog/types";

export const HERO_SLUGS = [
  "melati-keraton",
  "kasturi-kijang",
  "mawar-keraton",
  "malaikat-subuh",
] as const;

const HERO_VOLUME_ML = 30;

export type LiquidTone = "oud" | "amber" | "honey" | "straw" | "rose";

export type HeroScent = {
  id: number;
  name: string;
  slug: string;
  aromas: string;
  photo: string | null;
  family: AromaNote | null;
  liquid: LiquidTone;
  price: number | null;
};

export const LIQUID_OF: Record<AromaNote, LiquidTone> = {
  oud: "oud",
  woody: "amber",
  amber: "amber",
  balsamic: "oud",
  sweet: "honey",
  creamy: "honey",
  citrus: "straw",
  fresh: "straw",
  aromatic: "straw",
  fruity: "honey",
  floral: "rose",
  powdery: "rose",
  musk: "straw",
};

function priceOf(product: ProductCard | ProductDetail): number | null {
  if (!("variants" in product)) return null;
  const scent = product.scent_options.at(0);
  const size = product.size_options.find(
    (option) => option.volume_ml === HERO_VOLUME_ML,
  );
  if (!scent || !size) return null;

  return (
    findVariant(product, {
      scentId: scent.id,
      sizeId: size.id,
      concentration: "campur",
    })?.price ?? null
  );
}

export function toHeroScent(product: ProductCard | ProductDetail): HeroScent {
  const families = aromasOf(product);
  const main = families.at(0);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    aromas: families.map((aroma) => aroma.label).join(" · "),
    photo: getProductPhotos(product.slug)?.detail ?? null,
    family: main?.note ?? null,
    liquid: main ? LIQUID_OF[main.note] : "amber",
    price: priceOf(product),
  };
}
