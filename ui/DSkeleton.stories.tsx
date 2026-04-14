import type { Meta, StoryObj } from "@storybook/react-vite";
import { DSkeleton, DSkeletonCard } from "./DSkeleton";

const meta: Meta<typeof DSkeleton> = {
  title: "DLibrary/UI/DSkeleton",
  component: DSkeleton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DSkeleton>;

export const Primitives: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Text variants (sizes)</span>
        <DSkeleton size="xs" width="w-1/2" />
        <DSkeleton size="sm" width="w-3/4" />
        <DSkeleton size="md" width="w-full" />
        <DSkeleton size="lg" width="w-2/3" />
        <DSkeleton size="xl" width="w-1/3" />
      </div>
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Circular</span>
        <div className="flex gap-3">
          <DSkeleton variant="circular" size="lg" width="w-6" />
          <DSkeleton variant="circular" size="xl" width="w-8" />
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground">Rectangular</span>
        <DSkeleton variant="rectangular" size="xl" width="w-24" />
      </div>
    </div>
  ),
};

export const CardSkeletons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <span className="text-xs text-muted-foreground">Compact (1 line)</span>
      <DSkeletonCard lines={1} compact />
      <span className="text-xs text-muted-foreground">Compact (2 lines)</span>
      <DSkeletonCard lines={2} compact />
      <span className="text-xs text-muted-foreground">Default (3 lines)</span>
      <DSkeletonCard lines={3} />
    </div>
  ),
};
