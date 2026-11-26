import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
        "line",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
        "atelier",
      ],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/** `data-icon` trims the padding on the side that holds the icon. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        Add product
      </Button>

      <Button variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>

      <Button size="icon" aria-label="Add product">
        <PlusIcon />
      </Button>
    </div>
  ),
};

/**
 * `asChild` gives the button's look to the element inside it. Use it for
 * navigation, so the result is a real link.
 */
export const AsLink: Story = {
  render: () => (
    <Button asChild variant="outline">
      <Link href="/login">Sign in</Link>
    </Button>
  ),
};

/** Keep the button disabled while its mutation is pending. */
export const Pending: Story = {
  args: {
    disabled: true,
    children: "Saving...",
  },
};

export const Atelier: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The shop's own button (DESIGN.md, Buttons): size `atelier` is 54px tall with uppercase label text and a slow shimmer on hover. The default variant takes the mode's primary color (Night Ink in Gading, gold on black); `line` is the ghost with a thin line that turns gold. Shown on paper and on the black frame.",
      },
    },
  },
  render: () => (
    <div className="grid gap-6">
      {[false, true].map((dark) => (
        <div
          key={String(dark)}
          className={`${dark ? "dark" : ""}flex flex-wrap items-center gap-3 p-8`}
        >
          <Button asChild size="atelier">
            <Link href="/koleksi">
              Mulai meracik
              <span
                aria-hidden
                className="transition-transform duration-400 ease-atelier group-hover/button:translate-x-[5px] motion-reduce:transition-none"
              >
                →
              </span>
            </Link>
          </Button>
          <Button asChild size="atelier" variant="line">
            <Link href="#aroma">Jelajah per aroma</Link>
          </Button>
        </div>
      ))}
    </div>
  ),
};
