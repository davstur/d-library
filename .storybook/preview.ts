import React from "react";
import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "./globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    layout: "padded",
    a11y: { test: "todo" },
  },
  decorators: [
    withThemeByDataAttribute({
      // Theme labels mapped to the actual `[data-theme="..."]` selectors
      // in tokens/themes.css. The default (Warm Amber) uses no attribute
      // value (empty string) — matches the :root block.
      themes: {
        "Warm Amber (default)": "",
        Brutalist: "brutalist",
        Ocean: "ocean",
        Sakura: "sakura",
        Midnight: "midnight",
        Forest: "forest",
        Mono: "mono",
        Studio: "studio",
      },
      defaultTheme: "Warm Amber (default)",
      attributeName: "data-theme",
    }),
    // Constrain stories to mobile width
    (Story) => {
      return React.createElement(
        "div",
        { style: { maxWidth: 400, margin: "0 auto" } },
        React.createElement(Story)
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
