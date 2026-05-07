import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layers, BookOpen, BookText, Users, Settings } from "lucide-react";
import { DBottomTabBar, DBottomTabItem } from "./DBottomTabBar";

const meta: Meta<typeof DBottomTabBar> = {
  title: "DLibrary/UI/DBottomTabBar",
  component: DBottomTabBar,
  tags: ["autodocs"],
  parameters: {
    // Phone-frame layout to make the fixed-bottom bar render in context.
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      // Mobile-frame mock so the fixed-bottom bar has a parent to stick to.
      <div
        className="relative bg-background"
        style={{
          width: "390px",
          height: "640px",
          margin: "0 auto",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            Page content area. The bottom-tab bar is fixed to the viewport,
            but in this Storybook frame it appears at the bottom of the
            390 × 640 device mock.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DBottomTabBar>;

export const FourTabs: Story = {
  render: () => (
    <DBottomTabBar ariaLabel="Primary navigation">
      <DBottomTabItem
        icon={<Layers className="size-[18px]" />}
        label="Decks"
        active
      />
      <DBottomTabItem
        icon={<BookOpen className="size-[18px]" />}
        label="Texts"
      />
      <DBottomTabItem
        icon={<BookText className="size-[18px]" />}
        label="Grammar"
      />
      <DBottomTabItem
        icon={<Users className="size-[18px]" />}
        label="Friends"
        badge
      />
    </DBottomTabBar>
  ),
};

export const FiveTabs: Story = {
  render: () => (
    <DBottomTabBar ariaLabel="Primary navigation">
      <DBottomTabItem
        icon={<Layers className="size-[18px]" />}
        label="Decks"
        active
      />
      <DBottomTabItem
        icon={<BookOpen className="size-[18px]" />}
        label="Texts"
      />
      <DBottomTabItem
        icon={<BookText className="size-[18px]" />}
        label="Grammar"
      />
      <DBottomTabItem
        icon={<Users className="size-[18px]" />}
        label="Friends"
      />
      <DBottomTabItem
        icon={<Settings className="size-[18px]" />}
        label="Settings"
      />
    </DBottomTabBar>
  ),
};

export const WithButtonHandlers: Story = {
  render: () => (
    <DBottomTabBar ariaLabel="Primary navigation">
      <DBottomTabItem
        icon={<Layers className="size-[18px]" />}
        label="Decks"
        active
        onClick={() => alert("Decks tapped")}
      />
      <DBottomTabItem
        icon={<BookOpen className="size-[18px]" />}
        label="Texts"
        onClick={() => alert("Texts tapped")}
      />
    </DBottomTabBar>
  ),
};
