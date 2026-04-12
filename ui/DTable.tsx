import * as React from "react";
import { cn } from "../utils";

/**
 * DTable - Lightweight table primitives for the Tandemic design system.
 *
 * Provides styled wrappers around native HTML table elements with
 * consistent spacing, borders, and typography.
 *
 * Usage:
 *   <DTable>
 *     <DTableHeader>
 *       <DTableRow><DTableHead>Name</DTableHead></DTableRow>
 *     </DTableHeader>
 *     <DTableBody>
 *       <DTableRow><DTableCell>Alice</DTableCell></DTableRow>
 *     </DTableBody>
 *   </DTable>
 *
 * Wrap in a container with overflow-auto / max-h-* to make scrollable.
 */

export function DTable(
  props: Omit<React.ComponentProps<"table">, "className">
) {
  return (
    <table
      data-slot="table"
      className="w-full text-sm caption-bottom"
      {...props}
    />
  );
}

export function DTableHeader(
  props: Omit<React.ComponentProps<"thead">, "className">
) {
  return (
    <thead
      data-slot="table-header"
      className="bg-muted/50 sticky top-0 z-10"
      {...props}
    />
  );
}

export function DTableBody(
  props: Omit<React.ComponentProps<"tbody">, "className">
) {
  return (
    <tbody
      data-slot="table-body"
      className="[&_tr:last-child]:border-0"
      {...props}
    />
  );
}

export function DTableRow(
  props: Omit<React.ComponentProps<"tr">, "className">
) {
  return (
    <tr
      data-slot="table-row"
      className="border-b border-border/50 transition-colors"
      {...props}
    />
  );
}

type DTableHeadProps = Omit<React.ComponentProps<"th">, "className"> & {
  align?: "left" | "right" | "center";
};

export function DTableHead({
  align = "left",
  ...props
}: DTableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "px-3 py-1.5 font-medium text-muted-foreground whitespace-nowrap",
        align === "left" && "text-left",
        align === "right" && "text-right",
        align === "center" && "text-center",
      )}
      {...props}
    />
  );
}

type DTableCellProps = Omit<React.ComponentProps<"td">, "className"> & {
  align?: "left" | "right" | "center";
  variant?: "default" | "muted" | "strong";
};

export function DTableCell({
  align = "left",
  variant = "default",
  ...props
}: DTableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-1.5 tabular-nums",
        align === "right" && "text-right",
        align === "center" && "text-center",
        variant === "muted" && "text-muted-foreground",
        variant === "strong" && "font-medium",
      )}
      {...props}
    />
  );
}
