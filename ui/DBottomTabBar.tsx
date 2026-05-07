"use client";

import * as React from "react";
import { cn } from "../utils";
import { DText } from "./DText";

/**
 * DBottomTabBar — fixed-bottom mobile navigation primitive.
 *
 * Shell-only: contains no app-aware logic (route detection, active-page
 * inference, etc.). Consumers compose `DBottomTabItem` children and pass
 * `active` to mark the current page.
 *
 * Hard requirements (locked in iter-2/iter-3 review):
 * - Minimum 44pt touch target on each item (Apple HIG floor)
 * - Owns `safe-area-inset-bottom` padding internally — consumers must NOT
 *   add their own bottom padding
 * - Renders as `<nav aria-label>` with `aria-current="page"` on the active
 *   item — NOT `role="tablist"` / `role="tab"` (this is link-based
 *   navigation, not the WAI-ARIA tabs widget pattern)
 * - Width is `100%`; the consumer page chooses max-width via a wrapper
 *   container (e.g., a 390px frame for mobile-only layouts).
 */

interface DBottomTabBarProps {
  /** Accessibility label for the nav landmark. Required for screen readers. */
  ariaLabel: string;
  /** Tab items — typically `<DBottomTabItem>` instances. */
  children: React.ReactNode;
  /** Number of equal-width columns; defaults to "auto" (CSS auto-distributes). */
  columns?: number | "auto";
}

export function DBottomTabBar({
  ariaLabel,
  children,
  columns = "auto",
}: DBottomTabBarProps) {
  const gridCols =
    columns === "auto"
      ? undefined
      : `repeat(${columns}, minmax(0, 1fr))`;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        // Fixed positioning — sits above page content. Consumer page is
        // responsible for adding bottom padding to its scroll container so
        // content isn't hidden behind the bar; the bar itself owns
        // safe-area-inset-bottom.
        "fixed bottom-0 left-0 right-0 z-40",
        // Backdrop blur over the page background.
        "bg-background/95 backdrop-blur-md",
        // Hairline divider on top.
        "border-t",
      )}
      style={{
        // safe-area-inset-bottom owned by the primitive. iOS notch/home
        // indicator: bar gets padding-bottom of max(0.5rem, safe-area).
        paddingTop: "0.5rem",
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
      }}
    >
      <div
        className={cn(
          "grid mx-auto",
          columns === "auto" && "grid-flow-col auto-cols-fr",
        )}
        style={gridCols ? { gridTemplateColumns: gridCols } : undefined}
      >
        {children}
      </div>
    </nav>
  );
}

interface DBottomTabItemProps {
  /** Icon element — Lucide or custom. Renders at 18px. */
  icon: React.ReactNode;
  /** Short label below the icon. Wrapped in DText with `meta` role. */
  label: string;
  /** Marks this item as the current page. Adds active styling + aria-current. */
  active?: boolean;
  /**
   * Render as a button with this onClick handler. Mutually exclusive with
   * the wrapped-in-Link pattern: if you wrap DBottomTabItem in a routing
   * primitive (Next.js Link, react-router Link, plain <a>), omit onClick.
   */
  onClick?: () => void;
  /** Optional badge dot (e.g., pending notifications). */
  badge?: boolean;
}

/**
 * DBottomTabItem — single tab item. Renders a `<button>` if `onClick` is
 * provided, otherwise a `<span>` (to be wrapped by a routing primitive
 * like Next.js Link).
 *
 * Usage (Next.js):
 *   <Link href="/decks">
 *     <DBottomTabItem icon={<Layers />} label="Decks" active />
 *   </Link>
 *
 * Usage (button):
 *   <DBottomTabItem icon={<X />} label="Close" onClick={handleClose} />
 */
export function DBottomTabItem({
  icon,
  label,
  active = false,
  onClick,
  badge = false,
}: DBottomTabItemProps) {
  const Comp = onClick ? "button" : "span";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        // 44pt touch target floor.
        "relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-1.5",
        // Layout reset for button case.
        onClick && "appearance-none bg-transparent border-none p-0 cursor-pointer",
        // Active vs inactive coloring at the container — DText below
        // inherits the color via CSS cascade.
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        "transition-colors",
      )}
    >
      {/* Active indicator bar — absolute-positioned at top of the item */}
      {active && (
        <span
          aria-hidden
          className="absolute top-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-b bg-foreground"
        />
      )}
      <span className="relative inline-flex">
        {icon}
        {badge && (
          <span
            aria-hidden
            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-warning"
          />
        )}
      </span>
      <DText as="meta">{label}</DText>
    </Comp>
  );
}
