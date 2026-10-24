import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, X } from "lucide-react";
import { createRef, useState } from "react";
import { DInput } from "./DInput";
import { DButton } from "../ui/DButton";
import { cn, FOCUS_RING } from "../utils";

const meta: Meta<typeof DInput> = {
  title: "DLibrary/Forms/DInput",
  component: DInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DInput>;

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DInput placeholder="Default input" />
      <DInput placeholder="With value" defaultValue="Hello world" />
      <DInput placeholder="Error state" error defaultValue="Invalid" />
      <DInput placeholder="Disabled" disabled />
      <DInput
        placeholder="Search…"
        type="search"
        aria-label="Search"
        leadingIcon={<Search aria-hidden="true" />}
      />
      <DInput
        placeholder="Search…"
        type="search"
        aria-label="Search"
        leadingIcon={<Search aria-hidden="true" />}
        trailingIcon={
          <button
            type="button"
            aria-label="Clear search"
            className={cn("flex items-center cursor-pointer", FOCUS_RING)}
          >
            <X aria-hidden="true" />
          </button>
        }
        defaultValue="query"
      />
    </div>
  ),
};

export const PlaceholderTone: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DInput placeholder="Default placeholder tone" />
      <DInput placeholder="Subtle placeholder tone" placeholderTone="subtle" />
      <DInput
        placeholder="Subtle + leading icon"
        placeholderTone="subtle"
        leadingIcon={<Search aria-hidden="true" />}
      />
    </div>
  ),
};

export const Size: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DInput placeholder="default — 36px, desktop density" />
      <DInput placeholder="tall — 44px, thumb-driven forms" size="tall" />
      <DInput
        placeholder="tall + a 44px trailing button"
        size="tall"
        trailingIcon={
          <button
            type="button"
            aria-label="Clear"
            className={cn("flex h-11 min-w-11 cursor-pointer items-center justify-center", FOCUS_RING)}
          >
            <X aria-hidden="true" />
          </button>
        }
      />
      {/* The reason `tall` exists as a pair with the slot: the same 44px button
        in a `default` container overflows it. Shown so the mismatch is visible
        here rather than discovered on a phone. */}
      <DInput
        placeholder="default + the same button — note the overflow"
        trailingIcon={
          <button
            type="button"
            aria-label="Clear"
            className={cn("flex h-11 min-w-11 cursor-pointer items-center justify-center", FOCUS_RING)}
          >
            <X aria-hidden="true" />
          </button>
        }
      />
    </div>
  ),
};

/**
 * The password recipe from davstur/d-library#7: `DInput` already has the
 * mechanism, and what was missing was anything showing which attributes to set.
 * Each one below has a failure mode that stays invisible until it costs someone
 * their account.
 */
export const PasswordWithReveal: Story = {
  render: function PasswordWithReveal() {
    const [revealed, setRevealed] = useState(false);
    return (
      <div className="w-80 space-y-4">
        <DInput
          size="tall"
          type={revealed ? "text" : "password"}
          // `current-password` is what makes iOS offer to FILL; on a
          // registration or reset field it must be `new-password`, which is what
          // makes iOS offer to SAVE. Without either, nothing is stored, and you
          // find out the day you need a reset.
          autoComplete="current-password"
          aria-label="Password"
          defaultValue="correct horse battery staple"
          trailingIcon={
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              // `aria-pressed`, not a changing label: the control is one toggle
              // in two states, and a screen reader should say so.
              aria-pressed={revealed}
              aria-label="Show password"
              className={cn("flex h-11 min-w-11 cursor-pointer items-center justify-center px-3 text-sm font-medium text-primary", FOCUS_RING)}
            >
              {revealed ? "Hide" : "Show"}
            </button>
          }
        />
        <DInput
          size="tall"
          type="email"
          aria-label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          // iOS capitalises the first character of an email by default, and the
          // failed sign-in that follows is indistinguishable from a wrong
          // password.
          inputMode="email"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
    );
  },
};

/**
 * `className` lands on the visible field box and is merged last (kraftwerk#22).
 *
 * The case that needed it: a numeric cell in a set row is `w-[6ch]`, and
 * `DInput`'s `w-full` gave a consumer nothing to pass, so the cell stayed a
 * hand-rolled `<input>` with its own focus ring and invalid state. In the slotted
 * shape the class goes on the container, because that is the box a person sees.
 */
export const ClassName: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="flex items-center gap-3">
        <span className="w-4 text-xs text-muted-foreground">1</span>
        <DInput aria-label="Set 1 kg" size="tall" inputMode="decimal" enterKeyHint="next" defaultValue="80" className="w-[6ch] text-center" />
        <DInput aria-label="Set 1 reps" size="tall" inputMode="numeric" enterKeyHint="done" defaultValue="5" className="w-[6ch] text-center" />
      </div>
      <DInput aria-label="Bodyweight" size="tall" inputMode="decimal" className="w-[14ch]" trailingIcon={<span className="text-sm text-muted-foreground">kg</span>} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cell = canvasElement.querySelector<HTMLInputElement>('[aria-label="Set 1 kg"]')!;
    const probe = document.createElement("span");
    probe.style.cssText = `font:${getComputedStyle(cell).font};width:6ch;display:inline-block`;
    canvasElement.appendChild(probe);
    const sixCh = probe.getBoundingClientRect().width;
    probe.remove();
    if (Math.abs(cell.getBoundingClientRect().width - sixCh) > 0.5) {
      throw new Error(`className must win over w-full: expected ${sixCh}px (6ch), got ${cell.getBoundingClientRect().width}px`);
    }
  },
};

export const ClassNameDark: Story = { ...ClassName, globals: { mode: "dark" } };

const bareRef = createRef<HTMLInputElement>();
const slottedRef = createRef<HTMLInputElement>();

/**
 * A `ref` reaches the `<input>` in both shapes — including the slotted one, where
 * the input sits inside a container and focusing the container would do nothing.
 * React 19 passes `ref` as a prop; this pins that it lands on the input.
 */
export const RefReachesTheInput: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DInput ref={bareRef} aria-label="Bare" placeholder="bare" />
      <DInput ref={slottedRef} aria-label="Slotted" placeholder="slotted" leadingIcon={<Search aria-hidden="true" />} />
      <div className="flex gap-2">
        <DButton variant="secondary" size="sm" onClick={() => bareRef.current?.focus()}>Focus bare</DButton>
        <DButton variant="secondary" size="sm" onClick={() => slottedRef.current?.focus()}>Focus slotted</DButton>
      </div>
    </div>
  ),
  play: async () => {
    for (const [name, ref] of [["bare", bareRef], ["slotted", slottedRef]] as const) {
      if (!(ref.current instanceof HTMLInputElement)) {
        throw new Error(`${name}: ref must be the <input>, got ${String(ref.current)}`);
      }
    }
    slottedRef.current!.focus();
    if (document.activeElement !== slottedRef.current) {
      throw new Error("slotted: focusing through the ref must focus the input");
    }
  },
};

/**
 * The reveal toggle as a `DButton` — which brings the library's `FOCUS_RING` with
 * it, so the consumer no longer has to apply the ring by hand. Before `className`
 * a `DButton` could not be sized to the 44px slot, so the toggle was a raw
 * `<button>`, and a raw button with no ring falls back to the browser's
 * `outline: auto`, clipped by the field's own border. Tab to "Show" to see it.
 */
export const RevealToggleIsADButton: Story = {
  render: function RevealToggleIsADButton() {
    const [revealed, setRevealed] = useState(false);
    return (
      <div className="w-80">
        <DInput
          size="tall"
          type={revealed ? "text" : "password"}
          autoComplete="current-password"
          aria-label="Password"
          defaultValue="correct horse battery staple"
          trailingIcon={
            <DButton
              type="button"
              variant="subtle"
              aria-pressed={revealed}
              aria-label="Show password"
              onClick={() => setRevealed((r) => !r)}
              className="-mr-3 h-11 min-w-11 px-3 text-[var(--primary-text,var(--primary))]"
            >
              {revealed ? "Hide" : "Show"}
            </DButton>
          }
        />
      </div>
    );
  },
};

export const RevealToggleIsADButtonDark: Story = { ...RevealToggleIsADButton, globals: { mode: "dark" } };

/**
 * A slotted field — one with a leading or trailing icon — rings exactly like a
 * bare one while its text input has focus, and not at all while a control in
 * the slot does.
 *
 * The slotted shape draws the field on a container `div` around the `<input>`,
 * and that container is where the 0.3.4 focus-ring fix never reached: it kept
 * `focus-within:ring-primary/50` with no offset, 1.35–5.29:1 against the page and
 * under 3:1 in 11 of 16 theme/mode combinations. It now takes
 * `INPUT_BOX_FOCUS_RING`: 5.81–8.57:1, identical to the bare field.
 *
 * Keyed on the input rather than `focus-within`: tab to "Show" and only the
 * button rings. With `focus-within` the box rang as well, two equal rings naming
 * two controls when one was focused. A control in a slot brings its own
 * indicator — `DButton` here; the raw buttons in the stories above add
 * `FOCUS_RING`.
 *
 * The play function requires the slotted boxes' focused shadow to be IDENTICAL
 * to the bare input's, which holds in every theme without naming a colour, and
 * the box to stay as it rests while the toggle has focus.
 */
export const SlottedFocusRing: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DInput aria-label="Bare" size="tall" placeholder="bare" />
      <DInput aria-label="Search" size="tall" placeholder="leading icon" leadingIcon={<Search aria-hidden="true" />} />
      <DInput
        aria-label="Password"
        size="tall"
        type="password"
        defaultValue="hunter2"
        trailingIcon={
          <DButton type="button" variant="subtle" aria-label="Show password" className="-mr-3 h-11 min-w-11 px-3">
            Show
          </DButton>
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const field = (name: string) => canvasElement.querySelector<HTMLElement>(`[aria-label="${name}"]`)!;
    const boxOf = (input: HTMLElement) => (input.matches('[data-slot="input"]') ? input : input.parentElement!);
    const shadowWhile = (focused: HTMLElement, box: HTMLElement) => {
      focused.focus();
      const shadow = getComputedStyle(box).boxShadow;
      focused.blur();
      return shadow;
    };
    const bare = shadowWhile(field("Bare"), boxOf(field("Bare")));
    for (const name of ["Search", "Password"]) {
      const slotted = shadowWhile(field(name), boxOf(field(name)));
      if (slotted !== bare) {
        throw new Error(`${name}: a slotted field must ring like a bare one.\n  bare:    ${bare}\n  slotted: ${slotted}`);
      }
    }
    // The toggle has focus, not the text: the box stays as it rests, and the
    // toggle carries the only ring.
    const box = boxOf(field("Password"));
    const toggle = field("Show password");
    const boxAtRest = getComputedStyle(box).boxShadow;
    const toggleAtRest = getComputedStyle(toggle).boxShadow;
    const boxWhileToggle = shadowWhile(toggle, box);
    if (boxWhileToggle !== boxAtRest) {
      throw new Error(`the box must not ring while the toggle has focus:\n  rest:    ${boxAtRest}\n  toggled: ${boxWhileToggle}`);
    }
    if (shadowWhile(toggle, toggle) === toggleAtRest) {
      throw new Error("the toggle must carry its own focus ring");
    }
    field("Password").focus();
  },
};

export const SlottedFocusRingDark: Story = { ...SlottedFocusRing, globals: { mode: "dark" } };
