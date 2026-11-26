import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import WhatsAppBand from "./whatsapp-band";

const meta = {
  title: "Home/WhatsApp Band",
  component: WhatsAppBand,
  parameters: { layout: "fullscreen" },
  args: { href: "https://wa.me/" },
} satisfies Meta<typeof WhatsAppBand>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
