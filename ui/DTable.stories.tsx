import type { Meta, StoryObj } from "@storybook/react-vite";
import { DTable, DTableHeader, DTableBody, DTableRow, DTableHead, DTableCell } from "./DTable";

const meta: Meta<typeof DTable> = {
  title: "DLibrary/UI/DTable",
  component: DTable,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DTable>;

const WORD_DATA = [
  { baseform: "sein", pos: "VERB", count: 342 },
  { baseform: "haben", pos: "VERB", count: 218 },
  { baseform: "werden", pos: "VERB", count: 195 },
  { baseform: "Mann", pos: "NOUN", count: 87 },
  { baseform: "Frau", pos: "NOUN", count: 64 },
  { baseform: "gut", pos: "ADJ", count: 51 },
];

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 max-w-xl">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Basic table</p>
        <div className="rounded-md border">
          <DTable>
            <DTableHeader>
              <DTableRow>
                <DTableHead>Word</DTableHead>
                <DTableHead>Part of Speech</DTableHead>
                <DTableHead align="right">Count</DTableHead>
              </DTableRow>
            </DTableHeader>
            <DTableBody>
              {WORD_DATA.map((row) => (
                <DTableRow key={row.baseform}>
                  <DTableCell variant="strong">{row.baseform}</DTableCell>
                  <DTableCell variant="muted">{row.pos}</DTableCell>
                  <DTableCell align="right">{row.count}</DTableCell>
                </DTableRow>
              ))}
            </DTableBody>
          </DTable>
        </div>
      </div>
    </div>
  ),
};
