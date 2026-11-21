import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { facetCounts } from "@/features/catalog/facets";
import {
  parseCatalogFilters,
  type CatalogFilters,
} from "@/features/catalog/filters";

import CatalogFilterPanel from "./catalog-filter-panel";
import {
  alRehab,
  bacaratExclusive,
  botolSpray,
  starterPerfumes,
} from "./product-fixtures";

// The counts come from the real facetCounts over the sample products, so the
// story shows what the page would show for those eleven products.
const products = [...starterPerfumes, bacaratExclusive, botolSpray, alRehab];
const panelArgs = (filters: CatalogFilters) => ({
  filters,
  counts: facetCounts(products, filters),
});

const meta = {
  title: "Catalog/Filter Panel",
  component: CatalogFilterPanel,
  // The sidebar width on /koleksi.
  decorators: [
    (Story) => (
      <div className="w-62">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CatalogFilterPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Nothing chosen: every choice with its count. In Storybook a click goes
 * nowhere (there is no page behind it); on /koleksi it updates the list. */
export const NoFilters: Story = { args: panelArgs(parseCatalogFilters({})) };

/** Floral and Exclusive chosen. Choices that would show nothing are
 * disabled, e.g. "Mobil & souvenir": general products have no aroma. */
export const FloralExclusive: Story = {
  args: panelArgs(parseCatalogFilters({ note: "floral", grade: "exclusive" })),
};

/** Two aromas at once: either one may match. */
export const TwoAromas: Story = {
  args: panelArgs(parseCatalogFilters({ note: ["floral", "woody"] })),
};
