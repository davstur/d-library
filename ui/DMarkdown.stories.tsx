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

export const GfmExtensions: Story = {
  name: "GFM (tables, strikethrough, autolinks)",
  render: () => (
    <div className="max-w-2xl space-y-4">
      <DMarkdown>{`A pipe-table:\n\n| Gender | Singular | Plural |\n|---|---|---|\n| Masculine | le | les |\n| Feminine | la | les |\n| Before vowel / silent h | l' | les |\n\n~~Strikethrough~~ text and an auto-linked URL: https://example.com.`}</DMarkdown>
    </div>
  ),
};

/**
 * WithBlockquote — exercises the iter-3-introduced theme-scoped blockquote
 * styling. Default theme: inherits browser/Tailwind preflight (left rule
 * via globals.css @layer base). Studio theme: muted-bg + sage-accent
 * treatment via themes/studio.css.
 *
 * This is a NEW story (not an amendment of AllVariants) per iter-3 finding
 * F-N8 — keeps the existing AllVariants baseline unchanged for visual
 * regression while exercising blockquote rendering separately.
 */
export const WithBlockquote: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <DMarkdown>{`The two principal past tenses in French express different aspects of past time.\n\n> The **passé composé** narrates discrete, completed actions:\n> - *J'ai mangé une pomme.* — I ate an apple.\n> - *Elle est arrivée à huit heures.* — She arrived at eight.\n>\n> The **imparfait** describes ongoing states:\n> - *Il pleuvait toute la journée.* — It was raining all day.\n\nChoosing between them is a question of how the speaker views the action.`}</DMarkdown>
    </div>
  ),
};

/**
 * WithDropCap — wraps a DMarkdown in a `.dropcap` container (theme-agnostic
 * utility class shipped from themes/studio.css). Renders an editorial
 * first-letter treatment on the first paragraph.
 */
export const WithDropCap: Story = {
  render: () => (
    <div className="max-w-md">
      <div className="dropcap">
        <DMarkdown>{`The two principal past tenses in French express different aspects of past time. Choosing between them is one of the most consistently challenging decisions for English-speaking learners.\n\nThe choice is rarely about *when* something happened. It is about *how* the speaker views it.`}</DMarkdown>
      </div>
    </div>
  ),
};
