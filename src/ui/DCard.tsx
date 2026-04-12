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

interface DCardProps {
  variant?: "default" | "error";
  size?: "auto" | "form";
  padding?: "compact" | "default";
  swipe?: DCardSwipeProps;
  onClick?: () => void;
  role?: React.AriaRole;
  children: React.ReactNode;
}

export function DCard({
  variant = "default",
  size = "auto",
  padding = "default",
  swipe,
  onClick,
  role,
  children,
}: DCardProps) {
  return (
    <Card
      role={role}
      className={cn(
        variant === "error" && "border-destructive",
        size === "form" && "w-full max-w-md",
        padding === "compact" && "py-3 gap-3",
        swipe && "overflow-hidden relative",
        swipe?.interactive && "cursor-pointer hover:bg-muted/50",
        swipe?.gestureCapture && "touch-none",
        swipe?.highlighted && "bg-primary/10"
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

