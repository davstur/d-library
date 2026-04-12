import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DSelectField } from "./DSelectField";

const meta: Meta<typeof DSelectField> = {
  title: "DLibrary/Forms/DSelectField",
  component: DSelectField,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DSelectField>;

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
];

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DSelectField
        label="Language"
        value="en"
        onValueChange={() => {}}
        options={LANGUAGE_OPTIONS}
      />
      <DSelectField
        label="Language"
        value=""
        onValueChange={() => {}}
        options={LANGUAGE_OPTIONS}
        placeholder="Select a language..."
      />
      <DSelectField
        label="Language"
        value="en"
        onValueChange={() => {}}
        options={LANGUAGE_OPTIONS}
        disabled
      />
    </div>
  ),
};
