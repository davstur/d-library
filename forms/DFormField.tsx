import * as React from "react";
import { DText } from "../ui/DText";

interface DFormFieldProps {
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  /**
   * Visual treatment for the label.
   *
   * - `default` (the existing behavior): renders the label via
   *   `<DText as="label">` — text-sm, font-medium, sentence case.
   *   Use for typical form fields.
   * - `meta`: renders the label via `<DText as="meta" variant="muted">`
   *   — mono uppercase tracking-wider. Use for dense Studio surfaces
   *   where each field gets a kicker-style overline matching adjacent
   *   section kickers (e.g. an accordion full of typographically
   *   loaded forms).
   */
  labelTone?: "default" | "meta";
  children: React.ReactNode;
}

export function DFormField({
  label,
  htmlFor,
  description,
  error,
  required,
  labelTone = "default",
  children,
}: DFormFieldProps) {
  const descriptionId = description && htmlFor ? `${htmlFor}-description` : undefined;
  // When the field has an htmlFor, auto-wire aria-describedby on the matching
  // child input so screen readers associate the description with the field.
  // Children without a matching id are left untouched.
  const decoratedChildren = descriptionId
    ? React.Children.map(children, (child) => {
        if (!React.isValidElement<{ id?: string; "aria-describedby"?: string }>(child)) {
          return child;
        }
        if (child.props.id !== htmlFor) {
          return child;
        }
        return React.cloneElement(child, { "aria-describedby": descriptionId });
      })
    : children;

  return (
    <div className="space-y-2">
      {label && (
        // <label> for accessibility, DText controls typography.
        <label htmlFor={htmlFor} className="block">
          {labelTone === "meta" ? (
            <DText as="meta" variant="muted">{label}</DText>
          ) : (
            <DText as="label">{label}</DText>
          )}
          {required && (
            <>
              {" "}
              <DText variant="error">*</DText>
            </>
          )}
        </label>
      )}
      {decoratedChildren}
      {description && (
        <DText id={descriptionId} as="small" variant="muted">
          {description}
        </DText>
      )}
      {error && <DText as="caption" variant="error">{error}</DText>}
    </div>
  );
}
