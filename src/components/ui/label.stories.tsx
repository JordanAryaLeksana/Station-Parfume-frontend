import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";
import { Label } from "./label";

/** Inside a Field, use FieldLabel instead (see Components/Field). */
const meta = {
  title: "Components/Label",
  component: Label,
  args: {
    children: "Email",
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * `htmlFor` must match the `id` of the input, so a click on the label focuses
 * the input and screen readers announce them together.
 */
export const WithInput: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="label-story-email">Email</Label>
      <Input
        id="label-story-email"
        type="email"
        placeholder="you@example.com"
      />
    </div>
  ),
};
