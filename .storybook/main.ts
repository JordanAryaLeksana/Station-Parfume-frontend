import type { StorybookConfig } from "@storybook/nextjs-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  // Guides and their live examples are in docs/. The story of a component
  // sits next to the component.
  stories: [
    "../docs/**/*.mdx",
    "../docs/**/*.stories.tsx",
    "../src/**/*.stories.tsx",
  ],
  addons: ["@storybook/addon-docs"],
  // Serve public/ like Next does, so /products/*.jpg loads in stories.
  staticDirs: ["../public"],
  framework: "@storybook/nextjs-vite",

  // Storybook reports anonymous usage data to its maintainers by default.
  core: { disableTelemetry: true },

  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      // The app loads Tailwind through a Turbopack loader (next.config.ts).
      // Storybook runs on Vite, so it needs Tailwind's Vite plugin instead.
      plugins: [tailwindcss()],

      // "use client" means nothing to this bundler. Without this, the build
      // prints one warning for every file that has it.
      build: {
        rolldownOptions: { checks: { moduleLevelDirective: false } },
      },
    }),
};

export default config;
