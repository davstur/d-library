# Changelog

## 0.3.10 — 2026-10-24

Two bugs in `DInput`'s slotted shape (a `leadingIcon` or `trailingIcon`),
measured while building 0.3.9 and kept out of it because that release limited
rendering changes to two named fixes. **Both change rendering**, and only for
slotted fields; bare fields measure identically before and after in all sixteen
theme/mode combinations.

### Fixed

- **A slotted field rings like a bare one when focused.** The container that
  draws the slotted field was where 0.3.4's `FOCUS_RING` fix never reached: it
  kept `focus-within:ring-primary/50` with no offset, measuring **1.35–5.29:1**
  against the page and under WCAG 1.4.11's 3:1 in **11 of 16** combinations
  (Warm Amber light 1.35, Studio light 1.65; 1.26 with Kraftwerk's volt). It now
  takes `FOCUS_WITHIN_RING`, the `focus-within:` twin of `FOCUS_RING` in
  `utils.ts`: **5.81–8.57:1**, the bare field's ring exactly, in all sixteen.

  **Rendering change:** every slotted field while focused. `focus-within`
  still applies when focus is on a control in the slot rather than on the text
  field, as before; with a `DButton` toggle that now shows two rings of equal
  weight, the container's and the button's own.

- **A slotted field takes `DFormField`'s error.** It set `aria-invalid={error}`
  after spreading its props, so with no `error` prop of its own it overwrote the
  `aria-invalid` that `DFormField` clones onto a field with an error — and any a
  consumer passed directly — with `undefined`. The field lost the attribute and
  kept its resting border while the message rendered beneath it; the same field
  without an icon was marked and red. Now the slotted shape spreads in the bare
  shape's order and turns red on the same condition: `error`, or
  `aria-invalid="true"`.

  **Rendering change:** a slotted field inside a `DFormField` with an error,
  or with `aria-invalid` passed directly, and no `error` prop — it is now red
  and announced as invalid.

## 0.3.9 — 2026-10-24

Everything [Kraftwerk](https://github.com/davstur/kraftwerk) recorded in
kraftwerk#22 while building its Account tab and password flows on 0.3.8 — each
one worked around locally and filed to come back here. Additions are additive:
every default renders as before. **Two bug fixes change rendering** (the
description/error stack, and invalid fields under focus); both are called out
below.

Measured in Storybook across all sixteen theme/mode combinations, and with
Kraftwerk's tokens layered on, from computed styles composited over the page
ground. The default segmented control, and valid inputs at rest and focused,
measure identically before and after in all sixteen.

### Added

- **`className` on `DButton`, `DInput`, `DTextarea`, `DSegmentedControl` and
  `DIconButton`**, merged last so a consumer override wins (twMerge drops the
  class it conflicts with). For what a call site owns and the variants cannot
  know: a de-stacking margin, a `w-[6ch]` numeric cell, a composer's one-line
  rest height. On `DInput` it lands on the visible box — the `<input>` when bare,
  the container when slotted. On `DSegmentedControl` it lands on the radiogroup.

  Omitting it had become one gap with several faces. `DButtonProps` lacking it
  had forced three local buttons in Kraftwerk; `DInput` lacking it kept a
  numeric cell hand-rolled (a width fights `w-full`, it cannot reach through a
  wrapper); `DTextarea` lacking it put the layout on a wrapper `div` with
  `[&_textarea]:` arbitrary variants, which keep working only while the
  internals stay one bare `<textarea>`.

- **`variant="track"` on `DSegmentedControl`** — a bordered track, with the
  selected option marked by a 3px rule along its bottom edge plus full ink
  against muted ink for the rest. Two channels, neither of them a fill.

  The default `fill` paints the selected segment `bg-primary`, and the fill IS
  the state. Against `--background` that is under WCAG 1.4.11's 3:1 in Warm
  Amber light (**1.86:1**) and Studio light (**2.94:1**), and **1.55:1** with
  Kraftwerk's volt — where the three labels are also the same colour (1.00:1),
  so in a light theme nothing marks the chosen option at all.

  The rule is `--primary-text` where a theme declares it, else `--foreground`:
  **4.79:1 or better in all sixteen combinations** (worst: Studio light, clay
  ink), and **10.42:1 dark / 5.48:1 light** with Kraftwerk's tokens — the same
  figures as the local workaround it replaces. Under `forced-colors` the shadow
  is dropped by the browser, so the rule becomes a 3px underline there.

  Not a `--primary-fill` token, which the issue suggested. A fill token is only
  safe with a foreground peer beside it, and the consumer that found the gap
  chose a rule over a darker slab deliberately. The default `fill` is
  unchanged; whether it should stop being the default is an open question.

- **`size="tall"`, `shape` and `disabledTreatment` on `DIconButton`.** `tall`
  is 44px, the pair `DInput` and `DSegmentedControl` already have. `shape` is
  `"default"` (today's `rounded-sm`), `"rounded"` (`rounded-lg`) or `"circle"`.
  `disabledTreatment="none"` keeps a disabled button opaque, for one whose own
  fill a 50% fade would turn into a different colour; style it with
  `className`'s `disabled:` classes.

  36px and one radius could not replace any of Kraftwerk's seven hand-rolled
  icon buttons: all are 44px, five `rounded-lg`, two `rounded-full`.

- **`DInputProps` and `DTextareaProps` are exported** from the index.

### Fixed

- **`DFormField` no longer runs its description and error together.** With
  both set they rendered on one line — *"At least 10 characters.That is under
  10 characters."*, 0px apart — because both are inline `<span>`s and
  `space-y-2` only spaces block siblings. Each message is now in its own plain
  block.

  **Rendering change:** only fields with both. A field with one of them keeps
  its line box and measures 108px before and after; one with both goes from a
  single run-on line to two lines.

- **An invalid field stays red while focused, and stays focused-looking while
  red.** Two bugs, one per shape of `DInput`:

  - *Slotted* (a leading or trailing icon): `focus-within:border-primary`
    replaced the red border in all sixteen combinations, so the field carrying
    the error was outlined in the affirmative colour at exactly the moment it
    was read. Measured on Kraftwerk's current-password field: `#d3403a` at rest,
    `#f2c200` focused. A refusal that clears and refocuses the field made that
    its default state. The border now holds.
  - *Bare*, and `DTextarea`: the red held, but `aria-invalid:ring-destructive/20`
    (`/40` in dark) replaced `FOCUS_RING`'s colour, because `aria-*` variants
    sort after `focus-visible:`. The focus ring on an invalid field measured
    **1.22–2.14:1** against the page in all sixteen; it is back to the library
    ring, **5.81–8.57:1**. The override did nothing at rest — no ring has width
    until focus — so removing it changes only the focused state.

  **Rendering change:** invalid fields while focused, in every theme.

- **One red per error.** The invalid border reads `--destructive-text` when the
  theme declares it, like the message `DText variant="error"` sets beneath it,
  instead of `--destructive`. In a theme with the token these were two reds that
  read as two severities — Kraftwerk's `#d3403a` border against a `#dd6a66`
  message. The pairing goes to the text value because only that one is
  contrast-checked for type (#7 item 2); it also lifts Kraftwerk's border
  against the page from 3.81:1 to 5.28:1 in dark. **No library theme declares
  the token, so none of them moves**; a consumer theme that declares it sees its
  invalid borders take that red.

### Documented

- **A `ref` on `DInput` reaches the `<input>` in both shapes**, and through
  `DFormField`, whose `cloneElement` keeps it; `autoFocus` passes through the
  same way. Measured on 0.3.8: both already worked, by way of the prop spread
  and React 19's ref-as-prop — Kraftwerk's issue concluded otherwise because
  nothing said so. The ref is now destructured and routed explicitly, so a
  refactor cannot quietly move it to the container. `FocusOnReveal` walks the
  disclosure contract: open focuses the field, cancel returns focus to the
  trigger.

### Storybook

- A **Mode** toolbar (light/dark) beside the theme picker, setting `.dark` on
  `<html>`; `dark:` now follows that class as it does in a consumer, rather
  than the OS preference. The page takes the theme's `--background`, and
  borders take `--border` as both consumers declare — before, stories sat on
  the browser's white and every border was `currentColor`.

## 0.3.8 — 2026-09-09

All four found building [Kraftwerk](https://github.com/davstur/kraftwerk)'s
workout screens on 0.3.7 (kraftwerk#2). Three are additions; one is a docstring
for a contract the props could not express.

### Added

- **`size="tall"` on `DSegmentedControl`** — 44px, matching the `tall` `DInput`
  added in 0.3.7 for exactly the same reason.

  Kraftwerk's shape chooser — *Weight × reps · Reps · Time* — is the only
  irreversible control in that app: a database trigger refuses to change an
  exercise's measurement afterwards. It was shipping at 36px, because
  `default` (h-9) and `sm` (h-8) were the only sizes and this component takes
  no `className`. The consumer's workaround was a Tailwind arbitrary variant
  on a wrapper (`[&_button]:min-h-11`), which reaches inside another
  component's markup to move it — the class of fix that stops working the
  moment the internals change.

- **`ariaDescribedBy` on `DSegmentedControl`** — the id of an element
  describing the group.

  A segmented control frequently needs one: a unit, a hint, or — as here — a
  warning that the choice cannot be undone. There was no way to attach it.
  Kraftwerk passed `aria-describedby`, which is **not** a prop this component
  accepts, so it was dropped silently: `DSegmentedControlProps` extends
  `VariantProps` and TypeScript does not reject the excess property, and axe
  has no rule requiring a description on a `radiogroup`. The result shipped
  with its warning unannounced and typecheck and CI both green.

  The same passing mistake hides `aria-label`, whose prop here is `ariaLabel`
  — so that group had **no accessible name** either. Both are now reachable,
  and the description lands on the `radiogroup` itself rather than on a
  consumer-built `role="group"` wrapper, which nested two grouping roles
  around one control.

- **`width="full"` on `DSegmentedControl`** — fills the container, sharing the
  width equally between options.

  A content-width control sitting in a column of full-bleed fields breaks the
  column, and `className` is deliberately unavailable.

- **`disabled` on `DMenuItem`.** `DropdownMenuItem` already handles the aria and
  the pointer events; the wrapper simply did not pass it through. Without it a
  consumer must *omit* the item, so a menu silently changes shape between
  renders — "Move up" present on one row and absent on the next reads as a bug
  rather than as a boundary.

- **`FOCUS_RING` is now exported from the index.** It lived in `utils.ts` and
  was reachable only by deep-importing `@davstur/d-library/utils`. The
  alternative — a second copy of the ring in the consumer — is how two
  different focus treatments end up on one screen, which is precisely what a
  shared token exists to prevent.

### Documented

- **`DMenuTrigger` requires a focusable child.** It applies `asChild`, so Radix
  clones `aria-haspopup`, `aria-expanded` and the handlers onto whatever it is
  given. On a `<span>` or `<div>` those attributes fail axe's
  `aria-allowed-attr` and the trigger never enters the tab order. The props
  cannot express this and the failure is silent until an a11y run — Kraftwerk
  hit it and worked around it with a local `role="button"`, which was the wrong
  fix for the right symptom.

## 0.3.7 — 2026-09-09

Both items found building [Kraftwerk](https://github.com/davstur/kraftwerk)'s
auth screens on 0.3.6 (kraftwerk#1), and both are halves of d-library#7 item 3.

### Added

- **`size` on `DInput`** — `"default"` (h-9, 36px) or `"tall"` (h-11, 44px).
  Default unchanged, so nothing shifts under an existing consumer.

  44px is where Apple's HIG and WCAG 2.5.5 independently land, and 36px is a
  field a thumb misses. There was no way to reach it: `DInput` omits `className`
  by design, so a consumer needing a phone-sized field had nothing to pass and
  had to drop back to a hand-rolled `<input>` — which is what Kraftwerk did, and
  the reimplementation is what d-library#7 exists to stop.

  The slotted variant is the sharper case. `trailingIcon`'s own docstring asks
  for an interactive button, and such a button has to be 44px to be tappable
  itself — so in a 36px container it **overflows the box it sits in**. Measured
  on Kraftwerk's sign-in field: a 44px reveal button in a 36px input, 4px proud
  top and bottom. The two constraints only reconcile at `tall`. The `Size` story
  renders that mismatch next to the fixed version rather than describing it.

  The inner field also gains `h-full` in the slotted path: it was sitting at its
  own intrinsic height inside the container, so in a `tall` box the top and
  bottom of the visible field did not focus it.

- **`--destructive-text`**, the same optional-token pair `--primary-text`
  established in 0.3.6, now honoured by `DText variant="error"` (#7 item 2). A
  theme that does not declare it renders byte-identically to before.

  It matters more here than it did for `primary`. `variant="error"` has
  essentially one job — rendering a validation message — so it is type nearly
  100% of the time, and `DFormField` routes every consumer's field errors
  through it. A danger token chosen as a *system* colour (status fill, plate
  weight, chart series) is judged as an area; the same value as 14px type
  usually misses AA. Kraftwerk's measures **3.81:1 on its ground and 3.29:1 on
  its raised surface** — so the shipped behaviour was that the one string a
  person most needs to read failed contrast, in every consumer at once.

### Fixed

- **`DFormField`'s required marker is `aria-hidden`.** The `*` was a live text
  node inside the `<label>`, so it entered the label's text and therefore the
  control's accessible name: a required password field announced as **"Password
  star"**. Measured on Kraftwerk's deployed sign-in screen — the accessible name
  was literally `"Password *"`.

  Requiredness was never the marker's job to carry; `required` / `aria-required`
  on the control conveys it, which is where a consumer already sets it. The
  asterisk is the sighted shorthand for the same fact and should be silent.

  This also un-breaks name-based test selectors — `getByLabel("Password", {
  exact: true })`, the obvious thing to write, matched nothing.

## 0.3.6 — 2026-08-31

### Added

- **`data-interactive` on `DCard`** (tandemic#672). A card is a control in three
  different spellings and only one of them left anything a stylesheet could
  match:

  | spelling | before | now |
  | --- | --- | --- |
  | `onClick` | `role="button"` + `tabIndex` | plus `data-interactive` |
  | `swipe.interactive` | a pointer cursor, nothing else | `data-interactive` |
  | `asChild` around an `<a>`/`<button>` | nothing | `data-interactive` via the new `interactive` prop |

  So a consumer styling "cards that are controls" was really selecting *which
  spelling the author happened to use*. Tandemic hit this trying to give
  interactive cards a 3:1 boundary: `[data-slot="card"][role="button"]` would
  have missed every `asChild` link-card, and — because one call site passes
  `onClick` conditionally — would have made the border mean "this deck has cards
  due" rather than "this card is clickable". The border was dropped rather than
  ship that.

  `interactive` is **additive**: it is the opt-in for `asChild`, where the
  library cannot know whether the child it is handed is interactive. Passing
  `false` does not un-mark a card that has an `onClick`.

- **`--primary-text`**, an optional token `DText variant="primary"` prefers over
  `--primary` (tandemic#672).

  A brand primary is chosen to work as a **fill** and is routinely a few tenths
  short of AA as **text**: Studio's clay measures 3.12:1 on its own surface,
  which clears SC 1.4.11's 3:1 for an icon and misses 4.5:1 for a word. One
  token cannot answer both questions, and `text-primary` serves both roles.

  The variant now emits `text-[var(--primary-text,var(--primary))]`. **A theme
  that does not declare the token renders byte-identically to before** —
  verified across brutalist, mono and default — so this is opt-in per theme. The
  studio theme declares it: `#935E44` in light (5.08:1 on `--surface`, up from
  3.12), and in dark simply `--primary`, which already measures 5.49:1.


## 0.3.5 — 2026-08-29

### Fixed

- **The modal scrim no longer inverts in dark mode** (tandemic#658).
  `DialogOverlay` and `AlertDialogOverlay` both painted `bg-foreground/50`.
  `--foreground` flips with the colour scheme; a scrim's job does not.

  | mode | `--foreground` | scrim over the page | effect |
  | --- | --- | --- | --- |
  | light | `#191a17` | dark wash | page recedes ✅ |
  | dark | `#ece5d2` | **cream wash** | page **brightens** `#1f1e1b` → ~`#858176` ❌ |

  Measured in a real dark render: `oklab(0.922315 -0.00000596046 0.0264025 / 0.5)`.
  The affordance did not merely weaken — it reversed: the dialog read as a dark box
  floating on a *bright* field.

  Now `bg-black/50`, a fixed dark wash in both modes. **Keep it mode-invariant.** The
  next person to notice a hardcoded colour among tokens will want to "fix" this back to
  `bg-foreground/50`, which is exactly the bug.

  No `forced-colors` treatment, deliberately: `forced-colors` maps background-color away,
  so the scrim disappears there — as it did before. Radix's focus trap and the dialog's
  own border carry modality in that mode. (Contrast `DIconButton`, which *does* carry
  `forced-colors:bg-[CanvasText]`, because there the bar IS the only signal.)

- **The dialog now has a boundary you can see against that scrim** (tandemic#658).
  `DialogContent` / `AlertDialogContent` gain `border-foreground`. With the scrim
  corrected, the dialog's own `bg-background` sits at **1.15:1** against it in dark —
  the modal and the page it covers are near enough the same value that only the border
  separates them, and `--border` was not up to it.

  Four candidates, measured against the scrim across **all 16 shipped theme/mode
  combinations** (`:root`, `.dark`, and the seven named themes in both modes). Clearing
  the SC 1.4.11 bar of 3:1:

  | candidate | combos clearing 3:1 | worst case |
  | --- | --- | --- |
  | `--border` (previous) | **3 of 16** | 1.20:1 (midnight dark) |
  | `--muted-foreground` | 9 of 16 | 1.30:1 |
  | `--primary` | 10 of 16 | **1.00:1** — indistinguishable from the scrim |
  | **`--foreground`** | **16 of 16** | **3.85:1** (`:root` light) |

  Two intuitive choices fail, and they fail in LIGHT: a light-mode scrim is mid-grey, and
  so are `--muted-foreground` and `--primary`. `--foreground` wins for the same reason it
  won for `DIconButton`'s indicator bar in 0.3.4 — it is a high-contrast pair with
  `--background` in every theme *by construction*, not by per-theme measurement.

  **The symmetry is deliberate and worth stating**, because it looks inconsistent at a
  glance: this release REMOVES `--foreground` from the scrim and ADDS it to the border.
  A scrim must not track the mode. A border against a scrim must, because the scrim's own
  value tracks the page. Same token, opposite verdicts, both correct.

  Note this was never a per-consumer problem — `--border` failed the bar in 13 of 16
  combinations, so every theme shipped a modal whose edge was below 3:1.

- **Toasts follow the palette instead of rendering a white card on a dark page**
  (tandemic#658). `DToast` passed no `theme`, so sonner defaulted to `light` and
  `--normal-bg` resolved to `#fff`. Measured on a real failing delete: `rgb(255,255,255)`
  on a `#1f1e1b` page — every toast, **including every error toast**, so the harshest
  thing a dark-mode user saw arrived at the moment something had already gone wrong.

  Fixed by pointing sonner's variables at d-library tokens via an inline `style` on the
  `<Toaster>`, not by `theme="system"`. `system` follows `prefers-color-scheme` while our
  own dark mode is a `.dark` CLASS, so a consumer toggling against the OS gets the bug
  back; and sonner's dark block is `--normal-bg: #000`, off-palette in all 16
  combinations. Tokens are correct under any consumer theme mechanism.

  Inline is load-bearing: sonner injects `[data-sonner-toaster][data-sonner-theme='light']`
  — (0,2,0) — from its own `<style>` tag at runtime, so it is unlayered and lands after
  any CSS we ship. It targets the same `<ol>` that `style` is spread onto, so an inline
  declaration wins outright, with no specificity trick and no ordering dependency.

  **The description is fixed too, and it is the half that matters.** Sonner hardcodes
  `[data-description] { color: #3f3f3f }`, overridden only by its `theme='dark'` rule,
  which never matches here — leaving the *actionable* sentence of every error at
  **~1.38:1** on a dark surface while the title looked fine. Now
  `toastOptions.classNames.description`, which measures 5.84:1 dark / 5.36:1 light.

  Scope: the **normal** toast type. `richColors` and `data-invert` set their variables on
  the toast `<li>`, a descendant of the element carrying ours, so they win by cascade.
  No token fallback, deliberately — a token-less consumer gets a transparent toast, which
  is louder than a plausible white one.

## 0.3.4 — 2026-08-27

### Fixed

- **`DIconButton`'s active state is now visible, not just semantic** (tandemic#612).
  `active` painted `bg-muted`, which measures **1.13:1** against the page background
  in Studio — 1.06–1.29:1 across all eight themes — where WCAG 1.4.11 asks 3:1 of a
  state indication. `aria-current="page"` (0.3.2) had covered assistive tech, so what
  was left was sighted users, with the only on-screen signal failing by more than 2x.

  It now renders a 2px indicator bar on the button's bottom edge, painted with
  `--foreground`. Three measurements decided that token, and they are the reason not
  to "simplify" it later:

  | candidate | Studio light | Warm Amber light |
  | --- | --- | --- |
  | `--muted` (the old fill) | 1.13:1 | 1.13:1 |
  | `--border` | — | 1.40:1 |
  | **`--primary`** — the intuitive choice | **2.94:1** | **1.86:1** |
  | `--foreground` | 15.64:1 | 15.16:1 |

  The brand colour fails, and Studio's 2.94:1 is the dangerous kind of failure — near
  enough to eyeball as fine. `--foreground` is the body-text token, so it is a
  high-contrast pair with `--background` in every theme *by construction* rather than
  by per-theme measurement; the worst of the sixteen theme/mode combinations is
  13.14:1.

  Two details that are easy to undo by accident:

  - **`bg-muted` is no longer painted on active.** `subtle` already hovers to
    `bg-muted` + `text-foreground`, so keeping the fill left a hovered item and the
    current item looking identical apart from 2px — and iOS Safari retains `:hover`
    on the last-tapped element, so two matching chips could sit side by side. Hover
    owns the fill; active owns the bar.
  - **The bar sits at `bottom-0`, not `DBottomTabItem`'s `top-0`.** That component is
    fixed to the bottom of the viewport, so its top edge faces content; in a top bar
    the mirror is a vertical flip. It also keeps the bar away from a badge in the
    icon's top-right corner.

  The bar is `aria-hidden` (the semantic is already carried by `aria-current`),
  absolutely positioned so it cannot alter a consumer's row height, and carries
  `forced-colors:bg-[CanvasText]` — without which Windows High Contrast Mode maps the
  background-color away and removes the signal entirely, for the users most likely to
  depend on it.

  `active` consequently now means "current page", nav-style, rather than a generic
  pressed state; a toggle should carry its own visual state and `aria-pressed`.

- **`DIconButton`'s icons are no longer painted with `--primary`** (tandemic#612).
  The resting colour is now `--muted-foreground` and `active` takes `--foreground`.

  This is a second 1.4.11 fix, not styling. An icon-only control has no text label,
  so its glyph is a graphical object required to understand the control — the same
  3:1 bar as the state indication above — and `--primary` is **2.94:1** against the
  page background in Studio, **1.86:1** in Warm Amber. `--muted-foreground` clears it
  in all sixteen theme/mode combinations (worst 4.24:1).

  It also makes true what this docstring had claimed since it was written: the code
  had been setting `text-primary` unconditionally. And it stops overriding `subtle`'s
  own `hover:text-foreground`, which the old `hover:text-primary` had been
  suppressing — so hover behaviour changes for every `DIconButton`, not only the
  resting colour.

  **Consumers should look at their non-nav icon buttons.** Toolbar and composer
  affordances that read as amber will now read as muted, and a `disabled` one
  (`disabled:opacity-50`) sits near 2:1 — legible enough, but no longer eye-catching.
  Disabled controls are exempt from 1.4.11, so that is a salience trade, deliberately
  made in exchange for the conformance fix above.

- **A hovered `DIconButton` no longer out-emphasises the active one** (tandemic#612).
  `subtle` sets `hover:text-foreground`, which after the change above was the *same*
  colour as the active icon — so hovering collapsed the icon-colour signal and left a
  20x2px indicator bar competing with a 36x36px `bg-muted` chip, 65x its area. The
  item under the cursor read as the current page. Hover is now held at
  `text-muted-foreground`: the chip is the hover affordance, and the active item is
  unconditionally the darkest icon in the row.

  The indicator also moved from `bottom-0` to `bottom-[2px]`. Flush with the button
  edge it fell inside the hover chip's corner radius and touched the focus ring's
  inner edge, reading as welded to both.

- **The focus ring is visible now** (tandemic#640). `focus-visible:ring-primary/50`
  measured **1.35:1** against the page background at worst and failed WCAG 1.4.11's
  3:1 in **10 of the 16** theme/mode combinations — Studio, the default, among them
  at 1.65:1. In Warm Amber (1.34:1) it took an A/B of two screenshots to confirm the
  ring was rendering at all.

  The same expression had been copy-pasted into **eight** components, so it was wrong
  in all of them at once. There is now one `FOCUS_RING` in `utils.ts` and every
  component references it: `DButton`, `DCard`, `DSegmentedControl`, and the `badge`,
  `button`, `input`, `textarea` and `select` primitives.

  | | worst of 16 |
  |---|---|
  | `ring-primary/50` (was) | 1.35:1 ❌ |
  | `ring-foreground/70` (now) | 5.79:1 ✅ |

  Two parts, both load-bearing:

  - **`--foreground`, not `--primary`.** The body-text token pairs with
    `--background` at high contrast in every theme *by construction*. A mid-tone
    brand colour in a warm palette cannot.
  - **`ring-offset-2` is not decoration.** Flush against a FILLED control the ring's
    adjacent colour is the button's own fill, where `--foreground/70` measures as
    little as 1.13:1. The offset puts two pixels of page background on both sides of
    the ring — the surface it was measured against. `--surface` and `--muted` sit
    within 1.13:1 of `--background`, so it is imperceptible on cards and hover chips.

  **`destructive`'s ring override is removed.** `ring-destructive/20` (and `/40` in
  dark) measured **1.20:1** and **1.48:1**, and being a variant override it replaced
  the base ring entirely — so the delete button had the least visible focus in the
  library. A variant must not override this ring.

  `focus-visible:border-primary` is left where it was: inert on borderless variants,
  cosmetic where a border exists. The ring is the indicator.

  Pinned by `DButton.stories.tsx`'s `FocusRingIsVisible`, which asserts the **ratio**
  rather than the token — a token assertion cannot tell you it fails in one theme,
  and a test renders only one.

  Follow-up in the same series: collapsing the eight copies initially **stripped the
  ring from `badge`, `button` and `input` without adding `FOCUS_RING`**, leaving
  three components with no focus indicator at all — worse than the weak one they
  had. `FocusRingIsVisible` did not catch it, because `DButton` has its own variants.
  A source scan in the consumer now asserts that every component styling
  `focus-visible:` references `FOCUS_RING` and that none declares a ring of its own;
  it immediately found two more `ring-destructive/20` variant overrides, in `badge`
  and `button`, which are removed here too.

## 0.3.3 — 2026-08-26

### Fixed

- **`DFormField` no longer remounts its input when the error appears or clears.**
  `Children.map` prefixes the keys of what it returns, so switching between mapped and
  raw children handed React a different key for the same child — and React answered by
  unmounting and remounting it. The field lost focus, selection and any uncontrolled
  value the instant an error toggled, which is mid-typing, exactly when someone is
  correcting the thing the error is about. The map now runs unconditionally.

  Latent since the `description` wiring landed (a dynamic description had the same
  effect); 0.3.2 made it reachable, because an error toggles where a description
  generally does not.

## 0.3.2 — 2026-08-26

### Fixed

- **`DFormField` now wires its `error` to the input.** It rendered the string and
  nothing else — no id, no `aria-describedby`, no `aria-invalid`, no announcement —
  while `description` had been wired all along. A validation message usually appears on
  blur, by which point focus has moved on, so the message reached a sighted user and
  nobody else. Passing a string to `error` *looked* like it did the accessible thing,
  which is the worst version of the gap: it stops anyone from going looking for the
  missing half.

  The error now gets `${htmlFor}-error`, joins `aria-describedby` **ahead of** the
  description (what just went wrong is read before the standing hint), sets
  `aria-invalid` on the matching child, and renders with `role="alert"` so it is
  announced on insertion.

  Additive: `aria-invalid` is set only when there is an error, so a field with just a
  description is not stamped `aria-invalid="false"` — `DInput` keeps owning that from
  its own `error` prop. Found while fixing a form field in tandemic that had to route
  around this with its own live region (tandemic#629).

## 0.2.0 — 2026-05-07

Studio design enablement (refs tandemic#398, tandemic#397 tracker).
Strictly additive: existing default theme + 6 named themes remain visually
unchanged; Studio is opt-in via `data-theme="studio"`.

### Added

- **Studio theme** — new `[data-theme="studio"]` block in `tokens/themes.css`
  (light + dark variants). Warm-paper palette with clay primary (`#C77B57`)
  and sage accent (`#8AA083`). `--font-display` falls back to system serifs
  when `--font-instrument-serif` isn't loaded.
- **`themes/prose.css`** — theme-agnostic structural CSS for
  `.dmarkdown-prose` content (paragraph spacing, list indentation).
- **`themes/studio.css`** — theme-scoped component overrides for blockquote
  and table styling under Studio. Also ships the `.dropcap` utility class
  (theme-agnostic, uses theme tokens).
- **`DBottomTabBar` + `DBottomTabItem`** — fixed-bottom mobile navigation
  primitive. ≥44pt touch target, owns `safe-area-inset-bottom`, `<nav>` +
  `aria-current="page"` semantics (NOT `role="tab"`).
- **`DBadge.variant="meta"` + `tone` prop** — mono-uppercase metadata pill
  (CEFR levels, status tags) with semantic tone vocabulary
  (`neutral|positive|warning|critical|info`).
- **`DBadgeProps`** now exported (previously internal).
- **`DTextProps` and `DTextAs`** types exported.

### Changed

- **`DText` API redesigned** to role-based: `as` selects a complete
  typographic preset (size + weight + font + transform + tracking).
  13 roles: `display`, `hero`, `h1`-`h4`, `body`, `inline`, `caption`,
  `label`, `meta`, `cta`, `small`. Plus `italic` and `bold` modifiers.
  - **Default `as="inline"` is byte-identical** with the old
    default-variant default-size rendering: both produce
    `<span class="text-base text-foreground">{children}</span>`.
    Existing `<DText>foo</DText>` callers (no `size`/`as` prop) need
    no change.
  - **`size` prop removed** — call sites passing `size="..."` will fail
    TypeScript and must migrate to roles. Migration table:

    | Old call | New equivalent |
    |---|---|
    | `<DText size="xs">` | `<DText as="small">` |
    | `<DText size="sm">` | `<DText as="label">` (with weight) or wrap in a `<span class="text-sm">` for unweighted small text |
    | `<DText size="default">` (or no size) | `<DText>` (no `as`) — defaults to `inline` (text-base) |
    | `<DText size="lg">` | `<DText as="h3">` (text-lg + medium) |
    | `<DText variant="bold" size="lg">` | `<DText as="h3">` |
    | `<DText size="sm" variant="muted">` | `<DText as="label" variant="muted">` |

    For pure size-only changes without weight (rare), wrap in a styled span
    or pick the closest role. The role list is intentionally finite — if
    you find yourself reaching for an absent combo, reconsider whether
    that combo serves a real design role or is ad-hoc styling.

  - **`variant="bold"`** continues to work as a deprecated alias for the
    `bold` modifier — emit a console warning when used. Migration:
    `<DText variant="bold">` → `<DText bold>`.
- **`DButton`, `DBadge`, `DAvatar`, `DMarkdown`, `DMenu`, `DProgressBar`,
  `DFormField`** — typography moved to inner `DText` per the "all text in
  d-library uses DText" rule. Container components no longer carry `text-*`
  / `font-*` classes. Caller-side API of these components is unchanged.
- **`DMarkdown`** — wrapper `<div>` now has `className="dmarkdown-prose"`,
  enabling theme-scoped CSS for blockquote and table rendering. Default
  theme still inherits browser/Tailwind preflight.

### Fixed

- **Storybook decorator**: `.storybook/preview.ts` was advertising theme
  display names (`Warm Amber`, `Forest Sage`, etc.) that didn't match the
  `[data-theme="..."]` selectors in `themes.css`. Theme switching in
  Storybook now actually works.
- **Storybook globals.css**: added missing `@theme inline` mappings for
  `--color-accent`, `--color-chart-1..6`, `--font-sans`, `--font-mono` so
  `text-accent`, `font-mono`, etc. resolve correctly in d-library Storybook.
  Also added `@layer base { blockquote { ... } }` mirroring Tandemic's
  globals.css to eliminate environmental divergence.

### Pre-existing issues fixed alongside the Studio work

These were originally scoped as follow-ups but were rolled into this
release at the user's request — none are large fixes individually, and
keeping them in the same PR avoids two rounds of baseline regen.

- **`--secondary` / `--secondary-foreground` tokens added** in `:root`,
  defaulting to `var(--muted)` / `var(--foreground)`. `DBadge`'s
  long-broken `bg-secondary` / `text-secondary-foreground` Tailwind classes
  now resolve. Visual change: badges previously rendered without a
  background; they now show a subtle muted-color background, matching the
  badge's original design intent. Storybook globals.css mirrors this via
  `@theme inline` (Tandemic's globals.css needs the same on the consumer
  side — included in the Tandemic-side post-implementation step).
- **`ui/DAvatar.tsx:77` `NodeJS.Timeout` typecheck error fixed** — replaced
  with browser-compatible `ReturnType<typeof setTimeout>`.
- **All theme `--font-display` declarations now have fallback chains** —
  `ocean` / `sakura` (`source-serif → ui-serif, Georgia, serif`),
  `midnight` (`playfair → ui-serif, Georgia, serif`), `forest`
  (`dm-serif → ui-serif, Georgia, serif`), `brutalist`
  (`space-grotesk → ui-sans-serif, system-ui, sans-serif`), `mono`
  (`geist-mono → ui-monospace, ...`), default (`geist-sans → ui-sans-serif,
  system-ui, sans-serif`). d-library Storybook reviewers no longer see
  silent fallback-to-sans for themes whose fonts aren't loaded.

## 0.1.x

Previous unreleased state. See git log.
