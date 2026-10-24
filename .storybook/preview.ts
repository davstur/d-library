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
  // Light/dark, alongside the theme. Every theme ships a `.dark` block, and
  // before this toolbar no story could render one: the themes decorator sets
  // only `data-theme`. Both land on <html>, because a theme's dark block is
  // `[data-theme="x"].dark` — the two must be on the SAME element.
  globalTypes: {
    mode: {
      description: "Colour mode (toggles .dark on <html>)",
      toolbar: {
        title: "Mode",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: "light" },
  decorators: [
    (Story, context) => {
      const dark = context.globals.mode === "dark";
      document.documentElement.classList.toggle("dark", dark);
      // Native widgets (scrollbars, date pickers) follow the mode too.
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
      return Story();
    },
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
