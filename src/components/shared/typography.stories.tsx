import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Typography, {
  typographyStyles,
  type TypographyRole,
} from "./typography";

// Every DESIGN.md type role with a line of real shop text.
const ROLES: { role: TypographyRole; sample: React.ReactNode }[] = [
  { role: "display", sample: "Wangimu, diracik." },
  {
    role: "headline",
    sample: (
      <>
        Koleksi <em className="font-light text-gold-accent-soft">wangi</em>
      </>
    ),
  },
  { role: "title", sample: "Kasturi Kijang" },
  { role: "subtitle", sample: "Campur parfum" },
  {
    role: "body",
    sample:
      "Setiap wangi diracik per ml setelah kamu memesan, dalam ukuran 20, 30, atau 50 ml.",
  },
  { role: "caption", sample: "Rp1.500,00 per ml × 30 ml + botol Rp5.000,00" },
  { role: "label", sample: "Ukuran" },
  { role: "nav", sample: "Koleksi" },
  { role: "price", sample: "Rp35.000,00" },
  { role: "price-lg", sample: "Rp50.000,00" },
  { role: "accent", sample: "gaharu" },
];

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
 * The type roles of DESIGN.md. Use these for every block of text in the
 * shop: the role sets the font, size, weight, line height and tracking. The
 * old `heading` / `paragraph` + `size` below are kept only for the starter
 * pages (login, dashboard).
 */
export const Roles: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-6">
      {ROLES.map(({ role, sample }) => (
        <div
          key={role}
          className="grid grid-cols-[6rem_minmax(0,1fr)] items-baseline gap-4"
        >
          <Typography
            as="span"
            variant="caption"
            className="text-muted-foreground"
          >
            {role}
          </Typography>
          <Typography variant={role}>{sample}</Typography>
        </div>
      ))}
    </div>
  ),
};

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
