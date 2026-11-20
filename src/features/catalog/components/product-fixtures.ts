import type { Category, ProductCard } from "@/features/catalog/types";

const perfumeCategory: Category = {
  id: 15,
  name: "Parfum & Wewangian",
  slug: "parfum-wewangian",
  sort_order: 0,
  is_active: true,
  created_at: "2026-11-11T17:41:56.56177+07:00",
  updated_at: "2026-11-18T14:07:31.374598+07:00",
};

function perfume(
  card: Pick<
    ProductCard,
    "id" | "name" | "slug" | "note_primary" | "note_secondary" | "scents"
  > &
    Partial<ProductCard>,
): ProductCard {
  return {
    kind: "perfume",
    grade: "regular",
    category: perfumeCategory,
    price_min: 35000,
    price_max: 205000,
    in_stock: true,
    ...card,
  };
}

// Two scents in one photo.
export const kasturi = perfume({
  id: 158,
  name: "Kasturi",
  slug: "kasturi",
  note_primary: "oud",
  note_secondary: "woody",
  scents: ["Kasturi Kijang", "Kasturi Putih"],
});

// The four Exclusive products share one name; only their scents differ.
export const exclusive = perfume({
  id: 186,
  name: "Exclusive",
  slug: "exclusive-3",
  grade: "exclusive",
  note_primary: "sweet",
  note_secondary: "fresh",
  scents: ["Moonlight", "Opus Black", "Greekgodnes"],
  price_min: 45000,
  price_max: 255000,
});

// A general product: no photo yet, one price, out of stock.
export const botolSpray: ProductCard = {
  id: 188,
  kind: "general",
  name: "Botol spray",
  slug: "botol-spray",
  category: {
    id: 19,
    name: "Perlengkapan Rumah Lainnya",
    slug: "perlengkapan-rumah-lainnya",
    sort_order: 4,
    is_active: true,
    created_at: "2026-11-11T17:41:56.564349+07:00",
    updated_at: "2026-11-18T14:07:31.377542+07:00",
  },
  price_min: 5000,
  price_max: 5000,
  in_stock: false,
};

// The longest product name in the catalog.
export const alRehab: ProductCard = {
  id: 199,
  kind: "general",
  name: "AL REHAB / AL TAJH / NON ALKOHOL / PARFUM ARAB",
  slug: "al-rehab-al-tajh-non-alkohol-parfum-arab",
  category: perfumeCategory,
  price_min: 20000,
  price_max: 20000,
  in_stock: false,
};

// The eight "wangi untuk memulai" from the home page plan, in that order.
export const starterPerfumes: ProductCard[] = [
  kasturi,
  perfume({
    id: 166,
    name: "Melati Keraton",
    slug: "melati-keraton",
    note_primary: "floral",
    note_secondary: "woody",
    scents: ["Melati Keraton"],
  }),
  perfume({
    id: 179,
    name: "Sulthan",
    slug: "sulthan",
    note_primary: "oud",
    note_secondary: "woody",
    scents: ["Sulthan"],
  }),
  perfume({
    id: 163,
    name: "Malaikat Subuh",
    slug: "malaikat-subuh",
    note_primary: "musk",
    note_secondary: "oud",
    scents: ["Malaikat Subuh"],
  }),
  perfume({
    id: 165,
    name: "Mawar Keraton",
    slug: "mawar-keraton",
    note_primary: "floral",
    note_secondary: "woody",
    scents: ["Mawar Keraton"],
  }),
  perfume({
    id: 173,
    name: "Sabaya",
    slug: "sabaya",
    note_primary: "sweet",
    note_secondary: "woody",
    scents: ["Sabaya"],
  }),
  perfume({
    id: 181,
    name: "Vanilla",
    slug: "vanilla",
    note_primary: "creamy",
    note_secondary: "sweet",
    scents: ["Coconut", "Vanilla Ice", "Popcorn"],
    price_max: 155000,
  }),
  perfume({
    id: 160,
    name: "Lavender",
    slug: "lavender",
    note_primary: "floral",
    note_secondary: "fresh",
    scents: ["Lavender"],
    price_max: 155000,
  }),
];
