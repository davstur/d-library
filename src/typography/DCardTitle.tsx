import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const cardTitleVariants = cva("", {
  variants: {
    size: {
      default: "",
      sm: "text-base @sm:text-lg",
    },
    align: {
      left: "",
      center: "text-center",
    },
  },
  defaultVariants: {
    size: "default",
    align: "left",
  },
});

type DCardTitleProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "className"> & VariantProps<typeof cardTitleVariants>;

export function DCardTitle({ size, align, ...props }: DCardTitleProps) {
  return <h3 className={cn(cardTitleVariants({ size, align }))} {...props} />;
}
