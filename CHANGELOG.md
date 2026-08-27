# Changelog

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
