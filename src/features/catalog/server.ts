import axios from "axios";
import { cacheLife, cacheTag } from "next/cache";

import { getProductDetail, getProducts, type ProductQuery } from "./api";
import type { ProductCard, ProductDetail } from "./types";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 100;

export async function listProducts(
  query: ProductQuery = {},
): Promise<ProductCard[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  return getProducts(query);
}

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
