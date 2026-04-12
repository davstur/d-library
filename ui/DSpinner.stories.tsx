import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DLoadingSpinner } from "./DSpinner";

const meta: Meta<typeof DLoadingSpinner> = {
  title: "DLibrary/UI/DSpinner",
  component: DLoadingSpinner,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DLoadingSpinner>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <DLoadingSpinner size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DLoadingSpinner size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DLoadingSpinner size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  ),
};
