import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SiteFooter from "./site-footer";

const meta = {
  title: "Components/Site Footer",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Desktop: the round logo, three link columns, payments, and the base line.
 * The WhatsApp button shows only when NEXT_PUBLIC_WHATSAPP_NUMBER is set. */
export const Desktop: Story = {};

/** Phone: the logo block on top, link columns in two columns. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2" } },
};
