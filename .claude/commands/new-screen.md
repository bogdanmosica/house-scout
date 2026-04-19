# /new-screen

Scaffold a new screen for House Scout.

## Usage
```
/new-screen <ScreenName> [description]
```

## What to do

1. Read `DESIGN.md` — match the token system exactly, no hardcoded hex values
2. Read `CLAUDE.md` — confirm the screen fits the planned screens list
3. Create the screen component using:
   - `--bg`, `--ink`, `--accent`, `--bg-elev`, `--bg-sunk` for all colors
   - `--r-md` (12px) inputs, `--r-lg` (20px) cards, 999px pill/circle
   - `--shadow-card` on all elevated surfaces
   - Fraunces for display headings/scores only, Inter for all UI
   - Uppercase + tracked labels: `font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3)`
4. Mark any AI feature hookpoints with `// TODO(ai): <description>`
5. Mobile-first — design for 390px viewport first, then scale up
