# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Agent Entry Point

> Read `AGENTS.md` first — it indexes all docs, skills, and stack context for this project.

## Project

**House Scout** — mobile-first property scouting app. Users add properties (rent or buy), walk through room-by-room Q&A, and get a 1–5 star rating. Turborepo monorepo: `apps/web` (Next.js 16), `apps/mobile` (Expo, future), `packages/*` (shared logic).

## Design System

Full spec in `DESIGN.md`. Key tokens:

```
Canvas:  #fbf8f3   Ink:     #1f1b17   Accent:  #d97757 (terracotta)
Fonts:   Fraunces (display/scores) + Inter (UI)
Shadows: three-layer warm lift (see DESIGN.md §4)
Radius:  8px controls · 12px inputs · 20px cards · 50% pill/circle
Dark:    #1a1613 ("evening scout" warm charcoal)
```

CSS variables use `--bg`, `--ink`, `--accent` etc. (shadcn-compatible naming). Accent variants switchable via `data-accent="terra|sage|sky|gold"`.

## App Architecture

### Core Data Model

```ts
// Property — the top-level entity
{ id, name, address, city, type, mode: 'rent'|'buy', price, beds, baths, sqft,
  rating: 1–5|null, tone: 'terra'|'sage'|'sky'|'gold',
  status: 'scouted'|'todo', highlights: string[], notes: string }

// Rooms (ordered): entrance → living → kitchen → bedroom → bath → outdoor → neighbor

// Question kinds: 'stars' | 'scale' | 'chips' | 'yesno'
// Each answer normalises to 1–5. Room score = avg answered. Overall = avg all.
```

### Question Banks
- `full` (default): 2–3 questions per room
- `light`: 1 question per room
- `buy` mode adds: resale prospects (neighbor), structural concerns (entrance)
- `rent` mode adds: lease flexibility (neighbor)

### Chosen UX Variation: A — Room-by-room Walkthrough
- Scrollable room chips rail at top; chips turn sage + show score when complete
- Hero photo per room (placeholder tint until real camera integration)
- Question stack scrolls below photo
- Floating pill bottom nav: `← | X/N answered | Next room →`
- Result screen: Fraunces display score + StarRow + room breakdown + comparison bars

## Planned Screens

| Screen | Notes |
|--------|-------|
| Home / Shortlist | Property grid, scouted + todo |
| Scout Flow (Variation A) | Room walkthrough — primary feature |
| Property Detail | Full report, room scores, notes |
| Add Property | Type + mode picker → start scout |
| Compare | Side-by-side breakdown |
| Onboarding | Rent/buy intent, preferences |

## Tech Stack

- **Framework**: Next.js 16 App Router (`apps/web`) on Vercel
- **Language**: TypeScript — strict mode, `noUncheckedIndexedAccess` (see `.claude/skills/typescript.md`)
- **State**: Zustand — `usePropertyStore` (persisted) + `useScoutStore` (ephemeral session) (see `.claude/skills/zustand.md`)
- **UI**: shadcn/ui + Tailwind CSS with CSS variable tokens from `styles/globals.css`
- **Fonts**: `next/font/google` — Fraunces + Inter
- **Images**: `next/image` for all listing photos
- **Deployment**: Vercel (see `.claude/skills/vercel.md`, `/deploy` command)
- **AI (future)**: Vercel AI SDK + `@ai-sdk/anthropic`

### Commands
```bash
# From repo root (Turborepo)
pnpm dev          # all apps
pnpm build        # all apps + packages
pnpm lint         # all workspaces
pnpm typecheck    # all workspaces

# From apps/web
pnpm dev          # Next.js dev server
pnpm build        # Next.js build
pnpm tsc --noEmit # type check
vercel            # preview deploy
vercel --prod     # production deploy
```

### Monorepo Package Sharing Rules
- `packages/types` `packages/validation` `packages/stores` `packages/api-client` — shared web + mobile
- `apps/web/components` — web only (shadcn/ui, DOM)
- `apps/mobile/components` — mobile only (NativeWind/RN primitives)
- **Never** import `apps/web` code from `apps/mobile` or vice versa

## Agent / AI Features (future hooks)

- AI insights: per-property notes analysis → surface patterns
- Staging suggestions: based on room scores + photos
- Design generation: from property data to layout mood

Mark these hookpoints with `// TODO(ai): <description>` so they're easy to find.

## Claude Code Setup

Custom commands live in `.claude/commands/`. Skills in `.claude/skills/`.

When implementing a new screen: read `DESIGN.md` first, match the token system exactly — no hardcoded hex values in components.
