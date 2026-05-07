import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

/**
 * DText - The single source of typographic styling in d-library.
 *
 * Role-based API: `as` selects a complete typographic preset (size + weight +
 * font-family + transform + tracking). Modifiers `italic` and `bold` apply on
 * top of the role. `variant` carries semantic color.
 *
 * Container components (DButton, DBadge, etc.) MUST NOT add their own text-*
 * or font-* classes — they wrap their text content in DText with the role
 * mapped from their variant.
 *
 * Default `as="inline"` renders an unstyled <span> that inherits typography
 * from its parent, keeping existing call sites byte-identical.
 */

const ELEMENT_BY_ROLE = {
  display: "span",   // huge focal text (card front word, hero focal)
  hero: "h2",        // hero card title — bigger than h1
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",         // paragraph
  inline: "span",    // default — inherits from parent, no styling
  caption: "span",   // small italic note (CardDisplay examples)
  label: "span",     // form label / default-size button text
  meta: "span",      // mono uppercase metadata
  cta: "span",       // italic display CTA (resume →)
  small: "span",     // sm-size button text, dense UI labels
} as const;

export type DTextAs = keyof typeof ELEMENT_BY_ROLE;

export const dTextVariants = cva("", {
  variants: {
    as: {
      // Each role is a complete typographic preset. No size / weight / font
      // overrides are exposed; if you need a different combo, add a role.
      display:
        "text-3xl font-medium font-display leading-tight",
      hero:
        "text-3xl md:text-5xl font-bold font-display leading-tight tracking-tight",
      h1:
        "text-2xl font-bold font-display tracking-tight",
      h2:
        "text-xl font-semibold font-display tracking-tight",
      h3:
        "text-lg font-medium",
      h4:
        "text-base font-semibold",
      body:
        "text-base",
      // `inline` keeps text-base so default <DText>foo</DText> calls (no `as`)
      // remain byte-identical with the previous size="default" rendering.
      inline:
        "text-base",
      caption:
        "text-sm italic",
      label:
        "text-sm font-medium",
      meta:
        "text-xs font-medium font-mono uppercase tracking-wide",
      cta:
        "text-base font-medium italic font-display",
      small:
        "text-xs font-medium",
    },
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      accent: "text-accent",
      background: "text-background",
      error: "text-destructive",
      warning: "text-warning",
      success: "text-success",
      // Deprecated alias — use `bold` modifier instead. Kept for back-compat.
      bold: "text-foreground font-medium",
    },
  },
  defaultVariants: {
    as: "inline",
    variant: "default",
  },
});

type DTextVariant = NonNullable<VariantProps<typeof dTextVariants>["variant"]>;

export interface DTextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className"> {
  as?: DTextAs;
  variant?: DTextVariant;
  italic?: boolean;
  bold?: boolean;
}

export function DText({
  as = "inline",
  variant,
  italic,
  bold,
  ...props
}: DTextProps) {
  const Tag = ELEMENT_BY_ROLE[as] as React.ElementType;
  return (
    <Tag
      className={cn(
        dTextVariants({ as, variant }),
        // Modifiers stack on top of role styling. `caption` and `cta` already
        // include italic — applying italic again is a no-op.
        italic && "italic",
        bold && "font-semibold",
      )}
      {...props}
    />
  );
}
