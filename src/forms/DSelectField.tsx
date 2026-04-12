import { DFormField } from "./DFormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../primitives/select";

export interface DSelectFieldOption {
  value: string;
  label: string;
}

interface DSelectFieldProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DSelectFieldOption[];
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

export function DSelectField({
  label,
  value,
  onValueChange,
  options,
  disabled,
  placeholder,
  id,
}: DSelectFieldProps) {
  return (
    <DFormField
      label={label}
      htmlFor={id}
    >
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </DFormField>
  );
}
