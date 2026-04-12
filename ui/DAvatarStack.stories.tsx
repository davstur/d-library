import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DAvatarStack } from "./DAvatar";

const meta: Meta<typeof DAvatarStack> = {
  title: "DLibrary/UI/DAvatarStack",
  component: DAvatarStack,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DAvatarStack>;

const USERS = [
  { firstName: "Alice", lastName: "Smith" },
  { firstName: "Bob" },
  { email: "charlie@example.com" },
  { firstName: "Diana", lastName: "Jones" },
  { firstName: "Eve" },
];

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">5 users (shows 3 + overflow)</p>
        <DAvatarStack users={USERS} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Two users</p>
        <DAvatarStack users={USERS.slice(0, 2)} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Single user</p>
        <DAvatarStack users={USERS.slice(0, 1)} />
      </div>
    </div>
  ),
};
