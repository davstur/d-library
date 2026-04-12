import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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
      {/* Basic table */}
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

      {/* Scrollable table */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Scrollable (max-h-40)</p>
        <div className="rounded-md border overflow-auto max-h-40">
          <DTable>
            <DTableHeader>
              <DTableRow>
                <DTableHead>Word</DTableHead>
                <DTableHead align="right">Count</DTableHead>
              </DTableRow>
            </DTableHeader>
            <DTableBody>
              {[...WORD_DATA, ...WORD_DATA, ...WORD_DATA].map((row, i) => (
                <DTableRow key={i}>
                  <DTableCell>{row.baseform}</DTableCell>
                  <DTableCell align="right">{row.count}</DTableCell>
                </DTableRow>
              ))}
            </DTableBody>
          </DTable>
        </div>
      </div>

      {/* Empty table */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">Empty table</p>
        <div className="rounded-md border">
          <DTable>
            <DTableHeader>
              <DTableRow>
                <DTableHead>Word</DTableHead>
                <DTableHead align="right">Count</DTableHead>
              </DTableRow>
            </DTableHeader>
            <DTableBody>
              <DTableRow>
                <DTableCell colSpan={2} align="center" variant="muted">
                  No data available
                </DTableCell>
              </DTableRow>
            </DTableBody>
          </DTable>
        </div>
      </div>
    </div>
  ),
};
