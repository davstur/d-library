import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DCheckbox } from "./DCheckbox";

const meta: Meta<typeof DCheckbox> = {
  title: "DLibrary/Forms/DCheckbox",
  component: DCheckbox,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DCheckbox>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <DCheckbox id="with-label">Accept terms and conditions</DCheckbox>
      <DCheckbox id="checked" defaultChecked>Already checked</DCheckbox>
      <DCheckbox id="disabled" disabled>Disabled checkbox</DCheckbox>
      <DCheckbox id="disabled-checked" disabled defaultChecked>Disabled and checked</DCheckbox>
      <DCheckbox id="standalone" />
    </div>
  ),
};
