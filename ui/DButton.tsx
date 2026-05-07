import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "../utils";
import { DText, dTextVariants, type DTextAs } from "./DText";

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
  // Typography (text-sm, font-medium) intentionally stripped — lives in the
  // inner DText (Option B). Container handles only layout, color, focus.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
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
        // Layout dimensions only. Text size comes from the DText role
        // mapped per (size) below.
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        tall: "h-auto py-3 px-4",
        icon: "size-9 rounded-sm",
        "icon-sm": "size-8 rounded-sm",
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

// Map button size to the DText role that wraps the button's text content.
// Default and tall both map to `label` (text-sm font-medium <span>) since
// the previous DButton baked `text-sm font-medium` into all variants and
// tall just added vertical spacing. Mapping `tall` to a <p>-rendering role
// would put block content inside <button>, which is invalid HTML.
const SIZE_TO_TEXT_ROLE: Record<string, DTextAs | undefined> = {
  default: "label",
  sm: "small",
  tall: "label",
  icon: undefined,
  "icon-sm": undefined,
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
  const role = SIZE_TO_TEXT_ROLE[size ?? "default"];

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        dButtonVariants({ variant, size, width }),
        active && "bg-muted",
        hideOn && hideOnClasses[hideOn],
        // When asChild=true we can't insert a DText between the Slot and
        // the consumer's element — Slot requires a single child. Apply the
        // role's typographic classes directly to the wrapping element so
        // the consumer's <Link> (or whatever) carries the right typography.
        // When asChild=false we wrap in DText below; this className is
        // redundant but harmless (same classes applied at two levels).
        asChild && role && dTextVariants({ as: role }),
      )}
      disabled={disabled || loading}
      {...props}
    >
      {(() => {
        const content = loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        );
        // Icon-only buttons have no text role. asChild already has the
        // typography on the Slot via the className above — don't double-wrap.
        if (role === undefined || asChild) return content;
        return <DText as={role}>{content}</DText>;
      })()}
    </Comp>
  );
}

export { DButton, dButtonVariants };
