import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils";

/**
 * DDivider - Section separator for Tandemic design system
 *
 * Replaces patterns like: <div className="border-t pt-4">
 *
 * Spacing variants control the padding-top after the border:
 * - sm: pt-2
 * - md: pt-4 (default)
 * - lg: pt-6
 */

const dDividerVariants = cva("border-t", {
  variants: {
    spacing: {
      none: "",
      sm: "pt-2",
      md: "pt-4",
      lg: "pt-6",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export interface DDividerProps
  extends Omit<React.ComponentProps<"div">, "className">,
    VariantProps<typeof dDividerVariants> {}

function DDivider({ spacing = "md", ...props }: DDividerProps) {
  return (
    <div
      data-slot="divider"
      className={cn(dDividerVariants({ spacing }))}
      {...props}
    />
  );
}

export { DDivider, dDividerVariants };
