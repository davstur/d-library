import type { Meta, StoryObj } from "@storybook/react-vite";
import { DCard, DCardContent } from "./DCard";
import { DText } from "./DText";
import { DButton } from "./DButton";

const meta: Meta<typeof DCard> = {
  title: "DLibrary/UI/DCard",
  component: DCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DCard>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <DCard>
        <DCardContent>
          <DText variant="bold" size="lg">Default Card</DText>
          <DText>Cards group related content together.</DText>
        </DCardContent>
      </DCard>
      <DCard variant="error">
        <DCardContent>
          <DText variant="bold" size="lg">Error Card</DText>
          <DText variant="error">Something went wrong.</DText>
        </DCardContent>
      </DCard>
      <DCard padding="compact">
        <DCardContent padding="compact">
          <DText>Compact padding card.</DText>
        </DCardContent>
      </DCard>
      <DCard>
        <DCardContent>
          <DText variant="bold" size="lg">With Actions</DText>
          <DText>Card with action buttons.</DText>
          <div className="flex gap-2 pt-4">
            <DButton variant="secondary">Cancel</DButton>
            <DButton>Confirm</DButton>
          </div>
        </DCardContent>
      </DCard>
    </div>
  ),
};
