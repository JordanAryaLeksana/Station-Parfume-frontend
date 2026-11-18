import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "Components/Sheet",
  component: SheetContent,
  args: { side: "right" },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["right", "left", "top", "bottom"],
      description: "The edge the panel slides in from.",
    },
    showCloseButton: {
      control: "boolean",
      description: "Show the × button in the top right corner.",
    },
  },
  // Click the button to open the panel.
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Buka panel</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>Judul panel</SheetTitle>
          <SheetDescription>
            Panel yang meluncur dari tepi layar. Dipakai untuk menu HP dan tas
            belanja.
          </SheetDescription>
        </SheetHeader>
        <p className="px-4 text-sm">Isi panel.</p>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Tutup</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof SheetContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Slides in from the right, like the shopping bag panel will. */
export const Right: Story = {};

/** Slides in from the left, like the phone menu. */
export const Left: Story = {
  args: { side: "left" },
};

/** Black theme: add the `dark` class to the panel itself, because it is
 * rendered outside the page (a portal). */
export const Dark: Story = {
  args: { side: "left", className: "dark" },
};
