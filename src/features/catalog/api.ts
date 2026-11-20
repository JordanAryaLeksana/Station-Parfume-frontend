import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";
import type { QueryConfig } from "@/lib/query-client";

import type { AromaNote } from "./aroma";
import type {
  CategoryWithCount,
  Envelope,
  Grade,
  ProductCard,
  ProductDetail,
  ProductKind,
} from "./types";

// The filters GET /products understands: one value each (api/openapi.yaml).
// /koleksi only sends `q` and applies its own multi-choice filters
// (facets.ts); a single-value query still suits lists like "more floral".
export type ProductQuery = {
  note?: AromaNote;
  grade?: Grade;
  kind?: ProductKind;
  q?: string;
};

// Get Products
export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductCard[]> {
  // axios builds the query string and skips undefined values:
  // { note: "floral", grade: undefined } → /products?note=floral
  const { data } = await apiClient.get<Envelope<ProductCard[]>>("/products", {
    params: query,
  });

  return data.data;
}

export function getProductsQueryOptions(query: ProductQuery = {}) {
  return queryOptions({
    queryKey: ["catalog", "products", query],
    queryFn: () => getProducts(query),
  });
}

type UseProductsOptions = {
  query?: ProductQuery;
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
};

export function useProducts({ query, queryConfig }: UseProductsOptions = {}) {
  return useQuery({
    ...getProductsQueryOptions(query),
    ...queryConfig,
  });
}

// Get Product Detail
export async function getProductDetail(slug: string): Promise<ProductDetail> {
  const { data } = await apiClient.get<Envelope<ProductDetail>>(
    `/products/${encodeURIComponent(slug)}`,
  );

  return data.data;
}

export function getProductDetailQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ["catalog", "product", slug],
    queryFn: () => getProductDetail(slug),
  });
}

type UseProductDetailOptions = {
  slug: string;
  queryConfig?: QueryConfig<typeof getProductDetailQueryOptions>;
};

export function useProductDetail({
  slug,
  queryConfig,
}: UseProductDetailOptions) {
  return useQuery({
    ...getProductDetailQueryOptions(slug),
    ...queryConfig,
  });
}

// Get Categories
export async function getCategories(): Promise<CategoryWithCount[]> {
  const { data } =
    await apiClient.get<Envelope<CategoryWithCount[]>>("/categories");

  return data.data;
}

export function getCategoriesQueryOptions() {
  return queryOptions({
    queryKey: ["catalog", "categories"],
    queryFn: getCategories,
  });
}

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

export function useCategories({ queryConfig }: UseCategoriesOptions = {}) {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  });
}
