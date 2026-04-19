# Skill: vercel

Vercel platform patterns for House Scout. Read when working on deployment, edge functions, or Vercel-specific integrations.

## Stack

- **Framework**: Next.js (App Router) — deployed on Vercel
- **Runtime**: Node.js (default) for API routes; Edge runtime for lightweight middleware
- **Storage**: Vercel KV (Redis) for sessions/cache; Vercel Postgres for persistent data (when backend added)
- **AI**: Vercel AI SDK (`ai` package) for streaming AI features — `// TODO(ai):` hookpoints

## Project structure (Next.js App Router)

```
src/
  app/
    layout.tsx              — root layout, fonts, theme provider
    page.tsx                — home / shortlist
    properties/
      [id]/
        page.tsx            — property detail
        scout/
          page.tsx          — scout flow (Variation A)
    api/
      properties/
        route.ts            — CRUD (when backend added)
      ai/
        insights/route.ts   — // TODO(ai): streaming insights
  components/
    ui/                     — shadcn primitives (auto-generated, don't edit)
    property/               — PropertyCard, PropertyGrid
    scout/                  — RoomNav, QuestionCard, ScoutResult
    layout/                 — Header, BottomNav
  stores/                   — Zustand stores
  lib/
    scoring.ts              — computeRating, computeRoomScore, scoreAnswer
    questions.ts            — ROOMS, QUESTIONS_FULL, QUESTIONS_LIGHT, BUY/RENT_EXTRAS
    types.ts                — shared TypeScript types
  styles/
    globals.css             — CSS variables (design tokens)
```

## Environment variables

```bash
# .env.local (never commit)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# When backend added:
# DATABASE_URL=
# KV_REST_API_URL=
# KV_REST_API_TOKEN=
# ANTHROPIC_API_KEY=        # for AI features
```

## Vercel AI SDK pattern (future)

```ts
// app/api/ai/insights/route.ts
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { property, answers } = await req.json()

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: 'You are a property scouting assistant...',
    prompt: `Analyze this property scout report: ${JSON.stringify({ property, answers })}`,
  })

  return result.toDataStreamResponse()
}
```

```tsx
// Component usage
import { useCompletion } from 'ai/react'

export function PropertyInsights({ property, answers }: Props) {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/insights',
  })
  // ...
}
```

## Deployment

```bash
vercel                  # preview deploy
vercel --prod           # production deploy
vercel env pull         # sync .env from Vercel dashboard
vercel logs             # tail logs
```

## Key conventions

- **`use client`** only when needed: event handlers, Zustand hooks, browser APIs. Server components by default.
- **`export const runtime = 'edge'`** on API routes that don't need Node.js — faster cold starts.
- **`next/font`** for Fraunces + Inter — auto-optimized, no FOUT.
- **`next/image`** for all listing photos — automatic WebP, sizing, lazy load.
- **Metadata API** for SEO: `export const metadata: Metadata = { title: '...' }` per page.
