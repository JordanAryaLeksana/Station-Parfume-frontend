export type Envelope<T> = {
  message: string;
  data: T;
};

export type ProductKind = "perfume" | "general";
export type Grade = "regular" | "exclusive";
// murni = the pure perfume oil (bibit); campur = blended into a
// ready-to-wear perfume (parfum).
export type Concentration = "murni" | "campur";

export type Category = {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryWithCount = Category & {
  product_count: number;
};

export type ProductCard = {
  id: number;
  kind: ProductKind;
  name: string;
  slug: string;
  grade?: Grade;
  note_primary?: string;
  note_secondary?: string;
  category?: Category;
  image_url?: string;
  scents?: string[];
  price_min: number;
  price_max: number;
  // True when at least one variant can be bought now.
  in_stock: boolean;
};

export type ProductImage = {
  id: number;
  product_id: number;
  scent_id?: number; // set when the photo shows one scent only
  url: string;
  sort_order: number; // 0 = cover photo
  created_at: string;
};

// One scent of a perfume, with its rate per ml for each concentration.
export type Scent = {
  id: number;
  product_id: number;
  code: string;
  name: string;
  price_per_ml_murni: number | null; // null = no rate yet
  price_per_ml_campur: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// A bottle size (20, 30 or 50 ml) and the price of the empty bottle.
export type Size = {
  id: number;
  label: string;
  volume_ml: number;
  bottle_price: number;
  weight_gram: number;
  is_default: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Variant = {
  id: number;
  scent_id?: number;
  size_id?: number;
  concentration?: Concentration;
  label?: string;
  name: string;
  code: string;
  price: number; // what the buyer pays, in rupiah
  compare_at_price?: number; // the old, struck-through price
  in_stock: boolean;
  available: number | null; // stock left; null = not counted (always available)
};

// GET /products/{id-or-slug}: everything the product page needs. It repeats
// every card field, then adds the options and variants.
export type ProductDetail = ProductCard & {
  description: string;
  images: ProductImage[];
  scent_options: Scent[];
  size_options: Size[];
  concentrations: Concentration[];
  variants: Variant[];
};
