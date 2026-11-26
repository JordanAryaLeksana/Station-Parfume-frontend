import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { kasturiKijangDetail } from "@/features/catalog/components/product-detail-fixtures";
import { priceExample } from "@/features/home/showcase";

import HomeFaq from "./home-faq";

const meta = {
  title: "Home/FAQ",
  component: HomeFaq,
  parameters: { layout: "fullscreen" },
  args: {
    example: priceExample([kasturiKijangDetail]),
    souvenirFrom: 4900,
    similarHref: "https://wa.me/",
    souvenirHref: "https://wa.me/",
  },
} satisfies Meta<typeof HomeFaq>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCatalog: Story = {
  args: { example: null, souvenirFrom: null },
};
