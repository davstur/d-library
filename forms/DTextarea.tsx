import { cn } from "../utils";
import { Textarea } from "../primitives/textarea";
import { INVALID_BORDER } from "../primitives/input";

export interface DTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "className" | "ref"> {
  error?: boolean;
  size?: "default" | "tall" | "taller";
  /** Lands on the `<textarea>`. A plain prop, React 19 style — see `DInputProps.ref`. */
  ref?: React.Ref<HTMLTextAreaElement>;
  /**
   * Merged last, so a consumer override wins.
   *
   * The wrapper this replaces is `[&_textarea]:resize-none` on a parent `div` —
   * an arbitrary variant reaching into this component's markup, which keeps
   * working only for as long as the internals stay one bare `<textarea>`. A chat
   * box wants `resize-none` (a drag grabber in the corner of a phone composer),
   * a one-line rest height (`min-h-11` over `min-h-16`) and room for an overlaid
   * send button (`pr-14`); a fixed-height note wants `field-sizing-fixed`.
   */
  className?: string;
}

export function DTextarea({ error, size = "default", className, ref, ...props }: DTextareaProps) {
  return (
    <Textarea
      ref={ref}
      className={cn(
        error && INVALID_BORDER,
        size === "tall" && "min-h-[100px]",
        size === "taller" && "min-h-[150px]",
        className,
      )}
      {...props}
      // A consumer's `aria-invalid` wins over `error` — Kraftwerk's composer
      // passes one — but an UNDEFINED one does not erase it, as DInput.
      aria-invalid={props["aria-invalid"] ?? error}
    />
  );
}
