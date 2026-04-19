# Skill: design-token-check

Check that a component or file uses the House Scout design token system correctly.

## When to use
Before completing any UI implementation task — verify no hardcoded values leaked in.

## Checklist

### Colors — must use CSS variables
- [ ] No hardcoded hex (except `#fff` / `#000` in isolated SVG contexts)
- [ ] Background: `var(--bg)`, `var(--bg-elev)`, `var(--bg-sunk)`
- [ ] Text: `var(--ink)`, `var(--ink-2)`, `var(--ink-3)`, `var(--ink-4)`
- [ ] Borders: `var(--line)`, `var(--line-strong)`
- [ ] Accent: `var(--accent)`, `var(--accent-deep)`, `var(--accent-soft)`
- [ ] Room tones only on photo placeholders: `var(--sage)`, `var(--gold)`, `var(--sky)`

### Typography
- [ ] Fraunces only for: scores (72px), property names, section headings
- [ ] Inter for: all buttons, labels, body, inputs, nav
- [ ] Labels uppercase + tracked: `font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3)`

### Shadows
- [ ] Cards use `var(--shadow-card)` (three-layer)
- [ ] Hover uses `var(--shadow-hover)`
- [ ] Floating elements (bottom nav, FAB) use `var(--shadow-lift)`

### Radius
- [ ] Controls (buttons, chips): `var(--r-sm)` = 8px or `999px` for pill
- [ ] Inputs: `var(--r-md)` = 12px
- [ ] Cards: `var(--r-lg)` = 20px
- [ ] Avatars / circle buttons: `50%`

### Dark mode
- [ ] No hardcoded `background: #fff` or `color: #000` — use tokens so dark mode works

### AI hookpoints
- [ ] Future AI features marked: `// TODO(ai): <description>`
