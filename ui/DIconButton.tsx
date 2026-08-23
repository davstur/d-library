"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { DTooltip } from "./DTooltip";
import { dButtonVariants } from "./DButton";
import { cn } from "../utils";

/**
 * DIconButton - Icon-only button with tooltip, active state, and enforced aria-label.
 *
 * Standardizes the `DButton variant="subtle" size="icon"` pattern across app usage.
 * Default color is `text-muted-foreground`; `active` switches to `text-primary`
 * for nav-style highlighting.
 *
 * `active` also sets `aria-current="page"`. Before that it was a purely visual
 * state (`data-active` + `bg-muted`), so a screen-reader user navigating an icon
 * nav had no way to tell which section they were in — every consumer marking an
 * item active wants the semantic too, so it is derived rather than opt-in. Pass
 * `aria-current` explicitly to override (including `undefined` to suppress it,
 * e.g. for a toggle that wants `aria-pressed` instead).
 *
 * Unlike `DBottomTabItem` — which sets `aria-current` only in its `<button>`
 * branch, because its other branch is a `<span>` the consumer wraps in a
 * routing primitive — both branches here land on an interactive element: a real
 * `<button>`, or (with `asChild`) the consumer's own `<Link>` via `Slot`. So it
 * is safe unconditionally.
 *
 * asChild: pass the target element (e.g. a Link) as the single child; the icon
 * is injected as that element's child, and the button classes apply to it.
 *
 * Use as a DMenu/DropdownMenu trigger via asChild on the trigger by omitting
 * `tooltip` — nested Radix asChild layers (tooltip + menu trigger) don't
 * compose cleanly on a single element.
 */

export interface DIconButtonProps
  extends Omit<React.ComponentProps<"button">, "className" | "children"> {
  icon: React.ReactNode;
  "aria-label": string;
  tooltip?: string;
  active?: boolean;
  asChild?: boolean;
  hideOn?: "mobile" | "desktop";
  children?: React.ReactElement;
}

const hideOnClasses = {
  mobile: "hidden sm:inline-flex",
  desktop: "sm:hidden",
};

export function DIconButton({
  icon,
  tooltip,
  active = false,
  asChild = false,
  hideOn,
  children,
  ...rest
}: DIconButtonProps) {
  const className = cn(
    dButtonVariants({ variant: "subtle", size: "icon" }),
    "text-primary hover:text-primary",
    active && "bg-muted",
    hideOn && hideOnClasses[hideOn],
  );

  let button: React.ReactElement;
  if (asChild && children) {
    const child = React.Children.only(children);
    const childWithIcon = React.cloneElement(child, {}, icon);
    button = (
      <Slot
        data-slot="icon-button"
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        className={className}
        {...rest}
      >
        {childWithIcon}
      </Slot>
    );
  } else {
    button = (
      <button
        data-slot="icon-button"
        data-active={active || undefined}
        aria-current={active ? "page" : undefined}
        className={className}
        {...rest}
      >
        {icon}
      </button>
    );
  }

  if (tooltip) {
    return <DTooltip content={tooltip}>{button}</DTooltip>;
  }
  return button;
}
