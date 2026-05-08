import type { Meta, StoryObj } from "@storybook/react-vite";
import { DText } from "./DText";

const meta: Meta<typeof DText> = {
  title: "DLibrary/UI/DText",
  component: DText,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DText>;

/**
 * AllVariants — renders the full role × variant matrix plus modifier
 * combinations. This story is in Tandemic's visual-regression D_STORIES list,
 * so adding new content here must be done carefully (it changes the baseline).
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      {/* Default + variants — same content as the original baseline story */}
      <DText>Default inline text</DText>
      <DText variant="muted">Muted inline text</DText>
      <DText variant="error">Error inline text</DText>
      <DText variant="warning">Warning inline text</DText>
      <DText variant="success">Success inline text</DText>
      <DText variant="primary">Primary inline text</DText>
      <DText variant="accent">Accent inline text</DText>
    </div>
  ),
};

/**
 * Roles — the 13 typographic presets. Each role is a complete combo of
 * size + weight + font + transform + tracking. New stories in the visual-
 * regression list should use these instead of orthogonal size/weight props.
 */
export const Roles: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <DText as="display">Display — focal text</DText>
      <DText as="hero">Hero card title</DText>
      <DText as="h1">Page heading H1</DText>
      <DText as="h2">Section heading H2</DText>
      <DText as="h3">Subsection heading H3</DText>
      <DText as="h4">Card subtitle H4</DText>
      <DText as="body">
        Body paragraph — used for prose and generally everything that isn't a
        heading or a metadata label.
      </DText>
      <DText as="caption">Caption — small italic note or example</DText>
      <DText as="label">Label — form labels and default-button text</DText>
      <DText as="meta">Meta · uppercase · mono</DText>
      <DText as="cta">resume →</DText>
      <DText as="small">Small — sm-button text, dense UI labels</DText>
      <DText as="kicker" variant="muted">Kicker — section eyebrow above a heading</DText>
    </div>
  ),
};

/**
 * Modifiers — italic and bold on top of any role.
 */
export const Modifiers: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-md">
      <DText as="body">
        Plain body with <DText italic>italic emphasis</DText> and{" "}
        <DText bold>bold emphasis</DText> mid-sentence.
      </DText>
      <DText as="h2" italic>Italic heading</DText>
      <DText as="meta" variant="primary">Primary meta tag</DText>
      <DText as="caption" variant="muted">Muted caption (italic baked in)</DText>
    </div>
  ),
};
