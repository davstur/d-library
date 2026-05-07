import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * DBadge — small status / metadata pill.
 *
 * Typography for container components that compose icons + text (badges,
 * buttons) lives in the variant CVA, not in an inner DText. This is the
 * refined Option B: free-floating text uses DText; container components with
 * mixed icon+text content keep typography centralized in their variant
 * definitions. Without this, the badge's inline-flex / gap / icon-sizing
 * selectors (`[&>svg]:size-3`, `gap-1`) would target the wrong nesting level
 * and the icon would render at native size, forcing a vertical stack.
 *
 * `bg-secondary` / `text-secondary-foreground` resolve via the new
 * `--secondary` / `--secondary-foreground` tokens added in this release.
 * In all existing themes, `--secondary` defaults to `var(--muted)` so the
 * badge picks up the theme's muted surface — the original intent.
 */
const dBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden border-transparent bg-secondary [a&]:hover:bg-secondary/90",
  {
    variants: {
      // Typographic variants. The role names map to DText roles
      // conceptually so the design vocabulary stays consistent — but the
      // classes live here on the container so flex/gap/icon-sizing
      // selectors can target direct children correctly.
      variant: {
        default: "text-xs font-medium",
        meta: "text-xs font-medium font-mono uppercase tracking-wide",
      },
      // Color tone. Semantic vocabulary, not color names — themes swap
      // the underlying tokens.
      tone: {
        neutral: "text-foreground",
        positive: "text-success",
        warning: "text-warning",
        critical: "text-destructive",
        info: "text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "neutral",
    },
  }
);

export interface DBadgeProps
  extends Omit<React.ComponentProps<"span">, "className">,
    VariantProps<typeof dBadgeVariants> {
  asChild?: boolean;
}

function DBadge({
  asChild = false,
  variant,
  tone,
  ...props
}: DBadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(dBadgeVariants({ variant, tone }))}
      {...props}
    />
  );
}

export { DBadge, dBadgeVariants };
