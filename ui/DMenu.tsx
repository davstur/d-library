"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../primitives/dropdown-menu";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../utils";

// DMenu - Simplified dropdown menu wrapper
export function DMenu({ children }: { children: React.ReactNode }) {
  return <DropdownMenu>{children}</DropdownMenu>;
}

// DMenuTrigger - Wraps the trigger element
export function DMenuTrigger({ children }: { children: React.ReactNode }) {
  return <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>;
}

// DMenuContent - Always align="end" (matches all current usage)
export function DMenuContent({ children }: { children: React.ReactNode }) {
  return <DropdownMenuContent align="end">{children}</DropdownMenuContent>;
}

// DMenuItem - Simplified item with href/onClick/destructive props
interface DMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
}

export function DMenuItem({
  children,
  onClick,
  href,
  destructive,
}: DMenuItemProps) {
  const variant = destructive ? "destructive" : "default";

  if (href) {
    return (
      <DropdownMenuItem
        variant={variant}
        onClick={() => { window.location.href = href; }}
      >
        {children}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={onClick} variant={variant}>
      {children}
    </DropdownMenuItem>
  );
}

// DMenuCheckboxItem - Checkbox item with visible box indicator
interface DMenuCheckboxItemProps {
  children: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function DMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
}: DMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={(e) => e.preventDefault()}
      className="focus:bg-muted focus:text-foreground relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 px-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      <span className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm border",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
      )}>
        {checked && <CheckIcon className="size-3" />}
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

// DMenuLabel - Non-interactive label for grouping items
export function DMenuLabel({ children }: { children: React.ReactNode }) {
  return <DropdownMenuLabel>{children}</DropdownMenuLabel>;
}
