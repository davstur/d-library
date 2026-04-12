import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DProgressBar } from "./DProgressBar";

const meta: Meta<typeof DProgressBar> = {
  title: "DLibrary/Forms/DProgressBar",
  component: DProgressBar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DProgressBar>;

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <DProgressBar progress={25} total={100} label="Processing..." showCount />
      <DProgressBar progress={50} total={100} label="Uploading files" />
      <DProgressBar progress={100} total={100} label="Complete!" />
      <DProgressBar progress={3} total={10} label="Generating cards" showCount />
    </div>
  ),
};
