import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      error: "text-destructive",
      warning: "text-warning",
      success: "text-success",
      bold: "text-foreground font-medium",
    },
    size: {
      default: "text-base",
      lg: "text-lg",
      sm: "text-sm",
      xs: "text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface DTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className">,
    VariantProps<typeof textVariants> {}

export function DText({ variant, size, ...props }: DTextProps) {
  return <span className={cn(textVariants({ variant, size }))} {...props} />;
}
