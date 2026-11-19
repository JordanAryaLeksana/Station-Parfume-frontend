import axios from "axios";
import { cacheLife, cacheTag } from "next/cache";

import { getProductDetail, getProducts } from "./api";
import type { CatalogFilters } from "./filters";
import type { ProductCard, ProductDetail } from "./types";

// Catalog loaders for server pages (/koleksi, /produk/[slug], the home page).
// Real slugs are lowercase words joined by single dashes, e.g. "exclusive-3".
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

export async function listProducts(
  filters: CatalogFilters = {},
): Promise<ProductCard[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  return getProducts(filters);
}

// Returns null when the product doesn't exist, so the page can call
// notFound(). Any other failure (500, timeout, backend down) is thrown on to
// error.tsx.
export async function findProduct(slug: string): Promise<ProductDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  // A slug that can't exist never reaches the backend.
  if (slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) return null;

  try {
    // `return await`, not `return`: without await the request fails after this try block has ended, and the catch below would never run.
    return await getProductDetail(slug);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}
