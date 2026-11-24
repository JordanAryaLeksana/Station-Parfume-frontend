import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { defaultSelection, type Selection } from "@/features/catalog/pricing";
import type { ProductDetail } from "@/features/catalog/types";

import {
  bacaratExclusiveDetail,
  kasturiKijangDetail,
} from "./product-detail-fixtures";
import ProductPurchase from "./product-purchase";

// The blend the page opens on, as page.tsx computes it.
function opening(product: ProductDetail): Selection {
  const selection = defaultSelection(product);
  if (!selection) throw new Error(`${product.slug} has no size or blend`);
  return selection;
}

const meta = {
  title: "Catalog/Product Purchase",
  component: ProductPurchase,
  argTypes: {
    product: {
      control: "object",
      description: "GET /products/{slug} (ProductDetail in types.ts).",
    },
    initialSelection: {
      control: "object",
      description: "What the panel opens on: defaultSelection(product).",
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
} satisfies Meta<typeof ProductPurchase>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A Regular perfume, opening on 30 ml campur. Pick a size or a blend: the
 * price and the nota follow, and the rows that changed flash gold. */
export const Regular: Story = {
  args: {
    product: kasturiKijangDetail,
    initialSelection: opening(kasturiKijangDetail),
  },
};

/** An Exclusive perfume: higher rates per ml (5.000 murni, 3.000 campur). */
export const Exclusive: Story = {
  args: {
    product: bacaratExclusiveDetail,
    initialSelection: opening(bacaratExclusiveDetail),
  },
};

/** On a phone the panel takes the whole width, under the gallery. */
export const Phone: Story = {
  args: Regular.args,
  globals: { viewport: { value: "mobile2" } },
};
