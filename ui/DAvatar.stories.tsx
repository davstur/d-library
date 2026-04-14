import type { Meta, StoryObj } from "@storybook/react-vite";
import { DAvatar, DAvatarStack } from "./DAvatar";

const meta: Meta<typeof DAvatar> = {
  title: "DLibrary/UI/DAvatar",
  component: DAvatar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DAvatar>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">Different Initials</p>
        <div className="flex gap-3">
          <DAvatar firstName="Alice" lastName="Smith" />
          <DAvatar firstName="Bob" />
          <DAvatar email="charlie@example.com" />
          <DAvatar />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Avatar Stack</p>
        <DAvatarStack
          users={[
            { firstName: "Alice", lastName: "Smith" },
            { firstName: "Bob" },
            { email: "charlie@example.com" },
            { firstName: "Diana", lastName: "Jones" },
            { firstName: "Eve" },
          ]}
        />
      </div>
    </div>
  ),
};
