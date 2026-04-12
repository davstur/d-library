import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DCardTitle } from "./DCardTitle";

const meta: Meta<typeof DCardTitle> = {
  title: "DLibrary/Typography/DCardTitle",
  component: DCardTitle,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DCardTitle>;

export const Default: Story = {
  render: () => <DCardTitle>Card Title</DCardTitle>,
};
