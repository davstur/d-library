"use client";

import type { CSSProperties } from "react";

import { Toaster } from "../primitives/sonner";

/**
 * Sonner's palette, expressed in d-library tokens (tandemic#658).
 *
 * Sonner defaults to `theme="light"`, and its light block hardcodes
 * `--normal-bg: #fff` — so on a dark page EVERY toast, error toasts included,
 * rendered a pure white card. Measured: `rgb(255,255,255)` on `#1f1e1b`.
 *
 * `theme="system"` is the obvious fix and the wrong one, for two reasons:
 *   1. It follows `prefers-color-scheme`, while d-library's own dark mode is a
 *      `.dark` CLASS (tokens/themes.css). A consumer toggling `.dark` against
 *      the OS gets the white toast back.
 *   2. Sonner's dark block is `--normal-bg: #000` — pure black, off-palette in
 *      all 16 of our theme/mode combinations.
 * Pointing the variables at tokens is correct under ANY consumer theme
 * mechanism — `.dark`, `data-theme`, or `light-dark()` — and stays on-palette.
 *
 * Why INLINE rather than a stylesheet rule: sonner injects
 * `[data-sonner-toaster][data-sonner-theme='light']` — specificity (0,2,0) —
 * from its own `<style>` tag at RUNTIME, so it is unlayered and lands after any
 * CSS we ship. A merely-matching selector loses the source-order tie-break
 * silently. Sonner spreads `style` onto the `<ol data-sonner-toaster>` element
 * itself, which is the same element its rule targets, so an inline declaration
 * wins outright — no specificity trick, no ordering dependency.
 *
 * No `var(--surface, #fff)` fallback, deliberately: a token-less consumer gets
 * an invalid declaration and therefore a TRANSPARENT toast, which is louder
 * than a plausible-looking white one.
 *
 * The two `-hover` vars are future-proofing, not a reachable fix: they are only
 * consulted under `[data-sonner-theme='dark']`, this component exposes no
 * `theme` prop, and sonner's light close-button hover uses `--gray2`/`--gray5`.
 * They cost two lines and close a half-themed state the moment a `theme` prop
 * is added.
 *
 * Scope: the NORMAL toast type. `richColors` and `data-invert` set `--normal-bg`
 * / `--error-bg` on the toast `<li>`, a DESCENDANT of the element carrying
 * these vars, so they win by cascade and are out of reach here.
 */
const TOAST_THEME_VARS = {
  "--normal-bg": "var(--surface)",
  "--normal-text": "var(--foreground)",
  "--normal-border": "var(--border)",
  "--normal-bg-hover": "var(--muted)",
  "--normal-border-hover": "var(--muted-foreground)",
} as CSSProperties;

export function DToast() {
  return (
    <Toaster
      position="top-center"
      offset={56}
      duration={5000}
      style={TOAST_THEME_VARS}
      toastOptions={{
        className: "font-sans",
        // Sonner paints the description with a hardcoded `#3f3f3f`, overridden
        // only by its `[data-sonner-theme='dark']` rule — which never matches
        // here. On a dark `--surface` that measures ~1.38:1, and the
        // description is where the ACTIONABLE half of an error lives ("Check
        // your connection and try again", every backend refusal). The title
        // inherits `--normal-text` and was fine, which is what made this easy
        // to miss. Trailing `!` is Tailwind v4's important modifier; it is
        // required to beat sonner's (0,3,0) selector.
        classNames: { description: "text-muted-foreground!" },
      }}
    />
  );
}
