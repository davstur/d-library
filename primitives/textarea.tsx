import * as React from "react"

import { cn, FOCUS_RING } from "../utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border placeholder:text-muted-foreground focus-visible:border-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-muted/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-surface px-3 py-2 text-base shadow-xs transition-[color,box-shadow] " +
        FOCUS_RING +
        " disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
