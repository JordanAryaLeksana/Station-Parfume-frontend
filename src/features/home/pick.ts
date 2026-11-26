import type { ProductCard } from "@/features/catalog/types";

export function pickBySlug(
  products: ProductCard[],
  slugs: readonly string[],
): ProductCard[] {
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product) => product !== undefined);
}
