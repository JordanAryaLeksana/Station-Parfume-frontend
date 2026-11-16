import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

/**
 * In a form, wrap the input in a Field (see Components/Field). An input on its
 * own needs an `aria-label`.
 */
const meta = {
  title: "Components/Input",
  component: Input,
  args: {
    "aria-label": "Product name",
    placeholder: "Parfum A",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NumberInput: Story = {
  args: {
    "aria-label": "Price",
    type: "number",
    min: 1,
    defaultValue: 150000,
  },
};

/** `aria-invalid` turns the border red. Set it from the form's errors. */
export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "A",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Parfum A",
  },
};
