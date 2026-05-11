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
