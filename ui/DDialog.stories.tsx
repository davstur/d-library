"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DDialog, DConfirmDialog } from "./DDialog";
import { DButton } from "./DButton";
import { DText } from "../typography/DText";

const meta: Meta<typeof DDialog> = {
  title: "DLibrary/UI/DDialog",
  component: DDialog,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DDialog>;

function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DButton onClick={() => setOpen(true)}>Open Dialog</DButton>
      <DDialog open={open} onClose={() => setOpen(false)} title="Example Dialog" description="This is a dialog description.">
        <DText>Dialog body content goes here.</DText>
      </DDialog>
    </>
  );
}

function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <DButton variant="secondary" onClick={() => setOpen(true)}>Open Confirm</DButton>
      <DConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete Item?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </>
  );
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <DialogDemo />
      <ConfirmDialogDemo />
    </div>
  ),
};
