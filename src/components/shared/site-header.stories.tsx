import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SiteHeader from "./site-header";

const meta = {
  title: "Components/Site Header",
  component: SiteHeader,
  parameters: { layout: "fullscreen" },
  // A tall page under the header, to check that it sticks while scrolling.
  decorators: [
    (Story) => (
      <>
        <Story />
        <div className="h-[150vh] bg-background p-10 text-sm text-foreground">
          Gulir ke bawah: header harus tetap menempel di atas.
        </div>
      </>
    ),
  ],
} satisfies Meta<typeof SiteHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Desktop: logo, menu with the Aroma panel, Cari/Akun/Tas. The text next to
 * the icons appears from 1180px. */
export const Desktop: Story = {};

/** The Aroma panel open (the story clicks "Aroma" for you). */
export const AromaOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Aroma" }));
  },
};

/** Phone: menu button, logo, and bag. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile2" } },
};
