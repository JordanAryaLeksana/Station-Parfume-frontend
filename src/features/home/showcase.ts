import type { StaticImageData } from "next/image";

import { AROMAS, type AromaNote } from "@/features/catalog/aroma";
import { facetCounts } from "@/features/catalog/facets";
import { GRADES, NO_FILTERS } from "@/features/catalog/filters";
import { findVariant, priceBreakdown } from "@/features/catalog/pricing";
import { getProductPhotos } from "@/features/catalog/product-photos";
import type {
  Concentration,
  Grade,
  ProductCard,
  ProductDetail,
  Size,
} from "@/features/catalog/types";
import { pickBySlug } from "@/features/home/pick";
import { HOME_PHOTOS } from "@/features/home/photos";

export const STARTER_SLUGS = [
  "kasturi-kijang",
  "melati-keraton",
  "sulthan",
  "malaikat-subuh",
  "mawar-keraton",
  "sabaya",
  "vanilla-ice",
  "lavender",
] as const;

const AROMA_EXAMPLES = 3;

export function starterPerfumes(perfumes: ProductCard[]): ProductCard[] {
  const picked = pickBySlug(perfumes, STARTER_SLUGS);
  const others = perfumes.filter((perfume) => !picked.includes(perfume));

  return [...picked, ...others].slice(0, STARTER_SLUGS.length);
}

export type RateRange = { min: number; max: number };

export type PriceBoard = {
  grades: {
    grade: Grade;
    count: number;
    campur: RateRange;
    murni: RateRange;
  }[];
  bottle: RateRange;
  examples: {
    concentration: Concentration;
    prices: { ml: number; price: number }[];
  }[];
};

function range(values: number[]): RateRange {
  return { min: Math.min(...values), max: Math.max(...values) };
}

export function priceBoard(
  perfumes: ProductCard[],
  sizes: Size[],
): PriceBoard | null {
  const ordered = [...sizes].sort((a, b) => a.volume_ml - b.volume_ml);
  const smallest = ordered.at(0);
  const largest = ordered.at(-1);
  if (!smallest || !largest) return null;

  const rates = perfumes.flatMap((perfume) => {
    const campur =
      (perfume.price_min - smallest.bottle_price) / smallest.volume_ml;
    const murni =
      (perfume.price_max - largest.bottle_price) / largest.volume_ml;
    const sensible =
      Number.isInteger(campur) &&
      Number.isInteger(murni) &&
      campur > 0 &&
      murni >= campur;

    return sensible && perfume.grade
      ? [{ grade: perfume.grade, campur, murni }]
      : [];
  });

  const grades = GRADES.flatMap((grade) => {
    const own = rates.filter((rate) => rate.grade === grade);
    if (own.length === 0) return [];

    return [
      {
        grade,
        count: perfumes.filter((perfume) => perfume.grade === grade).length,
        campur: range(own.map((rate) => rate.campur)),
        murni: range(own.map((rate) => rate.murni)),
      },
    ];
  });

  const cheapest = grades.at(0);
  if (!cheapest) return null;

  return {
    grades,
    bottle: range(ordered.map((size) => size.bottle_price)),
    examples: (["campur", "murni"] as const).map((concentration) => ({
      concentration,
      prices: ordered.map((size) => ({
        ml: size.volume_ml,
        price: cheapest[concentration].min * size.volume_ml + size.bottle_price,
      })),
    })),
  };
}

export type Lane = {
  key: string;
  title: string;
  detail: string;
  from: number;
  unit: string | null;
  href: string;
  photo: StaticImageData | string | null;
  wide: boolean;
};

export function lanes(products: ProductCard[]): Lane[] {
  const perfumes = products.filter((product) => product.kind === "perfume");
  const general = products.filter((product) => product.kind === "general");
  const named = (pattern: RegExp) =>
    general.filter((product) => pattern.test(product.name));
  const posterOf = (items: ProductCard[]) =>
    pickBySlug(items, STARTER_SLUGS)
      .concat(items)
      .map((product) => getProductPhotos(product.slug)?.card)
      .find((photo) => photo !== undefined) ?? null;
  const single = (items: ProductCard[], fallback: string) => {
    const only = items.length === 1 ? items[0] : undefined;
    return only ? `/produk/${only.slug}` : fallback;
  };

  const regular = perfumes.filter((product) => product.grade === "regular");
  const exclusive = perfumes.filter((product) => product.grade === "exclusive");
  const mobil = named(/mobil/i);
  const souvenir = named(/souvenir/i);
  const diffuser = named(/diffuser/i);
  const supplies = named(/botol|bibit|kantong/i);

  const candidates: (Omit<Lane, "from"> & { items: ProductCard[] })[] = [
    {
      key: "regular",
      items: regular,
      title: "Parfum Regular",
      detail: `${regular.length} wangi · 20, 30, atau 50 ml`,
      unit: null,
      href: "/koleksi?grade=regular",
      photo: posterOf(regular),
      wide: true,
    },
    {
      key: "exclusive",
      items: exclusive,
      title: "Exclusive",
      detail: `${exclusive.length} wangi · 20, 30, atau 50 ml`,
      unit: null,
      href: "/koleksi?grade=exclusive",
      photo: posterOf(exclusive),
      wide: false,
    },
    {
      key: "mobil",
      items: mobil,
      title: "Parfum mobil",
      detail: `${mobil.length} pilihan, siap kirim`,
      unit: null,
      href: "/koleksi?kind=general&q=mobil",
      photo: HOME_PHOTOS.parfumMobil,
      wide: false,
    },
    {
      key: "souvenir",
      items: souvenir,
      title: "Souvenir pernikahan",
      detail: "Untuk pernikahan dan acara keluarga",
      unit: "/pcs",
      href: single(souvenir, "/koleksi?kind=general&q=souvenir"),
      photo: HOME_PHOTOS.souvenir,
      wide: true,
    },
    {
      key: "diffuser",
      items: diffuser,
      title: "Reed diffuser",
      detail: "Pengharum ruangan",
      unit: null,
      href: single(diffuser, "/koleksi?kind=general&q=diffuser"),
      photo: HOME_PHOTOS.reedDiffuser,
      wide: false,
    },
    {
      key: "perlengkapan",
      items: supplies,
      title: "Botol, bibit & kantong",
      detail: "Untuk meracik dan mengemas sendiri",
      unit: null,
      href: "/koleksi?kind=general",
      photo: null,
      wide: false,
    },
  ];

  return candidates.flatMap(({ items, ...lane }) =>
    items.length === 0
      ? []
      : [{ ...lane, from: Math.min(...items.map((item) => item.price_min)) }],
  );
}

export type AromaShowcase = {
  note: AromaNote;
  count: number;
  examples: { name: string; slug: string }[];
};

export function aromaShowcase(perfumes: ProductCard[]): AromaShowcase[] {
  const counts = facetCounts(perfumes, NO_FILTERS).notes;

  return AROMAS.map((aroma) => {
    const main = perfumes.filter(
      (perfume) => perfume.note_primary === aroma.note,
    );
    const second = perfumes.filter(
      (perfume) =>
        perfume.note_secondary === aroma.note &&
        perfume.note_primary !== aroma.note,
    );

    return {
      note: aroma.note,
      count: counts[aroma.note],
      examples: [...main, ...second]
        .slice(0, AROMA_EXAMPLES)
        .map(({ name, slug }) => ({ name, slug })),
    };
  });
}

export type PriceExample = {
  name: string;
  volumeMl: number;
  ratePerMl: number;
  bottlePrice: number;
  price: number;
};

export function priceExample(products: ProductDetail[]): PriceExample | null {
  for (const product of products) {
    const scent = product.scent_options.at(0);
    const size = product.size_options.find((option) => option.volume_ml === 30);
    if (!scent || !size) continue;

    const variant = findVariant(product, {
      scentId: scent.id,
      sizeId: size.id,
      concentration: "campur",
    });
    const breakdown = variant ? priceBreakdown(product, variant) : null;

    if (variant && breakdown) {
      return {
        name: product.name,
        volumeMl: breakdown.volumeMl,
        ratePerMl: breakdown.ratePerMl,
        bottlePrice: breakdown.bottlePrice,
        price: variant.price,
      };
    }
  }

  return null;
}
