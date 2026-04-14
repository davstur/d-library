import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "../utils";

/**
 * DButton - Constrained button component for Tandemic design system
 *
 * Variants:
 * - primary: Main CTAs (maps to shadcn "default")
 * - secondary: Secondary actions like Cancel (maps to shadcn "outline")
 * - subtle: Icon buttons, navigation (maps to shadcn "ghost")
 * - card: Card-style buttons with border and shadow
 *
 * Sizes:
 * - default: Standard button height
 * - sm: Smaller button
 * - tall: Multi-line content (auto height)
 * - icon: Square icon button
 *
 * Width:
 * - auto: Fit content (default)
 * - full: Full width
 */

const dButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        secondary:
          "border bg-background shadow-xs hover:bg-muted hover:text-foreground dark:bg-muted/30 dark:hover:bg-muted/50",
        subtle:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        card:
          "border bg-surface shadow-sm hover:bg-muted/50 transition-colors text-left items-start",
        tile:
          "border bg-surface rounded-xl shadow-sm hover:bg-muted/50 transition-colors items-center",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        tall: "h-auto py-3 px-4",
        icon: "size-9 rounded-sm",
      },
      width: {
        auto: "",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      width: "auto",
    },
  }
);

export interface DButtonProps
  extends Omit<React.ComponentProps<"button">, "className">,
    VariantProps<typeof dButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  active?: boolean;
  hideOn?: "mobile" | "desktop";
}

const hideOnClasses = {
  mobile: "hidden sm:inline-flex",
  desktop: "sm:hidden",
};

function DButton({
  variant = "primary",
  size = "default",
  width = "auto",
  asChild = false,
  loading = false,
  loadingText,
  active = false,
  hideOn,
  children,
  disabled,
  ...props
}: DButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        dButtonVariants({ variant, size, width }),
        active && "bg-muted",
        hideOn && hideOnClasses[hideOn],
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { DButton, dButtonVariants };
