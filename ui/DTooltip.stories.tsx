import type { Meta, StoryObj } from "@storybook/react-vite";
import { DTooltip } from "./DTooltip";
import { DButton } from "./DButton";
import { HelpCircle } from "lucide-react";

const meta: Meta<typeof DTooltip> = {
  title: "DLibrary/UI/DTooltip",
  component: DTooltip,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DTooltip>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 p-8">
      <DTooltip content="This is a tooltip">
        <DButton variant="secondary">Hover me</DButton>
      </DTooltip>
      <DTooltip content="Help information">
        <DButton variant="subtle" size="icon">
          <HelpCircle className="h-4 w-4" />
        </DButton>
      </DTooltip>
    </div>
  ),
};
