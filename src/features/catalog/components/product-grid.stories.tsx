import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProductGrid, { ProductGridSkeleton } from "./product-grid";
import {
  alRehab,
  botolSpray,
  exclusive,
  starterPerfumes,
} from "./product-fixtures";

const meta = {
  title: "Catalog/Product Grid",
  component: ProductGrid,
  parameters: { layout: "fullscreen" },
  args: {
    products: [...starterPerfumes, exclusive, botolSpray, alRehab],
    headingLevel: 2,
    eagerFirstRow: true,
  },
  argTypes: {
    headingLevel: { control: "inline-radio", options: [2, 3] },
    eagerFirstRow: {
      control: "boolean",
      description: "Load the first row's photos right away.",
    },
  },
  // The page container: 1320px wide at most, 40px gutter (20px on phones).
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-330 px-5 py-10 min-[980px]:px-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Four columns from 1180px, three from 980px (make the canvas narrower). */
export const Desktop: Story = {};

/** Two columns on phones. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2" } },
};

/** While the products load: the same grid with empty mats. */
export const Loading: Story = {
  render: () => <ProductGridSkeleton />,
};
