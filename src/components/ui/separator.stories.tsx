import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-3 text-sm">
      <span>Products</span>
      <Separator {...args} />
      <span>Orders</span>
    </div>
  ),
};

/** A vertical separator takes the height of its row. */
export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-5 items-center gap-3 text-sm">
      <span>Products</span>
      <Separator {...args} />
      <span>Orders</span>
    </div>
  ),
};
