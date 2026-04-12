import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DText } from "./DText";

const meta: Meta<typeof DText> = {
  title: "DLibrary/Typography/DText",
  component: DText,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DText>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DText>Default text</DText>
      <DText variant="muted">Muted text</DText>
      <DText variant="error">Error text</DText>
      <DText variant="warning">Warning text</DText>
      <DText variant="success">Success text</DText>
      <DText size="sm">Small text</DText>
      <DText size="xs">Extra small text</DText>
      <DText variant="muted" size="sm">Muted + small</DText>
    </div>
  ),
};
