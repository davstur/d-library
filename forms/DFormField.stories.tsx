import type { Meta, StoryObj } from "@storybook/react-vite";
import { DFormField } from "./DFormField";
import { DInput } from "./DInput";

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
