import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const segmentVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors outline-none cursor-pointer focus-visible:ring-primary/50 focus-visible:ring-[3px]",
  {
    variants: {
      size: {
        default: "h-9 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface DSegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
}

export interface DSegmentedControlProps<T extends string = string>
  extends VariantProps<typeof segmentVariants> {
  options: ReadonlyArray<DSegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Indices in `options` after which to render a `|` divider. */
  dividers?: ReadonlyArray<number>;
  ariaLabel?: string;
}

export function DSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  dividers,
  ariaLabel,
  size,
}: DSegmentedControlProps<T>) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const dividerSet = React.useMemo(() => new Set(dividers ?? []), [dividers]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  // If `value` doesn't match any option, the radiogroup would have no Tab
  // stop. Promote the first button so keyboard users can still reach the
  // group.
  const fallbackTabIndex = selectedIndex === -1 ? 0 : -1;

  const focusAt = (index: number) => {
    const len = options.length;
    if (len === 0) return;
    const wrapped = ((index % len) + len) % len;
    refs.current[wrapped]?.focus();
    const next = options[wrapped].value;
    if (next !== value) {
      onChange(next);
    }
  };

  const onKeyDown =
    (currentIndex: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        focusAt(currentIndex + 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        focusAt(currentIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        focusAt(0);
      } else if (event.key === "End") {
        event.preventDefault();
        focusAt(options.length - 1);
      }
    };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-md bg-surface p-1"
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const tabIndex = selected ? 0 : index === 0 ? fallbackTabIndex : -1;
        return (
          <React.Fragment key={option.value}>
            <button
              ref={(el) => {
                refs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.ariaLabel}
              tabIndex={tabIndex}
              onClick={() => {
                if (option.value !== value) onChange(option.value);
              }}
              onKeyDown={onKeyDown(index)}
              className={cn(
                segmentVariants({ size }),
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {option.label}
            </button>
            {dividerSet.has(index) && index < options.length - 1 && (
              <span
                aria-hidden="true"
                className="text-muted-foreground/50 select-none px-0.5"
              >
                |
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
