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

const DefaultLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => <a href={href}>{children}</a>;

// DMenuItem - Simplified item with href/onClick/destructive props
interface DMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
  /**
   * Link component to use for href items. Defaults to a plain <a> tag.
   * Pass Next.js `Link` from "next/link" when used in a Next.js project.
   */
  linkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
  }>;
}

export function DMenuItem({
  children,
  onClick,
  href,
  destructive,
  linkComponent: LinkComp = DefaultLink,
}: DMenuItemProps) {
  const variant = destructive ? "destructive" : "default";

  if (href) {
    return (
      <DropdownMenuItem asChild variant={variant}>
        <LinkComp href={href}>{children}</LinkComp>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={onClick} variant={variant}>
      {children}
    </DropdownMenuItem>
  );
}
