import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: [
    "../ui/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../forms/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/react-vite",
  viteFinal: (config) => {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    return config;
  },
};
export default config;
