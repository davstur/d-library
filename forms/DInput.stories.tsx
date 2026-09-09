import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { DInput } from "./DInput";

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
            className="flex items-center cursor-pointer"
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
            className="flex h-11 min-w-11 cursor-pointer items-center justify-center"
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
            className="flex h-11 min-w-11 cursor-pointer items-center justify-center"
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
              className="flex h-11 min-w-11 cursor-pointer items-center justify-center px-3 text-sm font-medium text-primary"
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
