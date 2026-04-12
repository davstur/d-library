import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DBackButton } from "./DBackButton";

const meta: Meta<typeof DBackButton> = {
  title: "DLibrary/Navigation/DBackButton",
  component: DBackButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DBackButton>;

export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <DBackButton href="/decks" label="Back to decks" />
      <DBackButton href="/" label="Home" />
    </div>
  ),
};
