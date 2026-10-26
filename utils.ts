import { clsx, type ClassValue } from "clsx"
import {
  extendTailwindMerge,
  twMerge,
  type ConfigExtension,
  type DefaultClassGroupIds,
  type DefaultThemeGroupIds,
} from "tailwind-merge"

/** What `configureClassMerge` takes: tailwind-merge's own extension shape. */
export type ClassMergeConfig = ConfigExtension<DefaultClassGroupIds, DefaultThemeGroupIds>

let merge: (classes: string) => string = twMerge

/**
 * Tell the library's `cn` about class names Tailwind's default theme does not
 * have — above all, a consumer's own font sizes.
 *
 * Every component that takes `className` merges it with `cn`, and bare
 * tailwind-merge knows only Tailwind's default theme. A font size named by a
 * consumer's `@theme` (`--text-body` → `text-body`) is not in it, so it is
 * filed under TEXT COLOUR: it deletes the colour beside it or is deleted by
 * it, and the component's own `text-sm` survives either way. Measured on
 * 0.3.10 with Kraftwerk's scale (kraftwerk#67, d-library#12):
 *
 *     cn("h-9 px-4 py-2 text-sm", "text-body text-primary-text")
 *       →  "h-9 px-4 py-2 text-sm text-primary-text"     16px gone, 14px kept
 *
 * After `configureClassMerge({ extend: { theme: { text: ["body", …] } } })`
 * the same merge keeps `text-body` and drops `text-sm`.
 *
 * - **The argument is tailwind-merge's own `extendTailwindMerge` config**, so a
 *   consumer that already extends its own merge passes the same object.
 * - **It replaces, not accumulates.** A second call discards the first, so a
 *   module re-evaluated by hot reload does not stack copies; no argument
 *   restores the bare merge. Unconfigured, `cn` is bare `twMerge` exactly as
 *   before.
 * - **Call it in every JavaScript environment that renders.** The setting is
 *   module state, and a framework that renders in more than one environment
 *   loads this module once in each. Next's App Router has three: React Server
 *   Components, the server render of client components, and the browser — a
 *   call made in only one of them leaves the others bare, and a server render
 *   that disagrees with the browser is a hydration mismatch. Put the call at
 *   the top level of the module that defines your class strings — the one a
 *   call site imports to build the `className` it hands a component — so every
 *   environment that builds such a string has evaluated it first. Not in a
 *   file only one environment loads: `instrumentation.ts`, or a layout or a
 *   provider alone. The merge runs where the COMPONENT renders, though:
 *   `DIconButton` is a client component, so a string a Server Component hands
 *   it is merged in the other two environments, which need the import too.
 *
 * Measured in Kraftwerk on Next 16 for d-library#12, on `/login` (a client
 * component) and a client-side navigation from it to `/register`, in
 * `next dev` and in a production build. Called at the top of Kraftwerk's
 * class-string module, the server render and the browser's own render both
 * took the configuration, and nothing mismatched on hydration. Called only
 * where `window` is undefined, the server render took it, the browser's render
 * was bare, and React logged a hydration mismatch; called only where it is
 * defined, the reverse. Not called, both were bare and nothing logged — the
 * silent case. React logs mismatches in development only. A Server Component
 * rendering a control was not exercised: no public route has one.
 */
export function configureClassMerge(config?: ClassMergeConfig) {
  merge = config ? extendTailwindMerge(config) : twMerge
}

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs))
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

/**
 * `FOCUS_RING` for a container that DRAWS a field whose `<input>` sits inside it —
 * `DInput`'s slotted shape, where the input shares a box with its icons. Same
 * colour, width and offset, for the same reasons.
 *
 * It exists because that container is where the 0.3.4 fix did not reach. It
 * still carried `focus-within:ring-primary/50` with no offset, which measured
 * 1.35–5.29:1 against the page and failed 3:1 in 11 of the 16 theme/mode
 * combinations (Warm Amber light 1.35, Studio light 1.65; 1.26 with Kraftwerk's
 * volt) — so a search field or a password field with a reveal toggle had a
 * weaker focus than the plain field beside it. Keep the two constants in step.
 *
 * **Keyed on the input, not `focus-within`.** The container rings while its own
 * `<input>` — the direct child marked `data-slot="input-control"`, so not an
 * input a consumer passes into a slot — has focus, and NOT while focus is on a
 * control in the slot. With `focus-within`, tabbing to a reveal toggle drew two rings of
 * equal weight — the container's, saying "the field", and the toggle's own,
 * saying "the toggle" — so the indicator named two things and only one was
 * focused. A control in a slot carries its own indicator: a `DButton` brings
 * `FOCUS_RING`; a raw `<button>` needs `FOCUS_RING` added, or it falls back to
 * the browser's outline.
 */
export const INPUT_BOX_FOCUS_RING =
  "has-[>[data-slot=input-control]:focus-visible]:ring-foreground/70 has-[>[data-slot=input-control]:focus-visible]:ring-[3px] has-[>[data-slot=input-control]:focus-visible]:ring-offset-2 has-[>[data-slot=input-control]:focus-visible]:ring-offset-background";
