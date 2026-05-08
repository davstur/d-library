import * as React from "react";
import { cn } from "../utils";
import { Input, inputContainerClasses } from "../primitives/input";

interface DInputProps extends Omit<React.ComponentProps<typeof Input>, "className"> {
  error?: boolean;
  /**
   * Decorative or interactive node rendered before the input. Mark
   * decorative icons with `aria-hidden="true"`; pass an interactive
   * `<button aria-label="…">` for affordances like clear / reveal.
   */
  leadingIcon?: React.ReactNode;
  /** See `leadingIcon` for ARIA guidance. */
  trailingIcon?: React.ReactNode;
}

export function DInput({ error, leadingIcon, trailingIcon, ...props }: DInputProps) {
  if (!leadingIcon && !trailingIcon) {
    return (
      <Input
        className={cn(error && "border-destructive")}
        aria-invalid={error}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        inputContainerClasses,
        "flex items-center gap-2 px-3",
        "focus-within:border-primary focus-within:ring-primary/50 focus-within:ring-[3px]",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        error && "border-destructive",
      )}
    >
      {leadingIcon}
      <input
        {...props}
        aria-invalid={error}
        className="flex-1 min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      {trailingIcon}
    </div>
  );
}
