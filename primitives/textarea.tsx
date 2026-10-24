import * as React from "react"

import { cn, FOCUS_RING } from "../utils"
import { INVALID_BORDER_ARIA } from "./input"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // The invalid border and its focus behaviour are `Input`'s, for the same
        // reasons — see `INVALID_BORDER_ARIA`.
        "border placeholder:text-muted-foreground focus-visible:border-primary dark:bg-muted/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-surface px-3 py-2 text-base shadow-xs transition-[color,box-shadow] " +
        FOCUS_RING +
        " disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        INVALID_BORDER_ARIA,
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
