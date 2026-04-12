import { cn } from "../utils";
import { Input } from "../primitives/input";

interface DInputProps extends Omit<React.ComponentProps<typeof Input>, "className"> {
  error?: boolean;
}

export function DInput({ error, ...props }: DInputProps) {
  return (
    <Input
      className={cn(error && "border-destructive")}
      aria-invalid={error}
      {...props}
    />
  );
}
