import { queryOptions, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/axios";
import type { QueryConfig } from "@/lib/query-client";

import type { CatalogFilters } from "./filters";
import type {
  CategoryWithCount,
  Envelope,
  ProductCard,
  ProductDetail,
} from "./types";

// Get Products
export async function getProducts(
  filters: CatalogFilters = {},
): Promise<ProductCard[]> {
  // axios builds the query string and skips undefined filters:
  // { note: "floral", grade: undefined } → /products?note=floral
  const { data } = await apiClient.get<Envelope<ProductCard[]>>("/products", {
    params: filters,
  });

  return data.data;
}

export function getProductsQueryOptions(filters: CatalogFilters = {}) {
  return queryOptions({
    queryKey: ["catalog", "products", filters],
    queryFn: () => getProducts(filters),
  });
}

type UseProductsOptions = {
  filters?: CatalogFilters;
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
};

export function useProducts({ filters, queryConfig }: UseProductsOptions = {}) {
  return useQuery({
    ...getProductsQueryOptions(filters),
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
