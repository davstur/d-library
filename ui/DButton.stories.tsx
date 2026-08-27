import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
import { DButton } from "./DButton";
import { Plus, Trash2, ArrowRight, ArrowUp } from "lucide-react";

const meta: Meta<typeof DButton> = {
  title: "DLibrary/UI/DButton",
  component: DButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DButton>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <DButton variant="primary">Primary</DButton>
        <DButton variant="secondary">Secondary</DButton>
        <DButton variant="subtle">Subtle</DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="primary" disabled>Disabled</DButton>
        <DButton variant="primary" loading>Loading</DButton>
        <DButton variant="secondary" size="sm">Small</DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="primary">
          <Plus className="size-4" />
          With Icon
        </DButton>
        <DButton variant="subtle" size="icon" aria-label="Delete">
          <Trash2 className="size-4" />
        </DButton>
        <DButton variant="primary" size="icon-round" aria-label="Send">
          <ArrowUp className="size-4" />
        </DButton>
        <DButton variant="primary" size="icon-round-sm" aria-label="Send">
          <ArrowUp className="size-4" />
        </DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="pill" size="floating">
          Resume practice
          <ArrowRight className="size-4" />
        </DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="secondary" size="tall">
          <span className="flex flex-col items-center">
            <span className="text-lg">1</span>
            <span className="text-xs text-muted-foreground">Rating</span>
          </span>
        </DButton>
        <DButton variant="secondary" size="tall">
          <span className="flex flex-col items-center">
            <span className="text-lg">4</span>
            <span className="text-xs text-muted-foreground">Tall variant</span>
          </span>
        </DButton>
      </div>
    </div>
  ),
};

/**
 * The focus ring must be visible (tandemic#640).
 *
 * It was `ring-primary/50`, which measured **1.35:1** against the page background at
 * worst and failed WCAG 1.4.11's 3:1 in **10 of the 16** theme/mode combinations,
 * Studio — the default — among them. The same expression was copy-pasted across eight
 * components, so one shared `FOCUS_RING` now owns it.
 *
 * This asserts the REQUIREMENT (a ratio) rather than the token, for two reasons: a
 * token assertion passes for a token that happens to fail in one theme, and only one
 * theme is ever rendered in a single test. Computing the ratio means whichever theme
 * the runner is in, the story is checking the thing that actually matters.
 *
 * The `destructive` variant is included deliberately: it used to override the base
 * with `ring-destructive/20` (1.20:1), so the delete button had the least visible
 * focus in the library — the worst possible place for it.
 */
export const FocusRingIsVisible: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-8">
      <DButton variant="primary">Primary</DButton>
      <DButton variant="secondary">Secondary</DButton>
      <DButton variant="destructive">Delete</DButton>
      <DButton variant="subtle">Subtle</DButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    // Composite through a canvas rather than parsing the computed string.
    // getComputedStyle hands back the colour in whatever space it was authored —
    // `oklab(0.25 0.01 0.017 / 0.7)` here, not `rgb()` — so reading "the first
    // three numbers" as 0-255 channels silently yields near-black for everything
    // and the assertion fails for the wrong reason. (It did, while I wrote it.)
    // The canvas also composites the ring's 70% alpha over the page for free,
    // which is the colour a user actually sees.
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    const paint = (x: number, colours: string[]) => {
      for (const c of colours) {
        ctx.fillStyle = c;
        ctx.fillRect(x, 0, 1, 1);
      }
      const [r, g, b] = ctx.getImageData(x, 0, 1, 1).data;
      return [r / 255, g / 255, b / 255] as [number, number, number];
    };
    const lum = ([r, g, b]: [number, number, number]) => {
      const lin = (v: number) =>
        v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    };
    const ratio = (a: [number, number, number], b: [number, number, number]) => {
      const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (hi + 0.05) / (lo + 0.05);
    };

    // Resolve a token by painting a probe: reading a custom property off the root
    // returns its AUTHORED value, which differs per theme.
    const resolve = (value: string) => {
      const probe = document.createElement("span");
      probe.style.backgroundColor = value;
      canvasElement.appendChild(probe);
      const out = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return out;
    };

    const pageBgCss = resolve("var(--background)");
    const pageBg = paint(1, [pageBgCss]);

    for (const label of ["Primary", "Secondary", "Delete", "Subtle"]) {
      const btn = Array.from(canvasElement.querySelectorAll("button")).find(
        (b) => b.textContent?.trim() === label,
      );
      if (!btn) throw new Error(`no ${label} button in the story`);

      // Focus must arrive by KEYBOARD: --tw-ring-color is declared inside the
      // :focus-visible rule, and a programmatic .focus() does not match it in
      // Chromium — the variable would read empty and this would fail for the
      // wrong reason.
      btn.blur();
      await userEvent.tab();
      while (document.activeElement !== btn) {
        const before = document.activeElement;
        await userEvent.tab();
        if (document.activeElement === before) {
          throw new Error(`could not reach the ${label} button by tabbing`);
        }
      }
      if (!btn.matches(":focus-visible")) {
        throw new Error(
          `${label}: focused but :focus-visible does not match, so nothing here ` +
            `is measuring the real focus indicator.`,
        );
      }

      const ringVar = getComputedStyle(btn).getPropertyValue("--tw-ring-color");
      if (!ringVar.trim()) {
        throw new Error(
          `${label}: no --tw-ring-color is set, so focus-visible paints no ring ` +
            `at all. FOCUS_RING must be in this component's class list.`,
        );
      }

      // Ring painted OVER the page background, so its alpha is accounted for.
      const r = ratio(paint(0, [pageBgCss, resolve(ringVar)]), pageBg);
      if (r < 3) {
        throw new Error(
          `${label}: focus ring measures ${r.toFixed(2)}:1 against the page ` +
            `background; WCAG 1.4.11 requires 3:1. A variant-specific ring ` +
            `override replaces FOCUS_RING's whole calculation — that is how ` +
            `destructive ended up at 1.20:1.`,
        );
      }
    }
  },
};
