import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  bacaratExclusive,
  kasturiKijang,
  starterPerfumes,
} from "@/features/catalog/components/product-fixtures";
import { aromaShowcase } from "@/features/home/showcase";

import HomeAromas from "./home-aromas";

const meta = {
  title: "Home/Aromas",
  component: HomeAromas,
  parameters: { layout: "fullscreen" },
  args: {
    aromas: aromaShowcase([
      kasturiKijang,
      ...starterPerfumes,
      bacaratExclusive,
    ]),
  },
} satisfies Meta<typeof HomeAromas>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The families are tabs: click, hover with a mouse, or use the arrow keys, Home and End. A family without perfumes shows no examples and no button. The carousel at the top of the panel turns the chosen family's numbered tube to the front and lights it.",
      },
    },
  },
};

export const Phone: Story = {
  globals: { viewport: { value: "mobile2" } },
};
