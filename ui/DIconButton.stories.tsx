import type { Meta, StoryObj } from "@storybook/react-vite";
import { DIconButton } from "./DIconButton";
import { DMenu, DMenuTrigger, DMenuContent, DMenuItem } from "./DMenu";
import { Layers, BookOpen, Users, MoreVertical, Trash2 } from "lucide-react";

const meta: Meta<typeof DIconButton> = {
  title: "DLibrary/UI/DIconButton",
  component: DIconButton,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DIconButton>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-8">
      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">Default</span>
        <DIconButton icon={<Layers className="size-5" />} aria-label="Decks" />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">With tooltip</span>
        <DIconButton
          icon={<Layers className="size-5" />}
          aria-label="Decks"
          tooltip="Decks"
        />
        <DIconButton
          icon={<BookOpen className="size-5" />}
          aria-label="Texts"
          tooltip="Texts"
        />
        <DIconButton
          icon={<Users className="size-5" />}
          aria-label="Friends"
          tooltip="Friends"
        />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">Active</span>
        <DIconButton
          icon={<Layers className="size-5" />}
          aria-label="Decks"
          tooltip="Decks"
          active
        />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">Destructive</span>
        <DIconButton
          icon={<Trash2 className="size-5" />}
          aria-label="Delete"
          tooltip="Delete"
        />
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">asChild + link</span>
        <DIconButton
          icon={<Layers className="size-5" />}
          aria-label="Decks"
          tooltip="Decks"
          asChild
        >
          <a href="#" />
        </DIconButton>
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">DMenu trigger</span>
        <DMenu>
          <DMenuTrigger>
            <DIconButton
              icon={<MoreVertical className="size-5" />}
              aria-label="More options"
            />
          </DMenuTrigger>
          <DMenuContent>
            <DMenuItem>Edit</DMenuItem>
            <DMenuItem destructive>Delete</DMenuItem>
          </DMenuContent>
        </DMenu>
      </section>

      <section className="flex items-center gap-4">
        <span className="w-40 text-sm text-muted-foreground">
          Badge (custom icon node)
        </span>
        <DIconButton
          icon={
            <span className="relative">
              <Users className="size-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full" />
            </span>
          }
          aria-label="Friends with pending requests"
          tooltip="Friends"
        />
      </section>
    </div>
  ),
};
