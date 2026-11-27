import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { kasturiKijangDetail } from "@/features/catalog/components/product-detail-fixtures";
import {
  emasAlmond,
  kasturiKijang,
  starterPerfumes,
} from "@/features/catalog/components/product-fixtures";
import { priceBoard } from "@/features/home/showcase";

import PriceBoard from "./price-board";

const meta = {
  title: "Home/Price Board",
  component: PriceBoard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="dark w-[27rem] max-w-[calc(100vw-2rem)] bg-background p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    board: priceBoard(
      [kasturiKijang, ...starterPerfumes, emasAlmond],
      kasturiKijangDetail.size_options,
    ),
  },
} satisfies Meta<typeof PriceBoard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The rates are worked out from the catalog: campur from each perfume's lowest price (20 ml), murni from its highest (50 ml), minus the bottle.",
      },
    },
  },
};

export const Loading: Story = {
  args: { board: null, loading: true },
};

export const Unavailable: Story = {
  args: { board: null },
};
