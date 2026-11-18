import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import AromaMenu from "./aroma-menu";

const meta = {
  title: "Components/Aroma Menu",
  component: AromaMenu,
  parameters: { layout: "fullscreen" },
  // AromaMenu is one <li> of the header menu, and its panel is positioned
  // against the header. This decorator gives it a small stand-in header.
  decorators: [
    (Story) => (
      <>
        <div className="dark sticky top-0 z-50 bg-ink-2">
          <ul className="flex h-19.5 justify-center">
            <Story />
          </ul>
        </div>
        <div className="h-140 bg-background" />
      </>
    ),
  ],
} satisfies Meta<typeof AromaMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Hover over "Aroma", or Tab to it and press Enter. Escape closes it. */
export const Default: Story = {};

/** The panel already open (the story clicks "Aroma" for you). */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Aroma" }));
  },
};
