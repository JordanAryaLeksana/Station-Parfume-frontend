import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import HomeStory from "./home-story";

const meta = {
  title: "Home/Story",
  component: HomeStory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HomeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
