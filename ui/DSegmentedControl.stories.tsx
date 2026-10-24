import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DSegmentedControl } from "./DSegmentedControl";

const meta: Meta<typeof DSegmentedControl> = {
  title: "DLibrary/UI/DSegmentedControl",
  component: DSegmentedControl,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DSegmentedControl>;

export const AllVariants: Story = {
  render: () => {
    const [view, setView] = React.useState("concept");
    const [grouped, setGrouped] = React.useState("a1");

    return (
      <div className="flex flex-col gap-6">
        <DSegmentedControl
          ariaLabel="View"
          value={view}
          onChange={setView}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "raw", label: "Raw" },
          ]}
        />

        <DSegmentedControl
          ariaLabel="Grammar view + level"
          value={grouped}
          onChange={setGrouped}
          dividers={[1, 4]}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "a1", label: "A1" },
            { value: "a2", label: "A2" },
            { value: "b1", label: "B1" },
            { value: "raw", label: "Raw" },
          ]}
        />

        <DSegmentedControl
          size="sm"
          ariaLabel="Small"
          value={view}
          onChange={setView}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "raw", label: "Raw" },
          ]}
        />
      </div>
    );
  },
};

// Contrast of two CSS colours as painted, composited over the page. Tokens are
// resolved through a probe element because a custom property returns its
// AUTHORED value (`#F5F2EC` in Studio, `oklch(…)` elsewhere).
function contrast(host: HTMLElement, a: string, b: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const paint = (colour: string) => {
    const probe = document.createElement("span");
    probe.style.backgroundColor = colour;
    host.appendChild(probe);
    const resolved = getComputedStyle(probe).backgroundColor;
    probe.remove();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = resolved;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).map((v) => v / 255);
  };
  const lum = (c: number[]) => {
    const [r, g, b] = c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(paint(a)), lum(paint(b))].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

const APPEARANCE = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/**
 * `variant="track"` — a selected state that does not depend on the brand colour
 * being strong against the page (kraftwerk#22).
 *
 * The default `fill` paints the selected segment `bg-primary`, and the fill IS the
 * state. Against `--background` that is 1.86:1 in Warm Amber light and 2.94:1 in
 * Studio light, under WCAG 1.4.11's 3:1, and 1.55:1 with Kraftwerk's volt — where
 * every label is also the same colour, so in a light theme nothing says which
 * option is chosen.
 *
 * `track` marks it twice instead: a 3px rule along the bottom of the selected
 * segment, and full ink against muted ink for the rest, on a bordered track that
 * says the unselected segments are tappable. The rule is `--primary-text` where
 * the theme declares one (Studio's clay ink here) and `--foreground` where it does
 * not. It measures 4.79:1 or better in all sixteen theme/mode combinations.
 *
 * The play function computes the ratio rather than asserting a token, so it checks
 * whichever theme and mode the toolbar is on.
 */
export const Track: Story = {
  render: function Track() {
    const [appearance, setAppearance] = React.useState("light");
    const [view, setView] = React.useState("practice");
    const [level, setLevel] = React.useState("a2");
    return (
      <div className="flex flex-col gap-6">
        <DSegmentedControl
          variant="track"
          size="tall"
          width="full"
          ariaLabel="Appearance"
          value={appearance}
          onChange={setAppearance}
          options={APPEARANCE}
        />
        <DSegmentedControl
          variant="track"
          ariaLabel="View"
          value={view}
          onChange={setView}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "raw", label: "Raw", disabled: true },
          ]}
        />
        <DSegmentedControl
          variant="track"
          size="sm"
          ariaLabel="Level"
          value={level}
          onChange={setLevel}
          dividers={[1]}
          options={[
            { value: "a1", label: "A1" },
            { value: "a2", label: "A2" },
            { value: "b1", label: "B1" },
          ]}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>('[aria-label="Appearance"]')!;
    const selected = group.querySelector<HTMLElement>('[aria-checked="true"]')!;
    const unselected = group.querySelector<HTMLElement>('[aria-checked="false"]')!;
    const shadow = getComputedStyle(selected).boxShadow;
    if (!/inset/.test(shadow) || !/-3px/.test(shadow)) {
      throw new Error(`the selected segment must carry a 3px inset rule, got box-shadow: ${shadow}`);
    }
    const rule = contrast(canvasElement, "var(--primary-text, var(--foreground))", "var(--background)");
    if (rule < 3) {
      throw new Error(
        `the selected rule must clear WCAG 1.4.11's 3:1 against --background, measured ${rule.toFixed(2)}:1`,
      );
    }
    if (getComputedStyle(selected).color === getComputedStyle(unselected).color) {
      throw new Error("selected and unselected labels must differ in ink: that is the second channel");
    }
  },
};

export const TrackDark: Story = { ...Track, globals: { mode: "dark" } };

/**
 * The two variants side by side, on the same value. Switch the toolbar to Warm
 * Amber or Studio in Light to see the default lose its state; `track` keeps it.
 * `className` lands on the radiogroup, merged last — here a max width.
 */
export const FillAndTrack: Story = {
  render: function FillAndTrack() {
    const [value, setValue] = React.useState("light");
    return (
      <div className="flex flex-col gap-4">
        <span className="text-xs text-muted-foreground">variant="fill" (default)</span>
        <DSegmentedControl ariaLabel="Fill" value={value} onChange={setValue} options={APPEARANCE} size="tall" width="full" />
        <span className="text-xs text-muted-foreground">variant="track"</span>
        <DSegmentedControl ariaLabel="Track" variant="track" value={value} onChange={setValue} options={APPEARANCE} size="tall" width="full" />
        <span className="text-xs text-muted-foreground">variant="track" className="max-w-60"</span>
        <DSegmentedControl ariaLabel="Narrow" variant="track" value={value} onChange={setValue} options={APPEARANCE} width="full" className="max-w-60" />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const narrow = canvasElement.querySelector<HTMLElement>('[aria-label="Narrow"]')!;
    if (narrow.getBoundingClientRect().width > 240.5) {
      throw new Error(`className must win over width="full": expected ≤240px, got ${narrow.getBoundingClientRect().width}px`);
    }
  },
};

export const FillAndTrackDark: Story = { ...FillAndTrack, globals: { mode: "dark" } };
