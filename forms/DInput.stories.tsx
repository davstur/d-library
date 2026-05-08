import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search, X } from "lucide-react";
import { DInput } from "./DInput";

const meta: Meta<typeof DInput> = {
  title: "DLibrary/Forms/DInput",
  component: DInput,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DInput>;

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <DInput placeholder="Default input" />
      <DInput placeholder="With value" defaultValue="Hello world" />
      <DInput placeholder="Error state" error defaultValue="Invalid" />
      <DInput placeholder="Disabled" disabled />
      <DInput
        placeholder="Search…"
        type="search"
        aria-label="Search"
        leadingIcon={<Search aria-hidden="true" />}
      />
      <DInput
        placeholder="Search…"
        type="search"
        aria-label="Search"
        leadingIcon={<Search aria-hidden="true" />}
        trailingIcon={
          <button
            type="button"
            aria-label="Clear search"
            className="flex items-center cursor-pointer"
          >
            <X aria-hidden="true" />
          </button>
        }
        defaultValue="query"
      />
    </div>
  ),
};
