import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  emasAlmondDetail,
  kasturiKijangDetail,
  parfumMobilDetail,
} from "./product-detail-fixtures";
import ProductInfo from "./product-info";

const meta = {
  title: "Catalog/Product Info",
  component: ProductInfo,
  argTypes: {
    product: {
      control: "object",
      description: "GET /products/{slug} (ProductDetail in types.ts).",
    },
  },
  // The buy panel column of the product page on a 1280px screen.
  decorators: [
    (Story) => (
      <div className="w-120 max-w-[calc(100vw-2.5rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Kasturi Kijang has no description yet, so "Tentang wangi ini" is made
 * from its two aromas, Oud and Woody. Click a title to open or close it. */
export const Perfume: Story = { args: { product: kasturiKijangDetail } };

/** Sweet and Fresh. */
export const Exclusive: Story = { args: { product: emasAlmondDetail } };

/** A general product: shipping only, and "dikemas" instead of "diracik". */
export const General: Story = { args: { product: parfumMobilDetail } };
