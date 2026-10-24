import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowUp } from "lucide-react";
import { createRef } from "react";
import { DTextarea } from "./DTextarea";
import { DIconButton } from "../ui/DIconButton";

const meta: Meta<typeof DTextarea> = {
  title: "DLibrary/Forms/DTextarea",
  component: DTextarea,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DTextarea>;

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DTextarea placeholder="Default textarea" />
      <DTextarea placeholder="Error state" error />
      <DTextarea placeholder="Disabled" disabled />
    </div>
  ),
};

const composer = createRef<HTMLTextAreaElement>();

/**
 * `className`, merged last, replaces the wrapper a consumer had to put around the
 * textarea to reach it (`[&_textarea]:resize-none` and friends, kraftwerk#22) — an
 * arbitrary variant that keeps working only while the internals stay one bare
 * `<textarea>`.
 *
 * A phone chat composer: one line at rest (`min-h-11`, not the default
 * `min-h-16`), no drag grabber in the corner (`resize-none`), a cap before it
 * scrolls, and room on the right for the overlaid send button. The `ref` reaches
 * the `<textarea>`, which is how a composer puts focus back after sending.
 */
export const ClassName: Story = {
  render: () => (
    <div className="relative w-80">
      <DTextarea
        ref={composer}
        rows={1}
        aria-label="Message"
        placeholder="Ask the coach"
        className="max-h-40 min-h-11 resize-none overflow-y-auto pr-14"
      />
      <DIconButton
        icon={<ArrowUp className="size-5" />}
        aria-label="Send"
        variant="primary"
        size="tall"
        shape="circle"
        disabled
        disabledTreatment="none"
        className="absolute right-0 bottom-0 disabled:bg-muted disabled:text-muted-foreground"
      />
    </div>
  ),
  play: async () => {
    const area = composer.current;
    if (!(area instanceof HTMLTextAreaElement)) throw new Error(`ref must be the <textarea>, got ${String(area)}`);
    const style = getComputedStyle(area);
    if (style.resize !== "none") throw new Error(`className must win: resize is ${style.resize}`);
    if (style.minHeight !== "44px") throw new Error(`className must win over min-h-16: min-height is ${style.minHeight}`);
  },
};

export const ClassNameDark: Story = { ...ClassName, globals: { mode: "dark" } };
