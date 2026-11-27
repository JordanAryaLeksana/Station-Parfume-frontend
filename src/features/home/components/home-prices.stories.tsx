import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { kasturiKijangDetail } from "@/features/catalog/components/product-detail-fixtures";
import {
  emasAlmond,
  kasturiKijang,
  starterPerfumes,
} from "@/features/catalog/components/product-fixtures";
import { priceBoard } from "@/features/home/showcase";

import HomePrices from "./home-prices";

const meta = {
  title: "Home/Prices",
  component: HomePrices,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The formula in words, a 3D shelf with the 20, 30 and 50 ml bottles drawn in proportion to what they hold (with the cheapest campur price under each), and the price board. Without WebGL the shelf is left out and the size list stays.",
      },
    },
  },
  args: {
    board: priceBoard(
      [kasturiKijang, ...starterPerfumes, emasAlmond],
      kasturiKijangDetail.size_options,
    ),
  },
} satisfies Meta<typeof HomePrices>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { board: null, loading: true },
};

export const Phone: Story = {
  globals: { viewport: { value: "mobile2" } },
};
