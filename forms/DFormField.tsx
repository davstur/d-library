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
  const errorId = error && htmlFor ? `${htmlFor}-error` : undefined;
  // Error first: `aria-describedby` is read in the order given, and what just went
  // wrong matters more to someone correcting a field than the standing hint does.
  const describedBy = [errorId, descriptionId].filter(Boolean).join(" ") || undefined;

  // When the field has an htmlFor, auto-wire aria-describedby on the matching
  // child input so screen readers associate the description with the field.
  // Children without a matching id are left untouched.
  //
  // The ERROR is wired the same way. It used to be rendered and nothing more: no id, no
  // association, no announcement — so a message that appears on blur, when focus has
  // already left the field, reached a sighted user and no one else. Passing a string to
  // `error` looked like it did the accessible thing, which is the worst version of the
  // gap, because it stops anyone looking for the missing half.
  const decoratedChildren = describedBy
    ? React.Children.map(children, (child) => {
        if (
          !React.isValidElement<{
            id?: string;
            "aria-describedby"?: string;
            "aria-invalid"?: boolean;
          }>(child)
        ) {
          return child;
        }
        if (child.props.id !== htmlFor) {
          return child;
        }
        return React.cloneElement(child, {
          "aria-describedby": describedBy,
          // Only set when there IS an error. A field with just a description must not be
          // stamped `aria-invalid="false"` from here — `DInput` owns that from its own
          // `error` prop, and overriding it with a value this component didn't ask about
          // would silently disable a consumer's own invalid state.
          ...(errorId ? { "aria-invalid": true } : {}),
        });
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
      {/* `role="alert"` because a validation message is typically inserted in
        response to something the user just did — often a blur, by which point
        focus has moved on. An alert announces on insertion; a plain node
        announces to nobody. */}
      {error && (
        <DText id={errorId} as="caption" variant="error" role="alert">
          {error}
        </DText>
      )}
    </div>
  );
}
