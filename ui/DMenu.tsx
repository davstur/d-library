"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../primitives/dropdown-menu";

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
