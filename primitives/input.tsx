import * as React from "react"

import { cn, FOCUS_RING } from "../utils"

/**
 * Shared border/background/shadow classes for input-like containers.
 * Used by the bare `Input` and by `DInput`'s slotted icon variant so theme
 * tweaks stay in sync across both paths.
 */
export const inputContainerClasses =
  "h-9 w-full min-w-0 rounded-md border bg-surface shadow-xs transition-[color,box-shadow] dark:bg-muted/30"

/**
 * Control height.
 *
 * `default` (h-9, 36px) is the desktop-density baseline every existing consumer
 * already renders — it stays the default so nothing shifts under anyone.
 *
 * `tall` (h-11, 44px) is the smallest comfortable touch target on a phone.
 * Apple's HIG and WCAG 2.5.5 independently land on 44px, and it is not a
 * cosmetic difference: a 36px field is one a thumb misses, and the miss lands on
 * whatever is behind it. Reach for `tall` on any form a thumb will drive.
 *
 * It also matters for `DInput`'s slotted variant specifically. A reveal or clear
 * button in `trailingIcon` has to be 44px to be tappable itself, so inside a
 * 36px container it overflows the box it is supposed to sit in — the two
 * constraints only reconcile at `tall`.
 *
 * This is what the omitted native `size` attribute buys: the HTML one is a
 * character-count almost nobody sets, and the name is worth more as the variant,
 * matching `DButton`'s `size` vocabulary.
 */
export type InputSize = "default" | "tall"

export const INPUT_SIZE_CLASSES: Record<InputSize, string> = {
  default: "h-9",
  tall: "h-11",
}

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
  /** Control height. See `InputSize`. */
  size?: InputSize
}

function Input({ className, type, placeholderTone = "default", size = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        inputContainerClasses,
        // After the container classes, so twMerge resolves the height conflict in
        // this direction rather than the other one.
        INPUT_SIZE_CLASSES[size],
        "file:text-foreground selection:bg-primary selection:text-primary-foreground px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        PLACEHOLDER_TONE_CLASSES[placeholderTone],
        FOCUS_RING,
        "focus-visible:border-primary",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
