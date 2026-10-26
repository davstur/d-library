import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn, FOCUS_RING } from "../utils";

/**
 * DButton - Constrained button component for Tandemic design system
 *
 * Variants:
 * - primary: Main CTAs (maps to shadcn "default")
 * - secondary: Secondary actions like Cancel (maps to shadcn "outline")
 * - subtle: Icon buttons, navigation (maps to shadcn "ghost")
 * - card: Card-style buttons with border and shadow
 * - pill: Rounded-full primary CTA, typically a sticky/floating action
 *
 * Sizes:
 * - default: Standard button height
 * - sm: Smaller button
 * - tall: Multi-line content (auto height)
 * - icon: Square icon button
 * - icon-round / icon-round-sm: Circular icon button (square + rounded-full).
 *   Pair with variant="primary" for a filled circular action (e.g. a chat send
 *   button). Unlike `icon`/`icon-sm` (rounded-sm), these stay circular.
 * - floating: Larger tap target for sticky/floating CTAs (pairs with variant=pill)
 *
 * Width:
 * - auto: Fit content (default)
 * - full: Full width
 *
 * Tone (`DButtonTone`):
 * - The ink, held at rest AND on hover. For the unfilled variants, `subtle`
 *   above all: it inherits its resting ink and turns `--foreground` on hover,
 *   and `DIconButton`'s `subtle` rests in `--muted-foreground`. A text
 *   affordance in the brand's ink, or a full-ink icon, wants one colour under
 *   the pointer too; restating it in `className` took the ink and its `hover:`
 *   twin at every site (seven in Kraftwerk, d-library#13).
 * - default: Unchanged — the variant's own ink
 * - foreground: `--foreground`
 * - primary: `--primary-text` where the theme declares it, else `--foreground`
 * - destructive: `--destructive-text` where the theme declares it, else
 *   `--destructive` — the red `DText variant="error"` sets a message in
 *
 * className:
 * - Merged after the variants, so a consumer override wins (twMerge drops the
 *   class it conflicts with) — except over `hideOn`, which is applied last so
 *   a display class cannot un-hide the button. For what a call site owns and the variants cannot know —
 *   a de-stacking margin, a radius or type size a consumer's design system
 *   sets, a row action that is a button in a row's own register. The defaults
 *   above are unchanged; nothing moves unless a class is passed.
 */

const dButtonVariants = cva(
  // Typography (text-sm, font-medium) lives in the size variants below —
  // not in an inner DText wrap, which would break the button's flex/gap
  // layout for icon+text composition (icon would render at native size and
  // wrap to a new line).
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:border-primary " +
    FOCUS_RING,
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-primary-foreground hover:bg-destructive/90 dark:bg-destructive/60",
        secondary:
          "border bg-background shadow-xs hover:bg-muted hover:text-foreground dark:bg-muted/30 dark:hover:bg-muted/50",
        subtle:
          "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        card:
          "border bg-surface shadow-sm hover:bg-muted/50 transition-colors text-left items-start",
        tile:
          "border bg-surface rounded-xl shadow-sm hover:bg-muted/50 transition-colors items-center",
        pill:
          "bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity",
      },
      size: {
        // text-sm baseline for default and tall; text-xs for sm size.
        default: "h-9 px-4 py-2 has-[>svg]:px-3 text-sm",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        tall: "h-auto py-3 px-4 text-sm",
        icon: "size-9 rounded-sm",
        "icon-sm": "size-8 rounded-sm",
        // Circular icon buttons — square footprint + rounded-full. The icon
        // sizes above force rounded-sm (overriding pill's rounded-full), so a
        // small *circular* icon button needs its own size.
        "icon-round": "size-9 rounded-full",
        "icon-round-sm": "size-8 rounded-full",
        floating: "h-auto px-5 py-2.5 text-base",
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

export type DButtonTone = "default" | "foreground" | "primary" | "destructive";

/**
 * Each ink twice — at rest and under `hover:` — so it beats the variant's own
 * `hover:text-*` in the merge (twMerge drops the one it conflicts with). The
 * `color:` label keeps an arbitrary `var()` in the colour group for Tailwind
 * and tailwind-merge alike.
 *
 * `primary` falls back to `--foreground`, not to `--primary`. `--primary-text`
 * is a theme's brand colour verified as type, which a theme declares when its
 * `--primary` is not: as text on the page, `--primary` measures 1.86:1 in Warm
 * Amber light and 2.94:1 in Studio light, under the 4.5:1 type needs (0.3.9).
 * `DSegmentedControl`'s `track` rule falls back the same way. `DText
 * variant="primary"` predates this and falls back to `--primary`.
 */
export const TONE_CLASSES: Record<DButtonTone, string> = {
  default: "",
  foreground: "text-foreground hover:text-foreground",
  primary:
    "text-[color:var(--primary-text,var(--foreground))] hover:text-[color:var(--primary-text,var(--foreground))]",
  destructive:
    "text-[color:var(--destructive-text,var(--destructive))] hover:text-[color:var(--destructive-text,var(--destructive))]",
};

export interface DButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof dButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  active?: boolean;
  hideOn?: "mobile" | "desktop";
  /**
   * The ink, at rest and on hover — see "Tone" above. Meant for `subtle` and
   * `secondary`; on a filled variant it replaces the ink that was chosen for
   * the fill. `className` is merged after it, so a call site can still win.
   */
  tone?: DButtonTone;
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
  tone = "default",
  children,
  disabled,
  className,
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
        TONE_CLASSES[tone],
        className,
        // After `className`: twMerge resolves display classes last-wins, so a
        // consumer's `flex` placed after `hidden` would drop it and show a
        // `hideOn="mobile"` button on a phone.
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
