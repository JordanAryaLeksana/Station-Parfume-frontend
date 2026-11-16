import type { Preview } from "@storybook/nextjs-vite";

import { monoFont, primaryFont, secondaryFont } from "../src/lib/fonts";
import "../src/app/globals.css";

// The same font variables that src/app/layout.tsx puts on <html>.
document.documentElement.classList.add(
  primaryFont.variable,
  secondaryFont.variable,
  monoFont.variable,
  "antialiased",
);

const preview: Preview = {
  // Every component with stories gets a generated Docs page.
  tags: ["autodocs"],

  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true },
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Guides",
          [
            "Introduction",
            "Forms",
            "Data Fetching",
            "Client State",
            "Authentication",
          ],
          "Components",
        ],
      },
    },
  },
};

export default preview;
