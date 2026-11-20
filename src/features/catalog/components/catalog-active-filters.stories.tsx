import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { parseCatalogFilters } from "@/features/catalog/filters";

import CatalogActiveFilters from "./catalog-active-filters";

const meta = {
  title: "Catalog/Active Filters",
  component: CatalogActiveFilters,
  decorators: [
    (Story) => (
      <div className="w-180 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CatalogActiveFilters>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One chip for every choice that is on, plus "Hapus semua". Each chip links
 * to the same page without that one choice. */
export const SeveralFilters: Story = {
  args: {
    filters: parseCatalogFilters({
      letter: "b",
      note: ["floral", "woody"],
      grade: "regular",
      stock: "1",
      q: "bunga",
    }),
  },
};

/** A single choice: no "Hapus semua", the chip itself does it. */
export const OneFilter: Story = {
  args: { filters: parseCatalogFilters({ grade: "exclusive" }) },
};

/** No filter on: renders nothing (the canvas stays empty). */
export const NoFilters: Story = {
  args: { filters: parseCatalogFilters({}) },
};
