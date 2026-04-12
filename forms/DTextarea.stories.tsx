import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DTextarea } from "./DTextarea";

const meta: Meta<typeof DTextarea> = {
  title: "DLibrary/Forms/DTextarea",
  component: DTextarea,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DTextarea>;

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DTextarea placeholder="Default textarea" />
      <DTextarea placeholder="Error state" error />
      <DTextarea placeholder="Disabled" disabled />
    </div>
  ),
};
