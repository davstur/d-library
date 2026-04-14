import type { Meta, StoryObj } from "@storybook/react-vite";
import { DDivider } from "./DDivider";

const meta: Meta<typeof DDivider> = {
  title: "DLibrary/UI/DDivider",
  component: DDivider,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DDivider>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <p className="text-sm">Content above (sm spacing)</p>
      <DDivider spacing="sm" />
      <p className="text-sm">Content below</p>
      <p className="text-sm">Content above (md spacing)</p>
      <DDivider spacing="md" />
      <p className="text-sm">Content below</p>
      <p className="text-sm">Content above (lg spacing)</p>
      <DDivider spacing="lg" />
      <p className="text-sm">Content below</p>
    </div>
  ),
};
