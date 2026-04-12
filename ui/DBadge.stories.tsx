import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DBadge } from "./DBadge";
import { Star, Check, Clock } from "lucide-react";

const meta: Meta<typeof DBadge> = {
  title: "DLibrary/UI/DBadge",
  component: DBadge,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DBadge>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <DBadge>
        <Star className="h-3 w-3" />
        Featured
      </DBadge>
      <DBadge>
        <Check className="h-3 w-3" />
        Complete
      </DBadge>
      <DBadge>
        <Clock className="h-3 w-3" />
        Pending
      </DBadge>
    </div>
  ),
};
