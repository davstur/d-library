import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DFormField } from "./DFormField";
import { DInput } from "./DInput";
import { DButton } from "../ui/DButton";

const meta: Meta<typeof DFormField> = {
  title: "DLibrary/Forms/DFormField",
  component: DFormField,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DFormField>;

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DFormField label="Name" htmlFor="name">
        <DInput id="name" placeholder="John Doe" />
      </DFormField>
      <DFormField label="Username" htmlFor="username" error="Username is already taken">
        <DInput id="username" error defaultValue="johndoe" />
      </DFormField>
      <DFormField label="Password" htmlFor="password" required>
        <DInput id="password" type="password" placeholder="Required field" />
      </DFormField>
      <DFormField
        label="Native language"
        htmlFor="native"
        description="Your native language"
      >
        <DInput id="native" placeholder="English" />
      </DFormField>
    </div>
  ),
};

/**
 * An `error` string is wired to the input the same way `description` already was:
 * it gets an id, joins `aria-describedby` (ahead of the description, since what just
 * went wrong is read first), sets `aria-invalid` on the matching child, and renders
 * with `role="alert"` so it is announced on insertion.
 *
 * That last part is the one that matters: validation messages usually appear on blur,
 * when focus has already moved on. Inspect the input's `aria-describedby` /
 * `aria-invalid` to see the association.
 */
export const ErrorWiring: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DFormField label="Username" htmlFor="wired" error="Username is already taken">
        <DInput id="wired" defaultValue="johndoe" />
      </DFormField>
      {/* Both at once: describedby carries the error first, then the description. */}
      <DFormField
        label="Email"
        htmlFor="wired-both"
        description="We only use this for password resets"
        error="That doesn't look like an email address"
      >
        <DInput id="wired-both" defaultValue="not-an-email" />
      </DFormField>
    </div>
  ),
};

/**
 * `labelTone="meta"` renders the label as a mono-uppercase kicker
 * (matching `DText as="meta" variant="muted"`) instead of the default
 * sentence-case body label. Use on dense Studio surfaces where each
 * field wants a kicker-style overline aligned with adjacent section
 * kickers.
 */
export const MetaLabels: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DFormField label="Name" htmlFor="meta-name" labelTone="meta">
        <DInput id="meta-name" placeholder="French Kitchen Vocabulary" />
      </DFormField>
      <DFormField label="Number of words" htmlFor="meta-count" labelTone="meta">
        <DInput id="meta-count" type="number" defaultValue={20} />
      </DFormField>
    </div>
  ),
};

/**
 * A description and an error at the same time — each on its own line.
 *
 * Both used to render as inline `<span>`s inside a `space-y-2` stack, which only
 * spaces block siblings, so they ran together on one line: "At least 10
 * characters.That is under 10 characters." with 0px between them (kraftwerk#22).
 * A password rule plus a too-short refusal is the commonest refusal on a sign-up
 * form, so this was the shape the error usually took.
 *
 * Each message now sits in its own plain block. A field with only one of them
 * renders exactly as before (measured: 108px tall either way).
 */
export const DescriptionAndError: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DFormField
        label="New password"
        htmlFor="stack-new"
        description="At least 10 characters."
        error="That is under 10 characters."
      >
        <DInput id="stack-new" size="tall" type="password" error defaultValue="short" />
      </DFormField>
      <DFormField label="Only a description" htmlFor="stack-desc" description="At least 10 characters.">
        <DInput id="stack-desc" size="tall" type="password" />
      </DFormField>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const description = canvasElement.querySelector("#stack-new-description")!.getBoundingClientRect();
    const error = canvasElement.querySelector("#stack-new-error")!.getBoundingClientRect();
    if (error.top < description.bottom) {
      throw new Error(
        `the error must start below the description, not beside it: description ends at ` +
          `y=${description.bottom}, error starts at y=${error.top}`,
      );
    }
  },
};

export const DescriptionAndErrorDark: Story = { ...DescriptionAndError, globals: { mode: "dark" } };

/**
 * An invalid field keeps its red while focused — and keeps its focus ring while
 * red. The play function leaves the slotted field focused, which is the state a
 * refusal that clears and refocuses the field puts it in.
 *
 * Two bugs, one on each shape (kraftwerk#22):
 *
 * - **Slotted** (a reveal toggle in `trailingIcon`): `focus-within:border-primary`
 *   replaced the red, so the field carrying the error was outlined in the
 *   affirmative colour exactly while it was being read. Measured on Kraftwerk's
 *   current-password field: `#d3403a` at rest, `#f2c200` focused.
 * - **Bare**: the red border held, but `aria-invalid:ring-destructive/20` replaced
 *   `FOCUS_RING`'s colour, so the focus ring dropped to 1.22–2.14:1 against the
 *   page in all sixteen theme/mode combinations. It is back to 5.81:1 or better.
 *
 * And one red: the border now reads `--destructive-text` like the message under it,
 * where the theme declares it, instead of a second red beside the first.
 */
export const InvalidSurvivesFocus: Story = {
  render: function InvalidSurvivesFocus() {
    const [revealed, setRevealed] = React.useState(false);
    return (
      <div className="w-80 space-y-4">
        <DFormField label="Email" htmlFor="invalid-bare" error="That doesn't look like an email address">
          <DInput id="invalid-bare" size="tall" type="email" error defaultValue="not-an-email" />
        </DFormField>
        <DFormField label="Current password" htmlFor="invalid-slotted" error="That password is not right.">
          <DInput
            id="invalid-slotted"
            size="tall"
            type={revealed ? "text" : "password"}
            error
            defaultValue="hunter2"
            trailingIcon={
              <DButton
                type="button"
                variant="subtle"
                aria-label="Show password"
                aria-pressed={revealed}
                onClick={() => setRevealed((r) => !r)}
                className="h-11 min-w-11 px-3"
              >
                {revealed ? "Hide" : "Show"}
              </DButton>
            }
          />
        </DFormField>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const cases: Array<[string, HTMLInputElement, HTMLElement]> = [];
    const bare = canvasElement.querySelector<HTMLInputElement>("#invalid-bare")!;
    cases.push(["bare", bare, bare]);
    const slotted = canvasElement.querySelector<HTMLInputElement>("#invalid-slotted")!;
    cases.push(["slotted", slotted, slotted.parentElement!]);
    for (const [name, input, box] of cases) {
      const message = canvasElement.querySelector(`#${input.id}-error`)!;
      const rest = getComputedStyle(box).borderTopColor;
      input.focus();
      const focused = getComputedStyle(box).borderTopColor;
      if (focused !== rest) {
        throw new Error(`${name}: the invalid border must survive focus — ${rest} at rest, ${focused} focused`);
      }
      if (focused !== getComputedStyle(message).color) {
        throw new Error(
          `${name}: one red per error — border ${focused}, message ${getComputedStyle(message).color}`,
        );
      }
    }
    slotted.focus();
  },
};

export const InvalidSurvivesFocusDark: Story = { ...InvalidSurvivesFocus, globals: { mode: "dark" } };

/**
 * A disclosure moves focus into the field it reveals, and back to its trigger when
 * it closes (kraftwerk#22). Both halves use what the components already pass
 * through: `autoFocus` on the `DInput` that mounts on open, and a `ref` on the
 * trigger — `DButton`, like `DInput`, takes `ref` as a prop. Through `DFormField`
 * too: its `cloneElement` keeps the child's ref.
 *
 * axe has no rule for focus after a disclosure, so nothing else in CI would catch
 * this going missing; the play function walks it.
 */
export const FocusOnReveal: Story = {
  render: function FocusOnReveal() {
    const [open, setOpen] = React.useState(false);
    const trigger = React.useRef<HTMLButtonElement>(null);
    const field = React.useRef<HTMLInputElement>(null);
    const close = () => {
      setOpen(false);
      // After the commit, when the trigger exists again.
      requestAnimationFrame(() => trigger.current?.focus());
    };
    return (
      <div className="w-80 space-y-4">
        {open ? (
          <div className="space-y-3">
            <DFormField label="New email" htmlFor="reveal-email">
              <DInput id="reveal-email" ref={field} size="tall" type="email" autoFocus />
            </DFormField>
            <DButton variant="secondary" onClick={close}>
              Cancel
            </DButton>
          </div>
        ) : (
          <DButton ref={trigger} variant="secondary" onClick={() => setOpen(true)}>
            Change email
          </DButton>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const button = (name: string) =>
      Array.from(canvasElement.querySelectorAll("button")).find((b) => b.textContent === name)!;
    button("Change email").click();
    await frame();
    if (document.activeElement?.id !== "reveal-email") {
      throw new Error(`opening must focus the revealed field, focus is on ${document.activeElement?.outerHTML.slice(0, 80)}`);
    }
    button("Cancel").click();
    await frame();
    if (document.activeElement?.textContent !== "Change email") {
      throw new Error(`closing must return focus to the trigger, focus is on ${document.activeElement?.outerHTML.slice(0, 80)}`);
    }
  },
};
