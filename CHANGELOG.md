# Changelog

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
  - **Breaking-ish, but back-compatible at the call site**: existing
    `<DText size="sm">` callers will need to migrate to roles. Default
    `as="inline"` keeps unstyled `<span>` callers (no `as` prop) working
    byte-identical. `variant="bold"` continues to work as a deprecated alias.
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

### Known issues (NOT fixed in this release)

- `DBadge` references `bg-secondary` and `text-secondary-foreground`, but
  no `--color-secondary` token exists in any theme. Pre-existing — fixing
  it would visibly change appearance for every existing theme. Filed for
  follow-up.
- `ui/DAvatar.tsx:77` references `NodeJS.Timeout` namespace which isn't
  declared. Pre-existing typecheck error on `main`.
- Other themes (ocean, sakura, midnight, forest) reference custom font
  variables (`--font-source-serif`, etc.) without fallback chains. Pre-
  existing — not exercised by Tandemic. Filed for follow-up.

## 0.1.x

Previous unreleased state. See git log.
