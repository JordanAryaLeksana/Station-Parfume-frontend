import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Typography, { typographyStyles } from "./typography";

const sizes = Object.keys(typographyStyles.sizes) as Array<
  keyof typeof typographyStyles.sizes
>;

const meta = {
  title: "Components/Typography",
  component: Typography,
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: Object.keys(typographyStyles.variants),
    },
    size: {
      control: "select",
      options: sizes,
    },
    as: {
      control: "text",
      description: "The HTML element to render. Defaults to `p`.",
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * `as` sets the element and `size` sets the look, so a heading can keep the
 * right level for the page outline whatever size it is drawn at.
 */
export const Heading: Story = {
  args: {
    as: "h2",
    variant: "heading",
    size: "3xl",
    children: "Build faster. Design better.",
  },
};

export const Paragraph: Story = {
  args: {
    as: "p",
    variant: "paragraph",
    size: "2xl",
    children: "Build faster. Design better.",
  },
};
export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-4">
      {sizes.map((size) => (
        <div key={size} className="flex items-baseline gap-4">
          <Typography
            as="span"
            size="xs"
            className="w-10 shrink-0 text-muted-foreground"
          >
            {size}
          </Typography>

          <Typography variant="heading" size={size}>
            Build faster
          </Typography>
        </div>
      ))}
    </div>
  ),
};

/** Color is not a prop. Pass a Tailwind class instead. */
export const Muted: Story = {
  args: {
    size: "sm",
    className: "text-muted-foreground",
    children: "Small text for descriptions and metadata.",
  },
};
