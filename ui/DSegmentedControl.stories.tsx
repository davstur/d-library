import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DSegmentedControl } from "./DSegmentedControl";

const meta: Meta<typeof DSegmentedControl> = {
  title: "DLibrary/UI/DSegmentedControl",
  component: DSegmentedControl,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DSegmentedControl>;

export const AllVariants: Story = {
  render: () => {
    const [view, setView] = React.useState("concept");
    const [grouped, setGrouped] = React.useState("a1");

    return (
      <div className="flex flex-col gap-6">
        <DSegmentedControl
          ariaLabel="View"
          value={view}
          onChange={setView}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "raw", label: "Raw" },
          ]}
        />

        <DSegmentedControl
          ariaLabel="Grammar view + level"
          value={grouped}
          onChange={setGrouped}
          dividers={[1, 4]}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "a1", label: "A1" },
            { value: "a2", label: "A2" },
            { value: "b1", label: "B1" },
            { value: "raw", label: "Raw" },
          ]}
        />

        <DSegmentedControl
          size="sm"
          ariaLabel="Small"
          value={view}
          onChange={setView}
          options={[
            { value: "concept", label: "Concept" },
            { value: "practice", label: "Practice" },
            { value: "raw", label: "Raw" },
          ]}
        />
      </div>
    );
  },
};
