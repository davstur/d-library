import type { Meta, StoryObj } from "@storybook/react-vite";
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
        <Star className="size-3" />
        Featured
      </DBadge>
      <DBadge>
        <Check className="size-3" />
        Complete
      </DBadge>
      <DBadge>
        <Clock className="size-3" />
        Pending
      </DBadge>
    </div>
  ),
};

/**
 * MetaVariant — mono uppercase tracking-wide treatment used for UI metadata
 * tags (CEFR levels, status pills, "DUE TODAY" callouts, etc.). NEW story
 * (not an amendment of AllVariants) per iter-3 finding F-N8.
 */
export const MetaVariant: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <DBadge variant="meta">A1</DBadge>
      <DBadge variant="meta">A2</DBadge>
      <DBadge variant="meta">B1</DBadge>
      <DBadge variant="meta">B2</DBadge>
      <DBadge variant="meta">C1</DBadge>
    </div>
  ),
};

export const MetaWithTones: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <DBadge variant="meta" tone="neutral">Neutral</DBadge>
      <DBadge variant="meta" tone="positive">Mastered</DBadge>
      <DBadge variant="meta" tone="warning">Due today</DBadge>
      <DBadge variant="meta" tone="critical">Overdue</DBadge>
      <DBadge variant="meta" tone="info">New</DBadge>
    </div>
  ),
};
