import type { Meta, StoryObj } from "@storybook/react-vite";
import { DMarkdown } from "./DMarkdown";

const meta: Meta<typeof DMarkdown> = {
  title: "DLibrary/UI/DMarkdown",
  component: DMarkdown,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DMarkdown>;

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <DMarkdown>{`# Heading 1\n\n## Heading 2\n\n### Heading 3\n\nA paragraph with **bold** and *italic* text.\n\n- List item one\n- List item two\n- List item three\n\n1. Numbered one\n2. Numbered two\n\nSome \`inline code\` here.\n\n\`\`\`\ncode block\n\`\`\``}</DMarkdown>
    </div>
  ),
};
