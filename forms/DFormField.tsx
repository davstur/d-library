import { DText } from "../ui/DText";

interface DFormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function DFormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: DFormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        // <label> for accessibility, DText controls typography.
        <label htmlFor={htmlFor} className="block">
          <DText as="label">{label}</DText>
          {required && (
            <>
              {" "}
              <DText variant="error">*</DText>
            </>
          )}
        </label>
      )}
      {children}
      {error && <DText as="caption" variant="error">{error}</DText>}
    </div>
  );
}
