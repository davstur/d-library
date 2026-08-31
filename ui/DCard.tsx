import * as React from "react";
import { cn, FOCUS_RING } from "../utils";
import { Card } from "../primitives/card";

// DCard - Constrained card with minimal variants
export interface DCardSwipeProps {
  style?: React.CSSProperties;
  interactive?: boolean;
  gestureCapture?: boolean;
  highlighted?: boolean;
  handlers?: React.DOMAttributes<HTMLDivElement>;
}

const toneClasses = {
  default: "",
  primary: "border-primary/30 bg-primary/15",
  warning: "border-warning/30 bg-warning/15",
  success: "border-success/30 bg-success/15",
  destructive: "border-destructive/30 bg-destructive/15",
} as const;

interface DCardProps {
  variant?: "default" | "error";
  tone?: keyof typeof toneClasses;
  size?: "auto" | "form";
  padding?: "compact" | "default";
  swipe?: DCardSwipeProps;
  onClick?: () => void;
  asChild?: boolean;
  /**
   * Marks the card as a control for styling seams that cannot ask React.
   *
   * A card is interactive in three different spellings — `onClick`,
   * `asChild` around a real `<a>`/`<button>`/`<Link>`, and
   * `swipe.interactive` — and only the first two of those leave anything in
   * the DOM a stylesheet can match. `role="button"` is emitted for `onClick`
   * alone, so a consumer trying to style "cards that are controls" ends up
   * selecting *which spelling the author happened to use*.
   *
   * The first two cases below set `data-interactive` automatically. This prop
   * is the opt-in for `asChild`, where the library cannot know whether the
   * child it is given is interactive. Additive, never subtractive: passing
   * `false` does not un-mark a card that has an `onClick`.
   */
  interactive?: boolean;
  role?: React.AriaRole;
  children: React.ReactNode;
}

export function DCard({
  variant = "default",
  tone = "default",
  size = "auto",
  padding = "default",
  swipe,
  onClick,
  asChild,
  interactive,
  role,
  children,
}: DCardProps) {
  // When `onClick` is set without `asChild`, elevate the div to button
  // semantics so the card is keyboard-accessible. Consumers wanting a real
  // <button>/<a>/<Link> should use asChild and pass it themselves.
  const isTappable = Boolean(onClick) && !asChild;
  // What a stylesheet can key on. `isTappable` covers `onClick`;
  // `swipe.interactive` already paints a pointer cursor and so is a control by
  // the library's own reckoning; `interactive` is the caller's opt-in for
  // `asChild`. Emitted as a bare attribute so the selector is
  // `[data-interactive]`, not `[data-interactive="true"]`.
  const isInteractive =
    isTappable || Boolean(swipe?.interactive) || Boolean(interactive);
  const handleKeyDown = isTappable
    ? (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick?.();
        }
      }
    : undefined;
  return (
    <Card
      asChild={asChild}
      data-interactive={isInteractive ? "" : undefined}
      role={role ?? (isTappable ? "button" : undefined)}
      tabIndex={isTappable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        variant === "error" && "border-destructive",
        toneClasses[tone],
        size === "form" && "w-full max-w-md",
        padding === "compact" && "py-3 gap-3",
        swipe && "overflow-hidden relative",
        swipe?.interactive && "cursor-pointer hover:bg-muted/50",
        swipe?.gestureCapture && "touch-none",
        swipe?.highlighted && "bg-primary/10",
        isTappable &&
          "cursor-pointer transition-colors hover:bg-muted/50 text-left focus-visible:border-primary " +
            FOCUS_RING,
      )}
      style={swipe?.style}
      onClick={onClick}
      {...(swipe?.handlers ?? {})}
    >
      {children}
    </Card>
  );
}

// DCardContent - Constrained content with built-in spacing
interface DCardContentProps {
  padding?: "compact" | "default" | "spacious";
  children: React.ReactNode;
}

export function DCardContent({
  padding = "default",
  children,
}: DCardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 space-y-4",
        padding === "compact" && "py-2",
        padding === "default" && "py-4",
        padding === "spacious" && "py-6"
      )}
    >
      {children}
    </div>
  );
}
