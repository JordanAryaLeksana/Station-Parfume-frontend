import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ProductCard from "./product-card";
import {
  alRehab,
  botolSpray,
  exclusive,
  kasturi,
  starterPerfumes,
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

/** Two scents in one photo. Hover the card: the photo switches to the bottle
 * close-up and the mat lifts. Tab to it for the same effect plus a focus
 * ring. */
export const TwoScents: Story = { args: { product: kasturi } };

/** One scent. */
export const OneScent: Story = { args: { product: starterPerfumes[1] } };

/** The four Exclusive products share one name, so the card lists the scents. */
export const Exclusive: Story = { args: { product: exclusive } };

/** A general product: no photo yet, one price, out of stock. */
export const GeneralOutOfStock: Story = { args: { product: botolSpray } };

/** The longest name in the catalog. */
export const LongName: Story = { args: { product: alRehab } };

/** One column of the two-column phone grid. */
export const Phone: Story = {
  args: { product: kasturi },
  decorators: [
    (Story) => (
      <div className="w-41">
        <Story />
      </div>
    ),
  ],
};
