import type { Meta, StoryObj } from "@storybook/react-vite";
import { DMenu, DMenuTrigger, DMenuContent, DMenuItem } from "./DMenu";
import { DButton } from "./DButton";
import { MoreVertical, Edit2, Trash2, Share2 } from "lucide-react";

const meta: Meta<typeof DMenu> = {
  title: "DLibrary/UI/DMenu",
  component: DMenu,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DMenu>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <DMenu>
        <DMenuTrigger>
          <DButton variant="subtle" size="icon">
            <MoreVertical className="h-4 w-4" />
          </DButton>
        </DMenuTrigger>
        <DMenuContent>
          <DMenuItem onClick={() => {}}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </DMenuItem>
          <DMenuItem onClick={() => {}}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DMenuItem>
          <DMenuItem onClick={() => {}} destructive>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DMenuItem>
        </DMenuContent>
      </DMenu>
    </div>
  ),
};
