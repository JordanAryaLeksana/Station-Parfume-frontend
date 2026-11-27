import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { facetCounts } from "@/features/catalog/facets";
import {
  parseCatalogFilters,
  type CatalogFilters,
} from "@/features/catalog/filters";

import CatalogFilterSheet from "./catalog-filter-sheet";
import {
  attarGaharu,
  emasAlmond,
  botolSpray,
  starterPerfumes,
} from "./product-fixtures";

// Counts from the real facetCounts over the sample products.
const products = [...starterPerfumes, emasAlmond, botolSpray, attarGaharu];
const sheetArgs = (filters: CatalogFilters) => ({
  filters,
  counts: facetCounts(products, filters),
  resultCount: products.length,
});

const meta = {
  title: "Catalog/Filter Sheet",
  component: CatalogFilterSheet,
  // A phone: the button only shows below 980px.
  globals: { viewport: { value: "mobile2" } },
} satisfies Meta<typeof CatalogFilterSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Tap "Filter": the panel slides in from the right. In Storybook a tap on a
 * box goes nowhere (there is no page behind it). */
export const NoFilters: Story = { args: sheetArgs(parseCatalogFilters({})) };

/** Two filters on: the button shows "2", and the panel offers "Hapus
 * semua". */
export const TwoFilters: Story = {
  args: sheetArgs(parseCatalogFilters({ note: "floral", grade: "regular" })),
};
