import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, FOCUS_RING } from "../utils";

const segmentVariants = cva(
  "inline-flex items-center justify-center rounded-sm font-medium transition-colors cursor-pointer " +
    FOCUS_RING,
  {
    variants: {
      size: {
        default: "h-9 px-4 text-sm",
        sm: "h-8 px-3 text-xs",
        // 44px, matching the `tall` DInput added in 0.3.7 for the same reason:
        // a segmented control is often the only way to set something, and a
        // 36px target is one a thumb misses.
        tall: "h-11 px-4 text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

/**
 * How the selected option is marked.
 *
 * `fill` (the default, unchanged) paints the selected segment `bg-primary` with
 * `text-primary-foreground`, on no track. That holds where the brand colour is
 * strong against the page and fails where it is not, because the fill IS the
 * state: measured against `--background` it is under WCAG 1.4.11's 3:1 in Warm
 * Amber light (1.86:1) and Studio light (2.94:1), and 1.55:1 with Kraftwerk's
 * volt — where all three labels also end up the same colour, so in light both
 * channels collapse at once.
 *
 * `track` draws the control as a bordered track and marks the selected segment
 * with a 3px rule along its bottom edge, plus full ink against muted ink for the
 * others — two channels, neither of which is a fill. Upstreamed from Kraftwerk's
 * `AppearanceRow`. Measured against `--background`, the rule is 4.79:1 at worst
 * (Studio light) across all sixteen theme/mode combinations, and 10.42:1 / 5.48:1
 * with Kraftwerk's tokens — the same figures its workaround recorded. The muted
 * ink of the unselected options is the theme's `--muted-foreground`, the token
 * every muted label in the library uses, and inherits its contrast: 4.23:1 in
 * Mono dark and 4.25:1 in Midnight dark, under 4.5:1 there as it is for
 * `DText variant="muted"` (d-library#7's text-token item, not this control's).
 *
 * The rule is `--primary-text` when the theme declares one, else `--foreground`.
 * `--primary-text` is a theme's brand colour VERIFIED as type (≥4.5:1), which
 * over-clears the 3:1 an indicator owes, so a theme that has declared one keeps
 * its brand here. A theme that has not has made no such promise about
 * `--primary` — Warm Amber's is 1.86:1 in light — so the fallback is the token
 * that pairs with `--background` by construction, the same choice `FOCUS_RING`
 * and `DIconButton`'s bar made. This is deliberately NOT `DText`'s fallback
 * (`--primary`): `DText` had to stay byte-identical for themes without the
 * token, and a new variant has no prior rendering to preserve.
 *
 * No `--primary-fill` token. The fill's missing light peer is real, but a fill
 * token is only safe with a foreground peer beside it, and the consumer that
 * found the gap chose a rule over a darker slab on purpose.
 */
const SELECTED_CLASSES = {
  fill: {
    selected: "bg-primary text-primary-foreground",
    unselected: "text-foreground hover:bg-muted",
  },
  track: {
    // `inset` so the rule costs no layout. Box shadows are dropped under
    // `forced-colors`, so there the state becomes an underline, which is drawn
    // in the forced text colour rather than removed.
    selected:
      "text-foreground shadow-[inset_0_-3px_0_0_var(--primary-text,var(--foreground))] forced-colors:underline forced-colors:decoration-[3px] forced-colors:underline-offset-[6px]",
    // Hover lifts the ink to full as well as filling a chip. Muted ink on the
    // `bg-muted` chip measured as low as 3.84:1, under 4.5:1 for a label in 7 of
    // the 16 theme/mode combinations. Full ink does not make a hovered option read
    // as the selected one: that one has the rule and no chip. And it cannot
    // stick after a tap — Tailwind v4 compiles `hover:` inside
    // `@media (hover: hover)`, which a touch screen never matches.
    unselected: "text-muted-foreground hover:bg-muted hover:text-foreground",
  },
} as const;

export interface DSegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface DSegmentedControlProps<T extends string = string>
  extends VariantProps<typeof segmentVariants> {
  options: ReadonlyArray<DSegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  /** Indices in `options` after which to render a `|` divider. */
  dividers?: ReadonlyArray<number>;
  ariaLabel?: string;
  /**
   * Id of the element describing the group — a warning, a hint, a unit.
   *
   * Without this a consumer had to wrap the control in its own `role="group"`
   * to carry a description, which nests two grouping roles for one control.
   * The description belongs on the radiogroup itself.
   */
  ariaDescribedBy?: string;
  /**
   * `"content"` (default) hugs its labels; `"full"` fills its container and
   * shares the width equally between options.
   *
   * A content-width control in a stack of full-bleed fields breaks the column,
   * and it needs no `className` to reach full width.
   */
  width?: "content" | "full";
  /** `"fill"` (default) or `"track"`. See `SELECTED_CLASSES`. */
  variant?: "fill" | "track";
  /**
   * Classes for the radiogroup itself, merged last so a consumer override wins
   * — a margin, a max width. Not for the selected state, which is `variant`.
   */
  className?: string;
}

export function DSegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  dividers,
  ariaLabel,
  ariaDescribedBy,
  size,
  width = "content",
  variant = "fill",
  className,
}: DSegmentedControlProps<T>) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const dividerSet = React.useMemo(() => new Set(dividers ?? []), [dividers]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  // If `value` doesn't match any option, the radiogroup would have no Tab
  // stop. Promote the first button so keyboard users can still reach the
  // group.
  const fallbackTabIndex = selectedIndex === -1 ? 0 : -1;

  const focusAt = (index: number, direction: 1 | -1 = 1) => {
    const len = options.length;
    if (len === 0) return;
    let wrapped = ((index % len) + len) % len;
    // Skip past disabled options so arrow keys never park focus on them.
    for (let attempts = 0; attempts < len; attempts++) {
      if (!options[wrapped].disabled) break;
      wrapped = ((wrapped + direction) % len + len) % len;
    }
    if (options[wrapped].disabled) return;
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
        focusAt(currentIndex + 1, 1);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        focusAt(currentIndex - 1, -1);
      } else if (event.key === "Home") {
        event.preventDefault();
        focusAt(0, 1);
      } else if (event.key === "End") {
        event.preventDefault();
        focusAt(options.length - 1, -1);
      }
    };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={cn(
        "items-center gap-1",
        width === "full" ? "flex w-full" : "inline-flex",
        // The track: what makes an unselected segment read as a place you can
        // tap, and what the rule is seen against. `rounded-md` around
        // `rounded-sm` segments, 2px in, keeps the corners concentric.
        variant === "track" && "rounded-md border p-0.5",
        className,
      )}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        const isDisabled = option.disabled ?? false;
        const tabIndex = isDisabled ? -1 : selected ? 0 : index === 0 ? fallbackTabIndex : -1;
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
              disabled={isDisabled}
              onClick={() => {
                if (option.value !== value) onChange(option.value);
              }}
              onKeyDown={onKeyDown(index)}
              className={cn(
                segmentVariants({ size }),
                width === "full" && "flex-1",
                selected
                  ? SELECTED_CLASSES[variant].selected
                  : SELECTED_CLASSES[variant].unselected,
                isDisabled && "opacity-50 pointer-events-none",
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
