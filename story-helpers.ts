/**
 * Measurement helpers for story `play` functions. Story-only: nothing in
 * `index.ts` exports them.
 *
 * Colours are composited through a canvas rather than parsed from computed
 * strings. getComputedStyle hands back a colour in whatever space it was
 * authored — `oklab(0.25 0.01 0.017 / 0.7)`, not `rgb()` — so reading "the first
 * three numbers" as 0–255 channels silently yields near-black for everything.
 * The canvas also composites alpha over the ground, which is the colour a user
 * actually sees.
 *
 * Tokens are resolved through a probe element, because a custom property read
 * off the root returns its AUTHORED value (`#191A17` in Studio, `oklch(…)`
 * elsewhere), while a computed `backgroundColor` is something the canvas can
 * paint.
 */

type RGB = [number, number, number];

/** A CSS colour or `var(--token)`, resolved in `host`'s cascade. */
export function resolveColour(host: HTMLElement, value: string): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).backgroundColor;
  probe.remove();
  return resolved;
}

function paint(colours: string[]): RGB {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  for (const c of colours) {
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
  }
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function luminance([r, g, b]: RGB) {
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/**
 * WCAG contrast of `colour` painted over `ground`, against `ground` — the ratio
 * of a ring, a rule or a fill to the surface it sits on. Both are CSS colours or
 * `var(--token)`s, resolved in `host`'s cascade.
 */
export function contrastOver(host: HTMLElement, colour: string, ground: string): number {
  const g = resolveColour(host, ground);
  const [hi, lo] = [luminance(paint([g, resolveColour(host, colour)])), luminance(paint([g]))].sort(
    (p, q) => q - p,
  );
  return (hi + 0.05) / (lo + 0.05);
}

/** The colour of the first `inset` layer of `el`'s computed box-shadow, if any. */
export function insetShadowColour(el: Element): string | null {
  const layers: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of getComputedStyle(el).boxShadow) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  layers.push(current.trim());
  const inset = layers.find((layer) => /\binset\b/.test(layer));
  if (!inset) return null;
  // The colour leads the layer: a function (`oklch(…)`, `rgb(…)`) or a keyword.
  const fn = inset.match(/^[a-z-]+\([^)]*\)/i);
  return fn ? fn[0] : inset.split(/\s+/)[0];
}

/**
 * Stops CSS transitions until the returned function is called.
 *
 * A play that focuses a field and reads `boxShadow` straight away reads the
 * TRANSITION's starting value — `transition-[color,box-shadow]` is on every
 * input — which is the unfocused shadow, ring-less. Two such reads compare equal
 * whatever the rings are, so an assertion built on them cannot fail. With
 * transitions off, a style change lands at once.
 */
export function freezeTransitions(): () => void {
  const style = document.createElement("style");
  style.textContent = "*, *::before, *::after { transition: none !important; }";
  document.head.appendChild(style);
  return () => style.remove();
}
