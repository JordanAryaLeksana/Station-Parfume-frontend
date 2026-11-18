import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ThemeToggle from "./theme-toggle";

const meta = {
  title: "Components/Theme Toggle",
  component: ThemeToggle,
  parameters: { layout: "fullscreen" },
  // A black bar like the header. Clicking the button switches the whole page,
  // because the mode is the `dark` class on <html>.
  decorators: [
    (Story) => (
      <>
        <div className="dark flex h-16 items-center bg-ink-2 px-5 text-cream">
          <Story />
        </div>
        <div className="h-60 bg-background p-6 text-sm text-foreground">
          Klik tombolnya: halaman ini ikut berganti terang atau gelap.
        </div>
      </>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Moon in light mode, sun in dark mode. */
export const Default: Story = {
  args: { className: "hover:text-gold-light" },
};
