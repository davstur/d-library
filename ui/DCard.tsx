import * as React from "react";
import { cn } from "../utils";
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
  role,
  children,
}: DCardProps) {
  // When `onClick` is set without `asChild`, elevate the div to button
  // semantics so the card is keyboard-accessible. Consumers wanting a real
  // <button>/<a>/<Link> should use asChild and pass it themselves.
  const isTappable = Boolean(onClick) && !asChild;
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
          "cursor-pointer transition-colors hover:bg-muted/50 text-left outline-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]",
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
