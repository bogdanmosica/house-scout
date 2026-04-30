---
name: tailwind-v4
description: Tailwind CSS v4 patterns for House Scout — CSS-first config, design token integration, shadcn/ui compatibility, mobile-first component patterns
type: skill
trigger: Any time you write or edit Tailwind classes, globals.css, or shadcn/ui components in this project
---

# Tailwind v4 — House Scout

## Critical: v4 is CSS-first, not config-first

**No `tailwind.config.js`.** Everything lives in CSS via `@theme` and `@layer`.

```css
/* globals.css */
@import "tailwindcss";   /* replaces @tailwind base/components/utilities */

@theme {
  /* custom tokens → Tailwind utility classes */
  --color-bg:        #fbf8f3;
  --color-accent:    #d97757;
  /* now you can write: bg-bg, text-accent, border-accent */
}
```

`@theme` block = design tokens. Every `--color-*`, `--font-*`, `--shadow-*` defined here becomes a utility class.

## House Scout Token Setup

Paste this into `apps/web/app/globals.css`:

```css
@import "tailwindcss";

/* ─── House Scout Design Tokens ─── */
:root {
  --bg:          #fbf8f3;
  --bg-elev:     #ffffff;
  --bg-sunk:     #f4efe7;
  --ink:         #1f1b17;
  --ink-2:       #4a413a;
  --ink-3:       #847a6f;
  --ink-4:       #b8ad9f;
  --line:        rgba(31,27,23,0.08);
  --line-strong: rgba(31,27,23,0.16);

  --accent:      #d97757;
  --accent-deep: #b95d3f;
  --accent-soft: #fbeee5;

  --sage:        #6b8f7a;
  --sage-soft:   #e4ece6;
  --gold:        #c4893a;
  --gold-soft:   #f5ead5;
  --sky:         #6b8aa8;
  --sky-soft:    #e2ebf1;

  --shadow-card: 0 0 0 1px rgba(31,27,23,0.04),
                 0 2px 6px rgba(31,27,23,0.04),
                 0 4px 10px rgba(31,27,23,0.06);
  --shadow-hover:0 0 0 1px rgba(31,27,23,0.05),
                 0 6px 16px rgba(31,27,23,0.08),
                 0 12px 24px rgba(31,27,23,0.06);
  --shadow-lift: 0 10px 30px rgba(31,27,23,0.10),
                 0 2px 6px rgba(31,27,23,0.06);

  --r-sm:  8px;
  --r-md:  12px;
  --r-lg:  20px;
  --r-xl:  28px;
  --r-2xl: 36px;

  --font-serif: "Fraunces", "Iowan Old Style", Georgia, serif;
  --font-sans:  "Inter", -apple-system, system-ui, sans-serif;
}

[data-theme="dark"] {
  --bg:      #1a1613;
  --bg-elev: #262020;
  --bg-sunk: #15110f;
  --ink:     #f4efe7;
  --ink-2:   #c9beb1;
  --ink-3:   #8a8075;
  --ink-4:   #5c544b;
}

/* ─── Tailwind v4 Theme ─── */
@theme inline {
  --color-bg:          var(--bg);
  --color-bg-elev:     var(--bg-elev);
  --color-bg-sunk:     var(--bg-sunk);
  --color-ink:         var(--ink);
  --color-ink-2:       var(--ink-2);
  --color-ink-3:       var(--ink-3);
  --color-ink-4:       var(--ink-4);
  --color-line:        var(--line);
  --color-line-strong: var(--line-strong);
  --color-accent:      var(--accent);
  --color-accent-deep: var(--accent-deep);
  --color-accent-soft: var(--accent-soft);
  --color-sage:        var(--sage);
  --color-sage-soft:   var(--sage-soft);
  --color-gold:        var(--gold);
  --color-gold-soft:   var(--gold-soft);
  --color-sky:         var(--sky);
  --color-sky-soft:    var(--sky-soft);

  --shadow-card:  var(--shadow-card);
  --shadow-hover: var(--shadow-hover);
  --shadow-lift:  var(--shadow-lift);

  --radius-sm:  var(--r-sm);
  --radius-md:  var(--r-md);
  --radius-lg:  var(--r-lg);
  --radius-xl:  var(--r-xl);
  --radius-2xl: var(--r-2xl);

  --font-serif: var(--font-serif);
  --font-sans:  var(--font-sans);
}

body {
  background-color: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
}
```

## Utility Classes Available After Setup

```
bg-bg          bg-bg-elev     bg-bg-sunk
bg-accent      bg-accent-soft bg-accent-deep
bg-sage        bg-sage-soft
bg-gold        bg-gold-soft
bg-sky         bg-sky-soft

text-ink       text-ink-2     text-ink-3     text-ink-4
text-accent

border-line    border-line-strong

shadow-card    shadow-hover   shadow-lift

rounded-sm     rounded-md     rounded-lg     rounded-xl    rounded-2xl

font-serif     font-sans
```

## Component Patterns

### Property Card
```tsx
<div className="bg-bg-elev rounded-lg shadow-card hover:shadow-hover transition-shadow duration-200">
  <div className="h-48 rounded-t-lg bg-bg-sunk" />  {/* photo placeholder */}
  <div className="p-4">
    <h3 className="font-serif text-[22px] text-ink leading-tight">Name</h3>
    <p className="text-ink-3 text-sm mt-1">Address</p>
  </div>
</div>
```

### Chip (room selector / mode toggle)
```tsx
/* Active */
<button className="rounded-full bg-ink text-bg text-[12.5px] font-medium px-3 py-1.5 transition-all duration-[160ms]">
/* Inactive */
<button className="rounded-full bg-bg-elev text-ink-2 border border-line-strong text-[12.5px] font-medium px-3 py-1.5 transition-all duration-[160ms]">
```

### Floating Pill Nav
```tsx
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-bg rounded-full shadow-lift h-[42px] px-[18px] flex items-center gap-4 font-sans text-[13px] font-semibold">
```

### Primary Button
```tsx
<button className="bg-ink text-bg rounded-md px-5 py-3 text-sm font-semibold active:scale-[0.98] transition-transform">
```

### Accent Button
```tsx
<button className="bg-accent text-white rounded-md px-5 py-3 text-sm font-semibold active:scale-[0.98] transition-transform">
```

### Ghost Button
```tsx
<button className="bg-transparent text-ink border border-line-strong rounded-md px-5 py-3 text-sm font-semibold hover:bg-bg-sunk transition-colors">
```

### Label (uppercase tracked)
```tsx
<span className="text-[11px] font-bold uppercase tracking-[0.09em] text-ink-3">
```

### Display Score
```tsx
<span className="font-serif text-[72px] leading-none tracking-[-0.03em] text-ink">
```

## Mobile-First Rules

Always write mobile breakpoint first. Add `sm:` / `md:` for larger:

```tsx
{/* ✓ mobile-first */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">

{/* ✗ wrong — desktop-first */}
<div className="grid grid-cols-3 max-md:grid-cols-1">
```

Touch targets min 44×44px. Use `min-h-[44px] min-w-[44px]` on interactive elements.

## Dark Mode

Use `[data-theme="dark"]` on `<html>` or `<body>`, NOT `dark:` Tailwind prefix.
CSS variables flip automatically — no `dark:` variants needed in components.

```tsx
{/* ✓ tokens flip via [data-theme="dark"] */}
<div className="bg-bg text-ink">

{/* ✗ avoid — duplicates what tokens already do */}
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

## shadcn/ui Compatibility

shadcn reads `--background`, `--foreground`, `--primary` etc. Map our tokens:

```css
/* In globals.css, after the House Scout tokens */
:root {
  --background: var(--bg);
  --foreground: var(--ink);
  --card: var(--bg-elev);
  --card-foreground: var(--ink);
  --primary: var(--ink);
  --primary-foreground: var(--bg);
  --secondary: var(--bg-sunk);
  --secondary-foreground: var(--ink-2);
  --muted: var(--bg-sunk);
  --muted-foreground: var(--ink-3);
  --accent: var(--accent);
  --accent-foreground: #ffffff;
  --border: var(--line);
  --input: var(--line-strong);
  --ring: var(--accent);
  --radius: var(--r-md);
}
```

## v4 Gotchas

| Gotcha | Fix |
|--------|-----|
| `tailwind.config.js` ignored | Move all custom tokens to `@theme` in CSS |
| `@apply` still works but discouraged | Prefer utility classes directly |
| JIT is always on | No `purge` config needed |
| `border-line` needs opacity variant | Use `border-[rgba(31,27,23,0.08)]` or CSS var directly |
| `postcss.config.mjs` must use `@tailwindcss/postcss` | Already set up in this project |
| No hardcoded hex in components | Always use CSS variable utilities (`bg-accent` not `bg-[#d97757]`) |

## Accent Variant Switching

Accent color is switchable via `data-accent` attribute:

```css
[data-accent="terra"] { --accent: #d97757; --accent-deep: #b95d3f; }
[data-accent="sage"]  { --accent: #6b8f7a; --accent-deep: #4e6e5d; }
[data-accent="sky"]   { --accent: #6b8aa8; --accent-deep: #4a6a88; }
[data-accent="gold"]  { --accent: #c4893a; --accent-deep: #9c6b26; }
```

Set on `<html data-accent="terra">`. All `bg-accent` / `text-accent` classes update instantly.

## Room Photo Tints

```tsx
const photoClass = {
  terra:   'bg-[linear-gradient(135deg,#ead5c6,#dcb89f)]',
  sage:    'bg-[linear-gradient(135deg,#cfdcd0,#b8c9bc)]',
  sky:     'bg-[linear-gradient(135deg,#cdd7e0,#b1bfcb)]',
  gold:    'bg-[linear-gradient(135deg,#ecdcb9,#dcc38a)]',
  default: 'bg-[linear-gradient(135deg,#e6d9c6,#d9c7ad)]',
}
```

## Checklist Before Submitting Component

- [ ] No hardcoded hex values — use token utilities
- [ ] Mobile styles written first, breakpoint modifiers for larger
- [ ] Touch targets ≥44px on interactive elements
- [ ] Dark mode works via CSS variable flip (not `dark:` prefix)
- [ ] `font-serif` only on display text (scores, property names, headings)
- [ ] `font-sans` on all interactive elements (buttons, chips, labels, body)
- [ ] Run `design-token-check` skill to verify before commit
