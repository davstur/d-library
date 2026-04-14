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
      themes: {
        "Warm Amber": "",
        "Forest Sage": "forest-sage",
        "Slate Blue": "slate-blue",
        "Rose Quartz": "rose-quartz",
        "Deep Noir": "deep-noir",
        "Space Grotesk Amber": "space-grotesk-amber",
        "Terminal Green": "terminal-green",
      },
      defaultTheme: "Warm Amber",
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
