import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

/**
 * DBadge - Badge component for Tandemic design system
 *
 * Simple badge with secondary background styling.
 */

export interface DBadgeProps extends Omit<React.ComponentProps<"span">, "className"> {
  asChild?: boolean;
}

function DBadge({
  asChild = false,
  ...props
}: DBadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className="inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90"
      {...props}
    />
  );
}

export { DBadge };
