import type { Meta, StoryObj } from "@storybook/react-vite";
import { DIconButton } from "./DIconButton";
import { DMenu, DMenuTrigger, DMenuContent, DMenuItem } from "./DMenu";
import { Layers, BookOpen, Users, MoreVertical, Trash2 } from "lucide-react";

const meta: Meta<typeof DIconButton> = {
  title: "DLibrary/UI/DIconButton",
  component: DIconButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DIconButton>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">Default</span>
        <DIconButton icon={<Layers className="size-5" />} aria-label="Decks" />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">With tooltip</span>
        <DIconButton
          icon={<Layers className="size-5" />}
          aria-label="Decks"
          tooltip="Decks"
        />
        <DIconButton
          icon={<BookOpen className="size-5" />}
          aria-label="Texts"
          tooltip="Texts"
        />
        <DIconButton
          icon={<Users className="size-5" />}
          aria-label="Friends"
          tooltip="Friends"
        />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">Active</span>
        <DIconButton
          icon={<Layers className="size-5" />}
          aria-label="Decks"
          tooltip="Decks"
          active
        />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">Destructive</span>
        <DIconButton
          icon={<Trash2 className="size-5" />}
          aria-label="Delete"
          tooltip="Delete"
        />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">asChild + link</span>
        <DIconButton
          icon={<Layers className="size-5" />}
          aria-label="Decks"
          tooltip="Decks"
          asChild
        >
          <a href="#" />
        </DIconButton>
        <DIconButton
          icon={<BookOpen className="size-5" />}
          aria-label="Texts"
          tooltip="Texts"
          active
          asChild
        >
          <a href="#" />
        </DIconButton>
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">DMenu trigger</span>
        <DMenu>
          <DMenuTrigger>
            <DIconButton
              icon={<MoreVertical className="size-5" />}
              aria-label="More options"
            />
          </DMenuTrigger>
          <DMenuContent>
            <DMenuItem>Edit</DMenuItem>
            <DMenuItem destructive>Delete</DMenuItem>
          </DMenuContent>
        </DMenu>
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">
          Badge (custom icon node)
        </span>
        <DIconButton
          icon={
            <span className="relative">
              <Users className="size-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full" />
            </span>
          }
          aria-label="Friends with pending requests"
          tooltip="Friends"
        />
      </section>
    </div>
  ),
};

/**
 * `active` must expose `aria-current="page"`, not just a background colour.
 * Without it a screen-reader user has no way to tell which nav section they are
 * in — the visual state alone is invisible to assistive tech.
 */
export const ActiveExposesAriaCurrent: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-8">
      <DIconButton
        icon={<Layers className="size-5" />}
        aria-label="Decks"
        active
      />
      <DIconButton icon={<BookOpen className="size-5" />} aria-label="Texts" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const activeBtn = canvasElement.querySelector('[aria-label="Decks"]');
    const inactiveBtn = canvasElement.querySelector('[aria-label="Texts"]');
    if (activeBtn?.getAttribute("aria-current") !== "page") {
      throw new Error(
        `active DIconButton must expose aria-current="page", got ` +
          `${JSON.stringify(activeBtn?.getAttribute("aria-current"))}`,
      );
    }
    if (inactiveBtn?.hasAttribute("aria-current")) {
      throw new Error("inactive DIconButton must not expose aria-current");
    }
  },
};

/**
 * The active state must be visible, not only semantic (tandemic#612).
 *
 * The old treatment was a `bg-muted` fill measuring 1.13:1 against the page
 * background where WCAG 1.4.11 wants 3:1 — so the indicator bar is the state, and
 * this pins the two things about it that a later edit is most likely to undo:
 *
 * 1. It is rendered ONLY when active. An always-present span that merely changes
 *    colour would let a page with no current section still carry indicators.
 * 2. It is painted with `--foreground`, NOT `--primary`. The brand colour is the
 *    intuitive choice and it fails (2.94:1 in Studio, 1.86:1 in Warm Amber), so an
 *    assertion on mere presence would not catch the regression that matters.
 *
 * The token is resolved through a probe element rather than read off
 * `documentElement`, because a custom property returns its AUTHORED value — `#191A17`
 * in Studio but `oklch(...)` elsewhere — while `backgroundColor` always computes to
 * `rgb(...)`. Comparing the two directly fails for the wrong reason. Resolving it
 * this way is also what keeps this story theme-agnostic, which it has to be: this
 * file runs under d-library's Storybook AND, globbed from node_modules, under
 * consumers' — and the two key the theme global differently.
 */
export const ActiveIndicatorUsesForeground: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-8">
      <DIconButton
        icon={<Layers className="size-5" />}
        aria-label="Decks"
        active
        asChild
      >
        <a href="#" />
      </DIconButton>
      <DIconButton icon={<BookOpen className="size-5" />} aria-label="Texts" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bars = canvasElement.querySelectorAll(
      '[data-slot="icon-button-indicator"]',
    );
    if (bars.length !== 1) {
      throw new Error(
        `expected exactly 1 active indicator (one active item, one inactive), ` +
          `found ${bars.length}. An indicator on the inactive item means it is ` +
          `rendered unconditionally instead of behind \`active\`.`,
      );
    }

    const bar = bars[0];
    if (!bar.closest('[aria-current="page"]')) {
      throw new Error(
        "the indicator must render inside the active element itself — in the " +
          "asChild branch that is the consumer's own link, reached via Slot.",
      );
    }
    if (bar.getAttribute("aria-hidden") !== "true") {
      throw new Error(
        "the indicator must be aria-hidden: aria-current already carries the " +
          "state, and announcing it twice is worse than not at all.",
      );
    }

    const probe = document.createElement("span");
    probe.style.backgroundColor = "var(--foreground)";
    canvasElement.appendChild(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();

    const actual = getComputedStyle(bar).backgroundColor;
    if (actual !== expected) {
      throw new Error(
        `the active indicator must be painted with --foreground (${expected}), ` +
          `got ${actual}. --primary is the intuitive choice and it FAILS WCAG ` +
          `1.4.11 — 2.94:1 in Studio, 1.86:1 in Warm Amber.`,
      );
    }
  },
};
