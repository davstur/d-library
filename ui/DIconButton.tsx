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
 *
 * `active` means "this is the CURRENT PAGE", nav-style — not a generic toggle. It
 * renders an indicator bar, so a toggle wanting a pressed look should carry its own
 * visual state and `aria-pressed` rather than reach for `active`.
 *
 * The bar exists because the old active treatment was a `bg-muted` fill, and that
 * fill measures **1.13:1** against the page background in Studio (1.06-1.29:1 across
 * all eight themes) where WCAG 1.4.11 wants 3:1 for a state indication. Two
 * alternatives were measured and rejected: `--border` (1.40:1) and — the intuitive
 * one — `--primary`, which is only 2.94:1 in Studio and 1.86:1 in Warm Amber. The bar
 * uses `--foreground`, the BODY-TEXT token, which is a high-contrast pair with
 * `--background` in every theme by construction rather than by measurement (worst
 * case 13.14:1). Don't "simplify" it to the brand colour; that is the rejected option.
 *
 * `bg-muted` is deliberately NOT painted on active any more: `subtle` already hovers
 * to `bg-muted` + `text-foreground`, so keeping it made a hovered item and the
 * current item the same picture apart from the bar — and iOS Safari retains :hover on
 * the last-tapped element, so two identical chips could sit side by side. Hover owns
 * the fill; active owns the bar.
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
    // Anchors the active indicator below. Harmless when inactive, and it must sit
    // on the same element the bar is positioned against — which in the asChild
    // branch is the consumer's own element, reached through Slot's class merge.
    "relative",
    hideOn && hideOnClasses[hideOn],
  );

  // Rendered only when active, rather than an always-present span that changes
  // colour: consumers assert on this data-slot's PRESENCE to check that a page with
  // no current section shows no indicator, and an unconditional span would make that
  // false in the DOM while still passing a colour assertion. Mirrors DBottomTabItem.
  const indicator = active ? (
    <span
      aria-hidden
      data-slot="icon-button-indicator"
      className={cn(
        // Absolute so it can never affect layout: consumers pin the row's height
        // (Tandemic's --nav-height is a mirror of a height that emerges from this
        // button's size-9), and an in-flow indicator would silently break that.
        "absolute bottom-0 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-t",
        // The bottom edge, not DBottomTabItem's top-0 — that component is fixed to
        // the bottom of the viewport, so its top edge is the one facing content. In
        // a top bar the mirror is a vertical flip. It also keeps the bar clear of a
        // badge in the icon's top-right corner.
        "bg-foreground",
        // forced-colors maps an author background-color onto the forced BACKGROUND,
        // so bg-foreground alone disappears in Windows High Contrast Mode — taking
        // the only on-screen current-page signal with it, for the users most likely
        // to be relying on it.
        "forced-colors:bg-[CanvasText]",
      )}
    />
  ) : null;

  let button: React.ReactElement;
  if (asChild && children) {
    const child = React.Children.only(children);
    // The indicator becomes a second child of the CLONED CHILD, so Slot below still
    // receives exactly one child. Passing it as a second child of Slot instead
    // throws: Slot calls React.Children.only() on more than one child.
    const childWithIcon = React.cloneElement(child, {}, icon, indicator);
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
        {indicator}
      </button>
    );
  }

  if (tooltip) {
    return <DTooltip content={tooltip}>{button}</DTooltip>;
  }
  return button;
}
