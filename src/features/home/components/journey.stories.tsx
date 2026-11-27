import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  emasAlmondDetail,
  kasturiKijangDetail,
} from "@/features/catalog/components/product-detail-fixtures";

import Journey from "./journey";
import JourneyLive from "./journey-live";
import { JourneyStagePlaceholder } from "./journey-stage";

const meta = {
  title: "Home/Journey",
  component: Journey,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The hero and the six order steps in one section over one sticky 3D world. Scrolling the steps moves the story: the chosen perfume's tube lights, the size rack brings the bottle, scrolling pours and the meter ends on the nota total, LUNAS, the bottle is packed, and the same box rides the rail into the van, which drives off. Text, prices and choices are HTML; without WebGL the atelier photo is shown and the steps still work.",
      },
    },
  },
  args: {
    whatsappHref: "https://wa.me/",
    children: (
      <JourneyLive
        products={[kasturiKijangDetail, emasAlmondDetail]}
        similarHref="https://wa.me/"
      />
    ),
  },
} satisfies Meta<typeof Journey>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Phone: Story = {
  globals: { viewport: { value: "mobile2" } },
};

export const Loading: Story = {
  args: { children: <JourneyStagePlaceholder /> },
  parameters: {
    docs: {
      description: {
        story:
          "While the featured perfumes load, the hero copy is already there and the stage keeps its place.",
      },
    },
  },
};
