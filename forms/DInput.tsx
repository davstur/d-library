import * as React from "react";
import { cn } from "../utils";
import {
  Input,
  inputContainerClasses,
  INPUT_SIZE_CLASSES,
  INVALID_BORDER,
  PLACEHOLDER_TONE_CLASSES,
  type InputPlaceholderTone,
  type InputSize,
} from "../primitives/input";

export interface DInputProps extends Omit<React.ComponentProps<typeof Input>, "className" | "ref"> {
  error?: boolean;
  /**
   * Decorative or interactive node rendered before the input. Mark
   * decorative icons with `aria-hidden="true"`; pass an interactive
   * `<button aria-label="…">` for affordances like clear / reveal.
   */
  leadingIcon?: React.ReactNode;
  /** See `leadingIcon` for ARIA guidance. */
  trailingIcon?: React.ReactNode;
  /**
   * Lands on the `<input>` itself in BOTH shapes — bare, and slotted with a
   * leading/trailing icon, where the input sits inside a container `div`.
   *
   * That is the whole point of a ref here: a consumer that reveals a field (tap
   * "Change", a form appears) has to move focus into it, and focusing the
   * container would focus nothing. `autoFocus` passes through the same way, and is
   * the simpler tool when the field mounts at the moment it is revealed.
   *
   * It is a plain prop, React 19 style, like every ref in this library — a
   * `DButton` under a Radix `asChild` trigger relies on the same thing. It already
   * reached the input before this was written down, by way of the prop spread;
   * Kraftwerk's issue concluded it did not exist, because nothing said so.
   */
  ref?: React.Ref<HTMLInputElement>;
  /**
   * Classes for the VISIBLE FIELD BOX, merged last so they win: the `<input>`
   * when bare, the container when slotted (the box a person sees is the
   * container there, and a width on the inner input would fight it).
   *
   * For layout and per-call-site overrides — a `w-[6ch]` numeric cell, a margin
   * that de-stacks the field from its row. Not for the invalid state, which is
   * `error`, or for height, which is `size`.
   */
  className?: string;
}

export function DInput({
  error,
  leadingIcon,
  trailingIcon,
  placeholderTone,
  size = "default",
  className,
  ref,
  ...props
}: DInputProps) {
  // Tone is resolved here (not deferred to Input's default) so the slotted
  // icon variant — which renders a bare `<input>` — picks up the same
  // class as the bare-Input path.
  const resolvedTone: InputPlaceholderTone = placeholderTone ?? "default";

  if (!leadingIcon && !trailingIcon) {
    return (
      <Input
        ref={ref}
        className={cn(error && INVALID_BORDER, className)}
        aria-invalid={error}
        placeholderTone={resolvedTone}
        size={size}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        inputContainerClasses,
        // After the container classes so twMerge resolves the height this way.
        INPUT_SIZE_CLASSES[size],
        "flex items-center gap-2 px-3",
        "focus-within:border-primary focus-within:ring-primary/50 focus-within:ring-[3px]",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        // The red holds while the field is focused. `focus-within:border-primary`
        // above used to replace it, so an invalid field was outlined in the
        // affirmative colour at exactly the moment it was being read — and on a
        // refusal that clears and refocuses the field, that was its DEFAULT
        // state. Measured on Kraftwerk's current-password field: `#d3403a` at
        // rest, `#f2c200` (volt) focused. The variant has to be spelled out
        // because the container is never `aria-invalid` itself; twMerge drops
        // the `focus-within:border-primary` it conflicts with.
        error && [INVALID_BORDER, "focus-within:border-[color:var(--destructive-text,var(--destructive))]"],
        className,
      )}
    >
      {leadingIcon}
      <input
        {...props}
        ref={ref}
        aria-invalid={error}
        className={cn(
          // `h-full` so the text field fills the container rather than sitting
          // at its own intrinsic height: the tappable area a person aims at is
          // the box they can see, and a short input inside a tall box means the
          // top and bottom of that box do not focus it.
          "h-full flex-1 min-w-0 bg-transparent text-base outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          PLACEHOLDER_TONE_CLASSES[resolvedTone],
        )}
      />
      {trailingIcon}
    </div>
  );
}
