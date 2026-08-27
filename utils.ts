import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * The one focus-visible treatment for every interactive component in the library.
 *
 * It is a shared constant rather than eight copies because it WAS eight copies, and
 * every one of them was broken the same way: `focus-visible:ring-primary/50` measured
 * **1.35:1** against the page background at worst and failed WCAG 1.4.11's 3:1 in
 * **10 of the 16** theme/mode combinations — including Studio, the default. A ring
 * nobody can see is not a focus indicator, and duplicating the expression is what let
 * it stay wrong everywhere at once.
 *
 * Two deliberate parts:
 *
 * - **`--foreground`, not `--primary`.** `--foreground` is the body-text token, so it
 *   pairs with `--background` at high contrast in every theme *by construction*
 *   rather than by per-theme luck. At 70% it measures 5.79:1 in the worst of the
 *   sixteen. The brand colour cannot do this: it is a mid-tone, and in a warm palette
 *   it lands near the page behind it.
 * - **The offset is load-bearing, not decoration.** Flush against a FILLED control
 *   (`variant="primary"`, `destructive`) the ring's adjacent colour is the button's
 *   own fill, where `--foreground/70` measures as little as 1.13:1. `ring-offset-2`
 *   inserts two pixels of page background, so both of the ring's neighbours are
 *   `--background` — the surface it was measured against. `--surface` and `--muted`
 *   sit within 1.13:1 of `--background`, so the offset is imperceptible on cards and
 *   hover chips while still doing its job.
 *
 * Variant-specific ring overrides are a mistake: they replace this whole calculation.
 * `destructive` had one (`ring-destructive/20`, and /40 in dark) which measured
 * 1.20:1 and 1.48:1 — so the delete button, of everything, had the least visible
 * focus in the library.
 *
 * `focus-visible:border-primary` is left where it already sits. It is inert on
 * borderless variants (nothing to colour) and merely cosmetic where a border exists;
 * the ring above is the indicator.
 */
export const FOCUS_RING =
  "outline-none focus-visible:ring-foreground/70 focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:ring-offset-background";
