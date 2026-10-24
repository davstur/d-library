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

/**
 * The invalid border, for a field marked `aria-invalid`. `INVALID_BORDER` is the
 * same colour without the variant, for the `error` props of `DInput` and
 * `DTextarea` and for `DInput`'s slotted container, which is never
 * `aria-invalid` itself.
 *
 * **One red per error.** It reads `--destructive-text`, the red `DText
 * variant="error"` already sets the message in, falling back to `--destructive`.
 * The border and the message beneath it used to be two different reds in any
 * theme that declares the text token — Kraftwerk's measured `#d3403a` against
 * `#dd6a66`, which read as two severities. The pairing goes to the TEXT value
 * and not the other way round, because only the text value is contrast-checked
 * for type (d-library#7 item 2), and a value that clears 4.5:1 as type clears the
 * 3:1 a border owes with room to spare. A theme that does not declare
 * `--destructive-text` resolves to `--destructive` exactly as before.
 *
 * **It survives focus, and so does focus.** There is deliberately no
 * `aria-invalid:ring-*` here any more. The old `ring-destructive/20` (and `/40`
 * in dark) did nothing at rest — no ring has width until focus — and on focus it
 * REPLACED `FOCUS_RING`'s colour, because `aria-*` variants sort after
 * `focus-visible:`. An invalid field's focus ring measured 1.22–2.14:1 against
 * the page in every one of the sixteen theme/mode combinations, so the field a
 * person is correcting was the one with the least visible focus. Now the border
 * carries "invalid" and the ring carries "focused", both at once. The border
 * wins over `focus-visible:border-primary` by the same variant order.
 */
export const INVALID_BORDER_ARIA =
  "aria-invalid:border-[color:var(--destructive-text,var(--destructive))]"
export const INVALID_BORDER =
  "border-[color:var(--destructive-text,var(--destructive))]"
/** `INVALID_BORDER` for `DInput`'s slotted container while its field is focused,
 * so it beats the container's focused `border-primary` (twMerge drops that one).
 * Spelled out as a literal here, beside the other two, so every spelling of the
 * invalid red lives in one place. */
export const INVALID_BORDER_FOCUSED_BOX =
  "focus-within:border-[color:var(--destructive-text,var(--destructive))]"

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
        INVALID_BORDER_ARIA,
        className
      )}
      {...props}
    />
  )
}

export { Input }
