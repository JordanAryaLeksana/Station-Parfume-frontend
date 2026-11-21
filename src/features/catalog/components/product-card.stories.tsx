import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProductCard from "./product-card";
import {
  alRehab,
  bacaratExclusive,
  botolSpray,
  kasturiKijang,
} from "./product-fixtures";

const meta = {
  title: "Catalog/Product Card",
  component: ProductCard,
  argTypes: {
    product: {
      control: "object",
      description: "One product from GET /products (ProductCard in types.ts).",
    },
    headingLevel: {
      control: "inline-radio",
      options: [2, 3],
      description:
        "2 when the cards sit right under the page title (/koleksi), 3 under a section heading.",
    },
    eager: {
      control: "boolean",
      description: "Load the photo right away, for cards on screen at load.",
    },
  },
  // The card fills its grid column; 292px is one column on desktop.
  decorators: [
    (Story) => (
      <div className="w-73">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A Regular perfume. Hover the card: the photo switches to the bottle
 * close-up and the mat lifts. Tab to it for the same effect plus a focus
 * ring. */
export const Regular: Story = { args: { product: kasturiKijang } };

/** An Exclusive perfume: "Exclusive" on the mat, across from the atelier
 * number. A Regular perfume has the same name, so the link also says
 * "Exclusive" to screen readers. */
export const Exclusive: Story = { args: { product: bacaratExclusive } };

/** A general product: no photo yet, one price, out of stock. */
export const GeneralOutOfStock: Story = { args: { product: botolSpray } };

/** The longest name in the catalog. */
export const LongName: Story = { args: { product: alRehab } };

/** One column of the two-column grid on a 360px phone. "Exclusive" and the
 * number still share one line; the gold diamond hides for lack of room. */
export const Phone: Story = {
  args: { product: bacaratExclusive },
  decorators: [
    (Story) => (
      <div className="w-38">
        <Story />
      </div>
    ),
  ],
};
