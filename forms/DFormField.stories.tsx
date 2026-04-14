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
    </div>
  ),
};
