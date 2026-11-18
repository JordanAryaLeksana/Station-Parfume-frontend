import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import WhatsAppButton from "./whatsapp-button";

const meta = {
  title: "Components/WhatsApp Button",
  component: WhatsAppButton,
  parameters: { layout: "fullscreen" },
  argTypes: {
    message: {
      control: "text",
      description: "The text that opens in WhatsApp.",
    },
  },
  // The button is `fixed`, so it needs a page behind it. It only shows when
  // NEXT_PUBLIC_WHATSAPP_NUMBER is set (Storybook reads .env.local).
  decorators: [
    (Story) => (
      <div className="min-h-svh bg-background p-6 text-sm text-foreground">
        Tombol ada di pojok kanan bawah. Arahkan mouse ke tombol untuk melihat
        alamat wa.me di pojok kiri bawah browser.
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WhatsAppButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The default greeting. */
export const Default: Story = {};

/** A product page's own message. */
export const CustomMessage: Story = {
  args: { message: "Halo, saya mau tanya soal wangi Kasturi" },
};
