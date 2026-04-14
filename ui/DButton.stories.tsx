import type { Meta, StoryObj } from "@storybook/react-vite";
import { DButton } from "./DButton";
import { Plus, Trash2 } from "lucide-react";

const meta: Meta<typeof DButton> = {
  title: "DLibrary/UI/DButton",
  component: DButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DButton>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <DButton variant="primary">Primary</DButton>
        <DButton variant="secondary">Secondary</DButton>
        <DButton variant="subtle">Subtle</DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="primary" disabled>Disabled</DButton>
        <DButton variant="primary" loading>Loading</DButton>
        <DButton variant="secondary" size="sm">Small</DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="primary">
          <Plus className="size-4" />
          With Icon
        </DButton>
        <DButton variant="subtle" size="icon" aria-label="Delete">
          <Trash2 className="size-4" />
        </DButton>
      </div>
      <div className="flex flex-wrap gap-4">
        <DButton variant="secondary" size="tall">
          <span className="flex flex-col items-center">
            <span className="text-lg">1</span>
            <span className="text-xs text-muted-foreground">Rating</span>
          </span>
        </DButton>
        <DButton variant="secondary" size="tall">
          <span className="flex flex-col items-center">
            <span className="text-lg">4</span>
            <span className="text-xs text-muted-foreground">Tall variant</span>
          </span>
        </DButton>
      </div>
    </div>
  ),
};
