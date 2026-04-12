"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../primitives/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../primitives/alert-dialog";
import { DButton } from "./DButton";

// DDialog - Simplified dialog with props-based API
interface DDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function DDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: DDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

// DConfirmDialog - Minimal confirmation dialog
interface DConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
}

export function DConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
}: DConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && !loading && onClose()}
    >
      <AlertDialogContent onEscapeKeyDown={loading ? (e) => e.preventDefault() : undefined}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <DButton variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </DButton>
          <DButton
            variant={destructive ? "destructive" : "primary"}
            onClick={onConfirm}
            loading={loading}
            loadingText={confirmLabel}
          >
            {confirmLabel}
          </DButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
