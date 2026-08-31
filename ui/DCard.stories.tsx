import type { Meta, StoryObj } from "@storybook/react-vite";
import { DCard, DCardContent } from "./DCard";
import { DText } from "./DText";
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
          <DText as="h3">Default Card</DText>
          <DText>Cards group related content together.</DText>
        </DCardContent>
      </DCard>
      <DCard variant="error">
        <DCardContent>
          <DText as="h3" variant="error">Error Card</DText>
          <DText variant="error">Something went wrong.</DText>
        </DCardContent>
      </DCard>
      <DCard padding="compact">
        <DCardContent padding="compact">
          <DText>Compact padding card.</DText>
        </DCardContent>
      </DCard>
      <DCard tone="primary">
        <DCardContent>
          <DText bold>1 pending request</DText>
        </DCardContent>
      </DCard>
      <DCard tone="warning">
        <DCardContent>
          <DText bold>3 books processing</DText>
        </DCardContent>
      </DCard>
      <DCard tone="success">
        <DCardContent>
          <DText bold>All synced</DText>
        </DCardContent>
      </DCard>
      <DCard tone="destructive">
        <DCardContent>
          <DText bold>Sync failed</DText>
        </DCardContent>
      </DCard>
      <DCard tone="primary" onClick={() => alert("tapped")}>
        <DCardContent>
          <DText bold>Tappable tinted card</DText>
          <DText as="small" variant="muted">Whole card is one tap target.</DText>
        </DCardContent>
      </DCard>
      <DCard>
        <DCardContent>
          <DText as="h3">With Actions</DText>
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

/**
 * The three spellings of "this card is a control", and what each leaves in the DOM.
 *
 * A consumer styling interactive cards used to have only `role="button"` to key
 * on — which `onClick` sets and the other two do not, so the selector picked
 * *which spelling the author happened to use* rather than whether the card is a
 * control. `data-interactive` is the seam; `role`/`tabIndex` keep their existing
 * meanings.
 *
 * The fourth card is the control: no interactivity, no attribute.
 */
export const InteractiveSpellings: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <DCard onClick={() => {}}>
        <DCardContent>
          <DText as="h3">onClick</DText>
          <DText>Marked automatically. Also gets role=button + tabIndex.</DText>
        </DCardContent>
      </DCard>

      <DCard swipe={{ interactive: true }}>
        <DCardContent>
          <DText as="h3">swipe.interactive</DText>
          <DText>
            Marked automatically — it already paints a pointer cursor, so the
            library treats it as a control.
          </DText>
        </DCardContent>
      </DCard>

      <DCard asChild interactive>
        <a href="#interactive-spellings">
          <DCardContent>
            <DText as="h3">asChild + interactive</DText>
            <DText>
              The opt-in. With asChild the library cannot know whether the child
              it is handed is interactive, so the consumer says so.
            </DText>
          </DCardContent>
        </a>
      </DCard>

      <DCard>
        <DCardContent>
          <DText as="h3">Plain card</DText>
          <DText>No interactivity, and no data-interactive.</DText>
        </DCardContent>
      </DCard>
    </div>
  ),
};
