# @davstur/d-library

A self-contained React design system built on Radix UI primitives, styled with CVA (class-variance-authority) + Tailwind CSS v4 + CSS custom properties for theming.

## Components

- **UI:** DButton, DCard, DBadge, DDialog, DMenu, DAvatar, DSpinner, DSkeleton, DDivider, DMarkdown, DTooltip, DToast, DTable
- **Typography:** DText, DCardTitle
- **Forms:** DInput, DTextarea, DCheckbox, DProgressBar, DSlider, DFormField, DSelectField
- **Navigation:** DBackButton

## Installation

This package is distributed as source (TypeScript + JSX). The consuming project compiles it.

```bash
npm install @davstur/d-library
```

## Setup in consuming project

### 1. Import theme tokens

In your global CSS file, import the theme tokens before your Tailwind directives:

```css
@import "@davstur/d-library/tokens/themes.css";
@import "tailwindcss";
```

### 2. Map CSS variables to Tailwind

Add a `@theme inline` block to connect CSS variables to Tailwind utilities (see the tandemic project's `globals.css` for the full mapping).

### 3. Use components

```tsx
import { DButton, DCard, DText } from "@davstur/d-library";

function MyPage() {
  return (
    <DCard>
      <DText>Hello</DText>
      <DButton variant="primary">Click me</DButton>
    </DCard>
  );
}
```

## Theming

8 themes are included (default light/dark + brutalist, ocean, sakura, midnight, forest, mono). Apply a theme by setting `data-theme` on a parent element:

```html
<body data-theme="ocean">
```

Toggle dark mode by adding the `dark` class to the same element.

## Framework-agnostic links

`DBackButton` and `DMenuItem` accept a `linkComponent` prop that defaults to a plain `<a>` tag. In Next.js projects, pass the `Link` component:

```tsx
import Link from "next/link";

<DBackButton href="/decks" linkComponent={Link} />
<DMenuItem href="/settings" linkComponent={Link}>Settings</DMenuItem>
```

## Architecture

- `primitives/` - Internal Radix UI wrappers (do not import directly)
- `ui/` - High-level UI components
- `forms/` - Form components
- `typography/` - Text components
- `navigation/` - Navigation components
- `tokens/` - CSS custom property theme definitions
- `utils.ts` - `cn()` utility (clsx + tailwind-merge)
- `index.ts` - Barrel export
