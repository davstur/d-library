import * as React from "react";
import { cn } from "../utils";
import {
  Input,
  inputContainerClasses,
  PLACEHOLDER_TONE_CLASSES,
  type InputPlaceholderTone,
} from "../primitives/input";

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

export function DInput({ error, leadingIcon, trailingIcon, placeholderTone, ...props }: DInputProps) {
  // Tone is resolved here (not deferred to Input's default) so the slotted
  // icon variant — which renders a bare `<input>` — picks up the same
  // class as the bare-Input path.
  const resolvedTone: InputPlaceholderTone = placeholderTone ?? "default";

  if (!leadingIcon && !trailingIcon) {
    return (
      <Input
        className={cn(error && "border-destructive")}
        aria-invalid={error}
        placeholderTone={resolvedTone}
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
        className={cn(
          "flex-1 min-w-0 bg-transparent text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          PLACEHOLDER_TONE_CLASSES[resolvedTone],
        )}
      />
      {trailingIcon}
    </div>
  );
}
