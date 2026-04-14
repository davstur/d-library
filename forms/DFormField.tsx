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
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <DText variant="error">{error}</DText>}
    </div>
  );
}
