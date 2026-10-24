import React from "react";
import type { Preview } from "@storybook/react-vite";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import "./globals.css";

// Theme labels mapped to the actual `[data-theme="..."]` selectors in
// tokens/themes.css. The default (Warm Amber) uses no attribute value (empty
// string) — matches the :root block.
const THEMES: Record<string, string> = {
  "Warm Amber (default)": "",
  Brutalist: "brutalist",
  Ocean: "ocean",
  Sakura: "sakura",
  Midnight: "midnight",
  Forest: "forest",
  Mono: "mono",
  Studio: "studio",
};
const DEFAULT_THEME = "Warm Amber (default)";

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
      if (context.viewMode === "docs") {
        // A docs page renders every story into ONE document, and a story can
        // pin its own mode (the `…Dark` twins). Toggling <html> here let the
        // last story rendered decide for the whole page — with the toolbar on
        // Light, every story on it came out dark. So in docs each story gets
        // its own scope: the theme attribute and `.dark` together on a wrapper,
        // as a theme's dark block needs, and <html> stays light.
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
        const theme = THEMES[context.globals.theme ?? DEFAULT_THEME] ?? "";
        return React.createElement(
          "div",
          {
            "data-theme": theme || undefined,
            className: dark ? "dark bg-background text-foreground p-4" : undefined,
            style: { colorScheme: dark ? "dark" : "light" },
          },
          Story(),
        );
      }
      document.documentElement.classList.toggle("dark", dark);
      // Native widgets (scrollbars, date pickers) follow the mode too.
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
      // The theme too, synchronously. The themes decorator below applies it in
      // an effect, which runs AFTER a story's play function: measured, a play
      // saw no `data-theme` at all, so every play ran in Warm Amber whatever the
      // toolbar said, and a contrast assertion "in every theme" checked one.
      const theme = THEMES[context.globals.theme ?? DEFAULT_THEME] ?? "";
      if (theme) document.documentElement.setAttribute("data-theme", theme);
      else document.documentElement.removeAttribute("data-theme");
      return Story();
    },
    withThemeByDataAttribute({
      themes: THEMES,
      defaultTheme: DEFAULT_THEME,
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
