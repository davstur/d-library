import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
import { DButton, type DButtonTone } from "./DButton";
import { configureClassMerge } from "../utils";
import { contrastOver, hoverInk, sameInk } from "../story-helpers";
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
    // `contrastOver` composites through a canvas and resolves tokens through a
    // probe; see story-helpers.ts for why neither can be skipped.
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
      const r = contrastOver(canvasElement, ringVar, "var(--background)");
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

/**
 * `className`, merged last so it wins over the variant's own classes
 * (kraftwerk#22). For what only a call site knows: the negative margin that keeps
 * a 44px control from stacking a padded row to 70px, or a consumer's own radius
 * and type scale. The defaults are unchanged — `rounded-md` and a 14px label —
 * and whether they should move is a design question for the library, not
 * something a class at one call site settles.
 */
export const ClassName: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="flex items-center justify-between border-b py-[13px]">
        <span className="text-base font-medium">Password</span>
        <DButton variant="subtle" data-testid="row-action" className="-my-[13px] -mr-3 h-11 rounded-lg px-3 text-base">
          Change
        </DButton>
      </div>
      <DButton width="full" className="h-11 rounded-lg text-base">
        Save password
      </DButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const action = canvasElement.querySelector<HTMLElement>('[data-testid="row-action"]')!;
    const row = action.parentElement!;
    // In rems, not pixels: these stories also run in consumers' Storybooks,
    // whose root font size need not be 16px.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (Math.abs(parseFloat(getComputedStyle(action).fontSize) - rem) > 0.01) {
      throw new Error(`className must win over the size's text-sm: font-size is ${getComputedStyle(action).fontSize}`);
    }
    const height = action.getBoundingClientRect().height;
    if (Math.abs(height - 2.75 * rem) > 0.5) {
      throw new Error(`the row action must be h-11 (${2.75 * rem}px), got ${height}`);
    }
    // The de-stacking margin: the control plus 2 × 13px of row padding is what
    // a stacked row measures. `-my-[13px]` takes the control back out of it.
    if (row.getBoundingClientRect().height >= height + 26 - 0.5) {
      throw new Error(`the row stacked to ${row.getBoundingClientRect().height}px: the margin did not apply`);
    }
  },
};

export const ClassNameDark: Story = { ...ClassName, globals: { mode: "dark" } };

/**
 * A consumer's own font-size name, given to the merge with `configureClassMerge`
 * (d-library#12).
 *
 * Unconfigured, the merge is bare tailwind-merge, which files a size it does
 * not know under text COLOUR: beside a colour, one deletes the other and the
 * size variant's `text-sm` stays. That is the next story, kept as the proof
 * that an unconfigured consumer renders as before.
 *
 * The size is declared by the story itself, in the utilities layer as a
 * consumer's `@theme` would put it, because these stories also run in
 * consumers' Storybooks, which do not have it.
 *
 * `configureClassMerge` sets module state, so `beforeEach` sets it and its
 * cleanup restores the bare merge for the next story. On a docs page, where
 * every story renders at once, the stories rendered alongside this one may
 * see it.
 */
const LEDE_STYLE = "@layer utilities { .text-lede { font-size: 1.0625rem; } }";

const consumerTypeScale = (
  <div className="flex items-center gap-4">
    <style>{LEDE_STYLE}</style>
    <DButton variant="subtle" data-testid="lede" className="text-lede text-foreground">
      Change
    </DButton>
  </div>
);

function ledeButton(canvasElement: HTMLElement) {
  const button = canvasElement.querySelector<HTMLElement>('[data-testid="lede"]')!;
  // In rems: see `ClassName`.
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return { button, size: parseFloat(getComputedStyle(button).fontSize) / rem, classes: Array.from(button.classList) };
}

export const ConsumerTypeScale: Story = {
  beforeEach: () => {
    configureClassMerge({ extend: { theme: { text: ["lede"] } } });
    return () => configureClassMerge();
  },
  render: () => consumerTypeScale,
  play: async ({ canvasElement }) => {
    const { size, classes } = ledeButton(canvasElement);
    if (!classes.includes("text-lede") || classes.includes("text-sm")) {
      throw new Error(`the configured merge must keep text-lede and drop text-sm: ${classes.join(" ")}`);
    }
    if (!classes.includes("text-foreground")) {
      throw new Error(`the colour beside the size must survive too: ${classes.join(" ")}`);
    }
    if (Math.abs(size - 1.0625) > 0.001) {
      throw new Error(`the button must render the consumer's 1.0625rem, got ${size}rem`);
    }
  },
};

export const ConsumerTypeScaleUnconfigured: Story = {
  render: () => consumerTypeScale,
  play: async ({ canvasElement }) => {
    const { size, classes } = ledeButton(canvasElement);
    // The bare merge, unchanged: `text-lede` read as a colour and replaced by
    // the colour after it, the size's `text-sm` kept.
    if (classes.includes("text-lede") || !classes.includes("text-sm")) {
      throw new Error(`unconfigured, the merge must be bare tailwind-merge as before 0.3.11: ${classes.join(" ")}`);
    }
    if (Math.abs(size - 0.875) > 0.001) {
      throw new Error(`unconfigured, the button must keep text-sm's 0.875rem, got ${size}rem`);
    }
  },
};

/**
 * `tone`: the ink holds at rest and under the pointer (d-library#13).
 *
 * `subtle` inherits its resting ink and turns `--foreground` on hover, so a
 * brand-ink or a destructive text affordance had to restate its ink AND its
 * `hover:` twin in `className`. Each tone below must rest in its token and keep
 * it on hover.
 *
 * The row sits in muted ink, so an INHERITED ink differs from every tone's:
 * on the page's own `--foreground`, `subtle` with no tone would rest and hover
 * in `--foreground` and pass as `foreground`. `default` checks that the
 * harness still tells them apart — it rests muted and hovers to full ink.
 *
 * Hover is read from the class the merge left, not from a pointer; see
 * `hoverInk` in story-helpers.ts for why a play cannot hover.
 */
const TONE_INKS: Record<Exclude<DButtonTone, "default">, string> = {
  foreground: "var(--foreground)",
  primary: "var(--primary-text, var(--foreground))",
  destructive: "var(--destructive-text, var(--destructive))",
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
      <DButton variant="subtle" data-tone="default">Default</DButton>
      <DButton variant="subtle" tone="foreground" data-tone="foreground">Foreground</DButton>
      <DButton variant="subtle" tone="primary" data-tone="primary">Change</DButton>
      <DButton variant="subtle" tone="destructive" data-tone="destructive">Delete</DButton>
      <DButton variant="secondary" tone="primary" data-tone="secondary-primary">Restore</DButton>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const at = (tone: string) => canvasElement.querySelector<HTMLElement>(`[data-tone="${tone}"]`)!;
    const cases: [string, string][] = [
      ...Object.entries(TONE_INKS),
      ["secondary-primary", TONE_INKS.primary],
    ];
    for (const [name, token] of cases) {
      const el = at(name);
      const rest = getComputedStyle(el).color;
      if (!sameInk(el, rest, token)) {
        throw new Error(`${name}: rests in ${rest}, not ${token}`);
      }
      const hover = hoverInk(el);
      if (!hover || !sameInk(el, hover, token)) {
        throw new Error(`${name}: turns ${hover} on hover; the tone must hold ${token}`);
      }
    }
    const plain = at("default");
    const plainHover = hoverInk(plain);
    if (!plainHover || sameInk(plain, getComputedStyle(plain).color, plainHover)) {
      throw new Error("default: rests and hovers in one ink here, so nothing above can tell a tone from none");
    }
  },
};
export const TonesDark: Story = { ...Tones, globals: { mode: "dark" } };
