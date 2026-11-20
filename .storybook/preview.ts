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

  // "Mode" button in the toolbar: light (Gading) or dark (Noir). It sets the
  // `dark` class on <html>, like the theme script does in the real app.
  globalTypes: {
    theme: {
      description: "Color mode",
      toolbar: {
        title: "Mode",
        icon: "mirror",
        items: [
          { value: "light", title: "Terang (Gading)", icon: "sun" },
          { value: "dark", title: "Gelap (Noir)", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle(
        "dark",
        context.globals.theme === "dark",
      );
      return Story();
    },
  ],

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
          "Catalog",
        ],
      },
    },
  },
};

export default preview;
