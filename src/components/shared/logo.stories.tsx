import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Logo from "./logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["lockup", "badge"],
      description:
        "`lockup`: sprig + text, for the header. `badge`: the full round logo, for the footer and roomy pages.",
    },
    tone: {
      control: "inline-radio",
      options: ["dark", "light"],
      description:
        "`dark` on black (cream lines, gold brush), `light` on cream or paper (original black and pink).",
    },
    eager: {
      control: "boolean",
      description: "Load right away; use it for the header logo.",
    },
    className: {
      control: "text",
      description:
        "Sets the size, e.g. `h-12` for the lockup or `w-64` for the badge.",
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

const onDark: Story["decorators"] = [
  (Story) => (
    <div className="dark p-8">
      <Story />
    </div>
  ),
];

const onLight: Story["decorators"] = [
  (Story) => (
    <div className="bg-paper p-8">
      <Story />
    </div>
  ),
];

/** In the header: sprig + text on black. */
export const LockupOnDark: Story = {
  args: { variant: "lockup", tone: "dark" },
  decorators: onDark,
};

/** Sprig + text on a light background (original black). */
export const LockupOnLight: Story = {
  args: { variant: "lockup", tone: "light" },
  decorators: onLight,
};

/** The full round logo on black: cream lines and a faint gold brush. */
export const BadgeOnDark: Story = {
  args: { variant: "badge", tone: "dark" },
  decorators: onDark,
};

/** The full round logo on a light background: original colors (black + pink). */
export const BadgeOnLight: Story = {
  args: { variant: "badge", tone: "light" },
  decorators: onLight,
};
