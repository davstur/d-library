import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { DText, type DTextAs } from "./DText";

/**
 * DBadge — small status / metadata pill.
 *
 * Typography lives entirely in the inner DText (Option B). Container styling
 * (rounded-full, border, padding) stays on the badge itself. The `variant`
 * prop selects which DText role wraps the children; the `tone` prop maps to
 * a DText variant (color).
 *
 * `bg-secondary` / `text-secondary-foreground` resolve via the new
 * `--secondary` / `--secondary-foreground` tokens added in this release.
 * In all existing themes, `--secondary` defaults to `var(--muted)` so the
 * badge picks up the theme's muted surface — that was the original intent
 * of the badge but the tokens were never wired up before now.
 */
const dBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
  {
    variants: {
      // Variant determines which DText role wraps the children.
      // No typographic classes here — they live in DText.
      variant: {
        default: "",
        meta: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type DBadgeTone = "neutral" | "positive" | "warning" | "critical" | "info";

// Tone → DText variant (color). Semantic vocabulary, not color names, so
// themes can swap palettes without DBadge consumers caring.
const TONE_TO_TEXT_VARIANT: Record<DBadgeTone, "default" | "success" | "warning" | "error" | "primary"> = {
  neutral: "default",
  positive: "success",
  warning: "warning",
  critical: "error",
  info: "primary",
};

const VARIANT_TO_TEXT_ROLE: Record<"default" | "meta", DTextAs> = {
  default: "small",
  meta: "meta",
};

export interface DBadgeProps
  extends Omit<React.ComponentProps<"span">, "className">,
    VariantProps<typeof dBadgeVariants> {
  asChild?: boolean;
  tone?: DBadgeTone;
}

function DBadge({
  asChild = false,
  variant = "default",
  tone = "neutral",
  children,
  ...props
}: DBadgeProps) {
  const Comp = asChild ? Slot : "span";
  const role = VARIANT_TO_TEXT_ROLE[variant ?? "default"];
  const textVariant = TONE_TO_TEXT_VARIANT[tone];

  return (
    <Comp
      data-slot="badge"
      className={cn(dBadgeVariants({ variant }))}
      {...props}
    >
      <DText as={role} variant={textVariant}>
        {children}
      </DText>
    </Comp>
  );
}

export { DBadge, dBadgeVariants };
