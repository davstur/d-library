import { cn } from "../utils";
import { Textarea } from "../primitives/textarea";

interface DTextareaProps extends Omit<React.ComponentProps<typeof Textarea>, "className"> {
  error?: boolean;
  size?: "default" | "tall" | "taller";
}

export function DTextarea({ error, size = "default", ...props }: DTextareaProps) {
  return (
    <Textarea
      className={cn(
        error && "border-destructive",
        size === "tall" && "min-h-[100px]",
        size === "taller" && "min-h-[150px]",
      )}
      aria-invalid={error}
      {...props}
    />
  );
}
