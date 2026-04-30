# House Scout — AI Agent Context

> STOP. Prefer retrieval-led reasoning over pre-training-led reasoning.
> Read the indexed files below before writing any code. Your training data is stale.

## Monorepo Index

| Path | What it is |
|------|-----------|
| `CLAUDE.md` | Codebase guidance, data model, architecture, commands |
| `DESIGN.md` | Full design system — tokens, typography, shadows, components |
| `BUSINESS.md` | Product vision, user stories, feature priorities |
| `apps/web/AGENTS.md` | **Next.js 16 docs index** — always read before touching web app code |
| `apps/web/.next-docs/` | Full Next.js 16.2.x documentation (version-matched) |
| `.claude/skills/` | Local skills — read before starting any task type |
| `.claude/commands/` | Slash commands available in this project |

## Workspace Structure

```
house-scout/
├── apps/
│   ├── web/          Next.js 16 App Router (primary)
│   └── mobile/       Expo (React Native) — future
├── packages/
│   ├── types/        Shared TypeScript types (web + mobile)
│   ├── validation/   Zod schemas (web + mobile)
│   ├── stores/       Zustand stores (web + mobile)
│   └── api-client/   Fetch-based API client (web + mobile)
├── AGENTS.md         This file
├── CLAUDE.md         Codebase instructions
├── DESIGN.md         Design system spec
└── turbo.json        Build pipeline
```

## Skills Index

| Skill file | When to use |
|-----------|-------------|
| `superpowers/brainstorming/SKILL.md` | Before ANY creative work — features, components, flows |
| `superpowers/writing-plans/SKILL.md` | Before multi-step implementation |
| `superpowers/executing-plans/SKILL.md` | When executing a written plan |
| `superpowers/systematic-debugging/SKILL.md` | Any bug, test failure, unexpected behavior |
| `superpowers/test-driven-development/SKILL.md` | Before writing implementation code |
| `superpowers/dispatching-parallel-agents/SKILL.md` | 2+ independent tasks |
| `superpowers/verification-before-completion/SKILL.md` | Before claiming work is complete |
| `superpowers/requesting-code-review/SKILL.md` | After completing a feature |
| `superpowers/finishing-a-development-branch/SKILL.md` | When implementation is complete |
| `tailwind-v4/SKILL.md` | Tailwind v4 CSS-first config, design tokens, component patterns — read before any CSS/component work |
| `design-token-check.md` | Verify no hardcoded colors/values in components |
| `scoring.md` | Property scoring algorithm reference |
| `typescript.md` | TypeScript strict mode patterns for this project |
| `zustand.md` | Zustand store patterns (`usePropertyStore`, `useScoutStore`) |
| `vercel.md` | Deployment guide |

All skills live at `.claude/skills/<skill-file>`. Read before acting.

## Stack Quick Reference

| Concern | Answer |
|---------|--------|
| Framework | Next.js 16 App Router |
| Language | TypeScript strict + `noUncheckedIndexedAccess` |
| State | Zustand (`usePropertyStore` persisted, `useScoutStore` ephemeral) |
| UI | shadcn/ui + Tailwind CSS |
| Database | Postgres + Drizzle ORM |
| Auth | NextAuth.js v5 |
| Fonts | Fraunces (display) + Inter (UI) via `next/font/google` |
| Deploy | Vercel |
| Monorepo | Turborepo |
| Mobile | Expo (React Native) — shares `packages/*` only, NOT `apps/web` UI |

## Critical Rules

- **No hardcoded hex values** in components — use CSS variables (`--bg`, `--ink`, `--accent`)
- **No UI sharing** between `apps/web` and `apps/mobile` — shared code lives in `packages/` only
- **Read `apps/web/AGENTS.md`** before any Next.js work — Next.js 16 has breaking changes from training data
- **Mark AI hookpoints** with `// TODO(ai): <description>`
- **Design tokens**: full spec in `DESIGN.md` — read it

## Next.js 16 Warning

> `apps/web` runs Next.js **16.2.4**. APIs, caching, routing, and file conventions differ from your training data.
> Always consult `apps/web/AGENTS.md` → `.next-docs/` before writing web app code.
> Key new APIs: `connection()`, `'use cache'`, `forbidden()`, `unauthorized()`, async `cookies()`/`headers()`, `after()`, `updateTag()`.
