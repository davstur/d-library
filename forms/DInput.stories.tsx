import type { Meta, StoryObj } from "@storybook/react-vite";
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
    </div>
  ),
};
