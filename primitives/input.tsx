import * as React from "react"

import { cn } from "../utils"

/**
 * Shared border/background/shadow classes for input-like containers.
 * Used by the bare `Input` and by `DInput`'s slotted icon variant so theme
 * tweaks stay in sync across both paths.
 */
export const inputContainerClasses =
  "h-9 w-full min-w-0 rounded-md border bg-surface shadow-xs transition-[color,box-shadow] dark:bg-muted/30"

/**
 * Placeholder tone variants. `default` is the standard muted-foreground
 * tone used by most forms; `subtle` fades that tone to 60% alpha for
 * surfaces where a quieter affordance reads better (search inputs on
 * a card-rich list view, secondary filters, etc.).
 *
 * Implemented as a Tailwind alpha modifier on the same token so the
 * placeholder still tracks theme changes — only the visual weight shifts.
 */
export type InputPlaceholderTone = "default" | "subtle"

export const PLACEHOLDER_TONE_CLASSES: Record<InputPlaceholderTone, string> = {
  default: "placeholder:text-muted-foreground",
  subtle: "placeholder:text-muted-foreground/60",
}

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  /** Visual weight of the placeholder text. See `InputPlaceholderTone`. */
  placeholderTone?: InputPlaceholderTone
}

function Input({ className, type, placeholderTone = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputContainerClasses,
        "file:text-foreground selection:bg-primary selection:text-primary-foreground px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        PLACEHOLDER_TONE_CLASSES[placeholderTone],
        "focus-visible:border-primary",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
