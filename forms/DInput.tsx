import * as React from "react";
import { cn, INPUT_BOX_FOCUS_RING } from "../utils";
import {
  Input,
  inputContainerClasses,
  INPUT_SIZE_CLASSES,
  INVALID_BORDER,
  INVALID_BORDER_FOCUSED_BOX,
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
   *
   * An interactive control here owns its focus indicator: the field's box rings
   * only while the text input has focus. A `DButton` brings `FOCUS_RING` with
   * it; a raw `<button>` needs `FOCUS_RING` in its classes, or it gets the
   * browser's outline.
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

  // Whether the field is invalid, decided ONCE for both shapes.
  //
  // The attribute: an `aria-invalid` in `props` wins over `error` — DFormField
  // clones one onto a field with an error, and a consumer may pass one — but an
  // UNDEFINED one does not erase it: `aria-invalid={serverError || undefined}`
  // next to `error` used to remove the attribute from a field that was painted
  // red. The red: `error`, or an `aria-invalid` of `true`.
  //
  // The slotted shape used to set `aria-invalid={error}` AFTER spreading
  // `props`, so with no `error` prop it overwrote DFormField's attribute with
  // `undefined`: the field lost the attribute and stayed its resting colour,
  // while the same field without an icon was marked and red.
  const ariaInvalid = props["aria-invalid"] ?? error;
  const invalid = Boolean(error) || ariaInvalid === true || ariaInvalid === "true";

  if (!leadingIcon && !trailingIcon) {
    return (
      <Input
        ref={ref}
        className={cn(invalid && INVALID_BORDER, className)}
        placeholderTone={resolvedTone}
        size={size}
        {...props}
        aria-invalid={ariaInvalid}
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
        // The box shows focus while ITS input has it, as a bare `Input` does —
        // not while a control in the slot does, which draws its own. Keyed on
        // `data-slot="input-control"` rather than any `>input`, so an input a
        // consumer puts in a slot does not ring the box either. See
        // `INPUT_BOX_FOCUS_RING`.
        "has-[>[data-slot=input-control]:focus-visible]:border-primary",
        INPUT_BOX_FOCUS_RING,
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        // The red holds while the field is focused. The focused border above
        // (`focus-within:border-primary` until 0.3.10) used to replace it, so
        // an invalid field was outlined in the affirmative colour at exactly the
        // moment it was being read — and on a refusal that clears and refocuses
        // the field, that was its DEFAULT state. Measured on Kraftwerk's
        // current-password field: `#d3403a` at rest, `#f2c200` (volt) focused.
        // The focused variant is needed because the container is never
        // `aria-invalid` itself; twMerge drops the focused `border-primary` it
        // conflicts with.
        invalid && [INVALID_BORDER, INVALID_BORDER_FOCUSED_BOX],
        className,
      )}
    >
      {leadingIcon}
      <input
        {...props}
        ref={ref}
        aria-invalid={ariaInvalid}
        // What the box's focus styles key on — see above.
        data-slot="input-control"
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
