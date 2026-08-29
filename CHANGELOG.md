# Changelog

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
