import { cn } from "../utils";

interface DSkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  width?: string;
}

const variantClasses = {
  text: "rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-lg",
};

const sizeClasses = {
  xs: "h-3",
  sm: "h-4",
  md: "h-5",
  lg: "h-6",
  xl: "h-8",
};

export function DSkeleton({
  variant = "text",
  size = "md",
  width = "w-full",
}: DSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variantClasses[variant],
        sizeClasses[size],
        width,
      )}
    />
  );
}

interface DSkeletonCardProps {
  lines?: number;
  compact?: boolean;
}

export function DSkeletonCard({ lines = 2, compact = false }: DSkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card",
        compact ? "py-3" : "py-4",
      )}
    >
      <div className={cn("px-6 space-y-3", compact ? "py-2" : "py-4")}>
        <DSkeleton size="lg" width="w-2/5" />
        {Array.from({ length: lines }).map((_, i) => (
          <DSkeleton
            key={i}
            size="sm"
            width={i === lines - 1 ? "w-1/3" : "w-3/4"}
          />
        ))}
      </div>
    </div>
  );
}
