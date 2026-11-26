import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { parfumMobilDetail } from "@/features/catalog/components/product-detail-fixtures";
import {
  alRehab,
  bacaratExclusive,
  botolSpray,
  kasturiKijang,
  starterPerfumes,
} from "@/features/catalog/components/product-fixtures";
import { lanes } from "@/features/home/showcase";

import HomeLanes from "./home-lanes";

const meta = {
  title: "Home/Lanes",
  component: HomeLanes,
  parameters: { layout: "fullscreen" },
  args: {
    lanes: lanes([
      kasturiKijang,
      ...starterPerfumes,
      bacaratExclusive,
      botolSpray,
      alRehab,
      parfumMobilDetail,
    ]),
    souvenirHref: "https://wa.me/",
  },
} satisfies Meta<typeof HomeLanes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Each lane counts its products and shows the lowest price from the catalog. A lane without products is left out; a lane without a photo shows its price on a cream band until the owner's photo arrives.",
      },
    },
  },
};

export const Loading: Story = {
  args: { lanes: null },
};
