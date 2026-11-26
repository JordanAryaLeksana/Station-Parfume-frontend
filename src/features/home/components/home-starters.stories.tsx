import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  kasturiKijang,
  starterPerfumes,
} from "@/features/catalog/components/product-fixtures";

import HomeStarters from "./home-starters";

const meta = {
  title: "Home/Starters",
  component: HomeStarters,
  parameters: { layout: "fullscreen" },
  args: { products: [kasturiKijang, ...starterPerfumes], total: 84 },
} satisfies Meta<typeof HomeStarters>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { products: null, total: null },
};
