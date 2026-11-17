import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import UtilityBar from "./utility-bar";

const meta = {
    title: "Components/Utility Bar",
    component: UtilityBar,
    parameters: { layout: "fullscreen"},
    argTypes: {
        messages: {
            control: "object",
            description: "Messages that rotate in the middles of the bar."
        },
        interval: {
            control: {
                type: "number",
                min: 1000,
                step: 500,
            },
            description: "How long each messages stays, in milliseconds."
        },
    },
} satisfies Meta<typeof UtilityBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleMessage: Story = {
  args: { messages: ["Diracik setelah kamu memesan"] },
};

export const Fast: Story = {
  args: { interval: 1500 },
};