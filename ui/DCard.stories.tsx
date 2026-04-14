import type { Meta, StoryObj } from "@storybook/react-vite";
import { DCard, DCardContent } from "./DCard";
import { DCardTitle } from "../typography/DCardTitle";
import { DText } from "../typography/DText";
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
          <DCardTitle>Default Card</DCardTitle>
          <DText>Cards group related content together.</DText>
        </DCardContent>
      </DCard>
      <DCard variant="error">
        <DCardContent>
          <DCardTitle>Error Card</DCardTitle>
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
          <DCardTitle>With Actions</DCardTitle>
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
