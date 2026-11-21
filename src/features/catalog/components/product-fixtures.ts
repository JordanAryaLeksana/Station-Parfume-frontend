import type { Category, ProductCard } from "@/features/catalog/types";

// Real data from GET /products, taken after the catalog became one product
// per perfume (21 Nov 2026).

const perfumeCategory: Category = {
  id: 8,
  name: "Parfum & Wewangian",
  slug: "parfum-wewangian",
  sort_order: 0,
  is_active: true,
  created_at: "2026-11-21T19:16:15.552335+07:00",
  updated_at: "2026-11-21T19:16:15.552335+07:00",
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

// A Regular perfume. Until its own photo arrives it shows the Kasturi
// poster, which it shares with Kasturi Putih.
export const kasturiKijang = perfume({
  id: 162,
  name: "Kasturi Kijang",
  slug: "kasturi-kijang",
  note_primary: "oud",
  note_secondary: "woody",
  scents: ["Kasturi Kijang"],
});

// An Exclusive perfume. A Regular perfume has the same name (slug "bacarat"),
// so the card's Exclusive label and link text tell them apart.
export const bacaratExclusive = perfume({
  id: 120,
  name: "Bacarat",
  slug: "bacarat-exclusive",
  grade: "exclusive",
  note_primary: "sweet",
  note_secondary: "fresh",
  scents: ["Bacarat"],
  price_min: 65000,
  price_max: 255000,
});

// A general product: no photo yet, one price, out of stock.
export const botolSpray: ProductCard = {
  id: 201,
  kind: "general",
  name: "Botol spray",
  slug: "botol-spray",
  category: {
    id: 12,
    name: "Perlengkapan Rumah Lainnya",
    slug: "perlengkapan-rumah-lainnya",
    sort_order: 4,
    is_active: true,
    created_at: "2026-11-21T19:16:15.554052+07:00",
    updated_at: "2026-11-21T19:16:15.554052+07:00",
  },
  price_min: 5000,
  price_max: 5000,
  in_stock: false,
};

// The longest product name in the catalog.
export const alRehab: ProductCard = {
  id: 212,
  kind: "general",
  name: "AL REHAB / AL TAJH / NON ALKOHOL / PARFUM ARAB",
  slug: "al-rehab-al-tajh-non-alkohol-parfum-arab",
  category: perfumeCategory,
  price_min: 20000,
  price_max: 20000,
  in_stock: false,
};

// Eight perfumes for the home page's "wangi untuk memulai", from the plan.
// Kasturi and Vanilla became Kasturi Kijang and Vanilla Ice when the groups
// were split; the final eight are chosen with the home page.
export const starterPerfumes: ProductCard[] = [
  kasturiKijang,
  perfume({
    id: 172,
    name: "Melati Keraton",
    slug: "melati-keraton",
    note_primary: "floral",
    note_secondary: "woody",
    scents: ["Melati Keraton"],
  }),
  perfume({
    id: 191,
    name: "Sulthan",
    slug: "sulthan",
    note_primary: "oud",
    note_secondary: "woody",
    scents: ["Sulthan"],
  }),
  perfume({
    id: 169,
    name: "Malaikat Subuh",
    slug: "malaikat-subuh",
    note_primary: "musk",
    note_secondary: "oud",
    scents: ["Malaikat Subuh"],
  }),
  perfume({
    id: 171,
    name: "Mawar Keraton",
    slug: "mawar-keraton",
    note_primary: "floral",
    note_secondary: "woody",
    scents: ["Mawar Keraton"],
  }),
  perfume({
    id: 184,
    name: "Sabaya",
    slug: "sabaya",
    note_primary: "sweet",
    note_secondary: "woody",
    scents: ["Sabaya"],
  }),
  perfume({
    id: 194,
    name: "Vanilla Ice",
    slug: "vanilla-ice",
    note_primary: "creamy",
    note_secondary: "sweet",
    scents: ["Vanilla Ice"],
    price_max: 155000,
  }),
  perfume({
    id: 166,
    name: "Lavender",
    slug: "lavender",
    note_primary: "floral",
    note_secondary: "fresh",
    scents: ["Lavender"],
    price_max: 155000,
  }),
];
