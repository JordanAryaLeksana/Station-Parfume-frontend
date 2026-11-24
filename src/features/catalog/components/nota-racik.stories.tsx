import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import NotaRacik from "./nota-racik";

const meta = {
  title: "Catalog/Nota Racik",
  component: NotaRacik,
  argTypes: {
    breakdown: {
      control: "object",
      description:
        "From priceBreakdown(product, variant); null shows the total only.",
    },
    total: {
      control: "number",
      description: "variant.price; null when the blend can't be bought.",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-100 max-w-[calc(100vw-2.5rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotaRacik>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Kasturi Kijang, 30 ml campur: 1.500 × 30 + botol 5.000 = 50.000. Change
 * the numbers in Controls to see the changed rows flash gold. */
export const Campur: Story = {
  args: {
    number: 162,
    scentName: "Kasturi Kijang",
    concentration: "campur",
    breakdown: {
      ratePerMl: 1500,
      volumeMl: 30,
      liquidPrice: 45000,
      bottlePrice: 5000,
    },
    total: 50000,
  },
};

/** Bacarat Exclusive, 50 ml murni: 5.000 × 50 + botol 5.000 = 255.000. */
export const Murni: Story = {
  args: {
    number: 120,
    scentName: "Bacarat",
    concentration: "murni",
    breakdown: {
      ratePerMl: 5000,
      volumeMl: 50,
      liquidPrice: 250000,
      bottlePrice: 5000,
    },
    total: 255000,
  },
};

/** Two bottles of 30 ml campur: the breakdown is per bottle, then "Jumlah ×
 * 2", and the total covers both (2 × 50.000). */
export const TwoBottles: Story = {
  args: {
    ...Campur.args,
    quantity: 2,
    total: 100000,
  },
};

/** The price doesn't match rate × ml + bottle (a special price set by the
 * admin): only the total, never a breakdown that disagrees with it. */
export const TotalOnly: Story = {
  args: {
    number: 162,
    scentName: "Kasturi Kijang",
    concentration: "campur",
    breakdown: null,
    total: 45000,
  },
};
