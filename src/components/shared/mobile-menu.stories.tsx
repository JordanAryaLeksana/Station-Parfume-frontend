import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import MobileMenu from "./mobile-menu";

const meta = {
  title: "Components/Mobile Menu",
  component: MobileMenu,
  parameters: { layout: "fullscreen" },
  globals: { viewport: { value: "mobile2" } },
  // A black bar like the phone header, so the menu button is visible.
  decorators: [
    (Story) => (
      <div className="dark flex h-16 items-center bg-ink-2 px-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MobileMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The menu button. Tap it to open the panel. */
export const Default: Story = {};

/**
 * The panel already open (the story taps the button for you).
 *
 * In Storybook, tapping a link does NOT close the panel: Storybook's stand-in
 * for next/link calls `preventDefault()` before `onClick`, so `SheetClose`
 * thinks the click was cancelled. The real next/link calls `onClick` first,
 * so in the app the panel closes. Use × or Escape to close it here.
 */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Buka menu" }));
  },
};
