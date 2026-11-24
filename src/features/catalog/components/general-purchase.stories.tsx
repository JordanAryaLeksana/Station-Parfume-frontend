import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ProductDetail, Variant } from "@/features/catalog/types";

import GeneralPurchase from "./general-purchase";
import { botolSprayDetail, parfumMobilDetail } from "./product-detail-fixtures";

// The seed has no stock yet, so the fixtures are all out of stock. These
// helpers put some back: `available` per variant id (null = not counted).
function restocked(
  product: ProductDetail,
  stock: (variant: Variant, index: number) => number | null,
): ProductDetail {
  const variants = product.variants.map((variant, index) => {
    const available = stock(variant, index);
    return { ...variant, available, in_stock: available !== 0 };
  });
  return {
    ...product,
    variants,
    in_stock: variants.some((variant) => variant.in_stock),
  };
}

// The car perfume, every scent in stock. Jeruk has 3 left, the rest aren't
// counted.
const parfumMobilInStock = restocked(parfumMobilDetail, (_, index) =>
  index === 0 ? 3 : null,
);

// The car perfume with a few scents sold out.
const parfumMobilMixed = restocked(parfumMobilDetail, (_, index) =>
  [0, 4, 7].includes(index) ? 0 : 10,
);

// Two labels at two prices, like the Al Rehab oils (1 pcs and 12–60 pcs).
const twoPrices: ProductDetail = {
  ...botolSprayDetail,
  id: 214,
  name: "AL REHAB GREENTEA PARFUM ARAB",
  slug: "al-rehab-greentea-parfum-arab",
  price_min: 13000,
  price_max: 15000,
  in_stock: true,
  variants: [
    {
      id: 1166,
      label: "1pcs",
      name: "1pcs",
      code: "al-rehab-greentea-1pcs",
      price: 15000,
      in_stock: true,
      available: null,
    },
    {
      id: 1167,
      label: "12-60pcs",
      name: "12-60pcs",
      code: "al-rehab-greentea-12-60pcs",
      price: 13000,
      in_stock: true,
      available: null,
    },
  ],
};

const meta = {
  title: "Catalog/General Purchase",
  component: GeneralPurchase,
  argTypes: {
    product: {
      control: "object",
      description:
        "GET /products/{slug} of a general product (ProductDetail in types.ts).",
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
} satisfies Meta<typeof GeneralPurchase>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Twelve scents to choose from, all in stock. Jeruk has only 3 left, so +
 * stops at 3 there; switching to Jeruk with 5 chosen brings it down to 3. */
export const Labels: Story = {
  args: { product: parfumMobilInStock },
};

/** Some scents sold out: they say "habis", and picking one switches the
 * button off and turns the chat link into "Tanya stok". */
export const SomeSoldOut: Story = {
  args: { product: parfumMobilMixed },
};

/** Two labels at different prices: each choice shows its price. */
export const TwoPrices: Story = {
  args: { product: twoPrices },
};

/** One variant without a label: no choices, just the quantity and the bag. */
export const Single: Story = {
  args: { product: restocked(botolSprayDetail, () => null) },
};

/** Everything sold out (the seed today): the price stays, the button says
 * "Stok habis" and the chat link asks when it comes back. */
export const SoldOut: Story = {
  args: { product: parfumMobilDetail },
};

/** On a phone the panel takes the whole width, under the gallery. */
export const Phone: Story = {
  args: Labels.args,
  globals: { viewport: { value: "mobile2" } },
};
