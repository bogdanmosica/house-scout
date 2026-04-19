# DB + Admin + MCP Design

**Date:** 2026-04-19
**Status:** Approved

## Overview

Replace client-side `data.ts` + localStorage with Supabase (Postgres + PostgREST) as single source of truth for web and future mobile. Add a protected admin page for question management. Expose a dual-mode MCP server for both admin operations and user property conversations.

---

## 1. Database Schema (Supabase / Postgres)

### Tables

```sql
-- Reference: ordered room list
rooms (
  id          text PRIMARY KEY,  -- 'entrance' | 'living' | 'kitchen' | 'bedroom' | 'bath' | 'outdoor' | 'neighbor'
  label       text NOT NULL,
  sort_order  integer NOT NULL
)

-- Question bank — single source of truth, replaces data.ts
questions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     text NOT NULL REFERENCES rooms(id),
  kind        text NOT NULL,     -- 'stars' | 'scale' | 'chips' | 'yesno'
  text        text NOT NULL,
  sub         text,
  low         text,
  high        text,
  options     text[],
  yes_label   text,
  no_label    text,
  banks       text[] NOT NULL,   -- ['full'] | ['light'] | ['full','light']
  modes       text[] NOT NULL,   -- ['rent'] | ['buy'] | ['rent','buy']
  sort_order  integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
)

-- User properties
properties (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  address     text,
  city        text,
  type        text,
  mode        text NOT NULL,     -- 'rent' | 'buy'
  price       numeric,
  beds        integer,
  baths       numeric,
  sqft        integer,
  rating      numeric,           -- 1–5 | null
  tone        text,              -- 'terra' | 'sage' | 'sky' | 'gold'
  status      text NOT NULL DEFAULT 'todo',  -- 'scouted' | 'todo'
  highlights  text[],
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
)

-- Scout sessions (ephemeral → persisted on end)
scout_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  bank         text NOT NULL,    -- 'full' | 'light'
  mode         text NOT NULL,    -- 'rent' | 'buy'
  current_room text REFERENCES rooms(id),
  started_at   timestamptz NOT NULL DEFAULT now(),
  ended_at     timestamptz
)

-- Per-question answers
answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL REFERENCES scout_sessions(id) ON DELETE CASCADE,
  room_id      text NOT NULL REFERENCES rooms(id),
  question_id  uuid NOT NULL REFERENCES questions(id),
  raw_value    jsonb,            -- number | boolean | null
  score        numeric,         -- normalised 1–5
  created_at   timestamptz NOT NULL DEFAULT now()
)
```

### RLS Policies

| Table | anon SELECT | anon write | service role |
|-------|------------|-----------|--------------|
| rooms | ✓ | ✗ | full |
| questions | ✓ (active=true) | ✗ | full |
| properties | ✓ | ✓ (for now) | full |
| scout_sessions | ✓ | ✓ | full |
| answers | ✓ | ✓ | full |

Properties/answers write policy tightens when user accounts are introduced.

### Seed

A seed script (`packages/db/seed.ts`) migrates existing hardcoded questions from `apps/web/lib/data.ts` and the 5 seed properties into the DB on first deploy. `data.ts` is deleted after migration.

---

## 2. API Layer

**PostgREST** — built into Supabase, auto-generated from schema. No custom server.

Endpoints (examples):
```
GET  /rest/v1/questions?banks=cs.{full}&modes=cs.{rent}&active=eq.true&order=sort_order
GET  /rest/v1/properties?select=*
POST /rest/v1/properties
GET  /rest/v1/answers?session_id=eq.<id>&select=*,questions(*)
```

### packages/api-client

Typed wrapper around `@supabase/supabase-js`. Used by both `apps/web` and future `apps/mobile`.

```ts
// Anon key — public read + user writes
export const getQuestions = (bank: QuestionBank, mode: PropertyMode) =>
  supabase.from('questions').select('*')
    .contains('banks', [bank])
    .contains('modes', [mode])
    .eq('active', true)
    .order('sort_order')

export const getProperties = () =>
  supabase.from('properties').select('*').order('created_at', { ascending: false })

export const upsertAnswer = (answer: AnswerInsert) =>
  supabase.from('answers').upsert(answer)

// ... expandable
```

Zustand stores keep their current shape for **ephemeral scout session state** (fast in-memory during walkthrough). On session end, `useScoutStore.endSession()` flushes answers to DB via `api-client`.

---

## 3. Admin Page

### Auth

NextAuth.js v5 — Google OAuth. `ADMIN_EMAIL` env var gates access (only `bogdan.mosica@gmail.com` by default). Middleware redirects `/admin/**` to sign-in if session missing or email doesn't match.

Supabase **service role key** used server-side only (never in client bundle) for admin write operations.

### Routes

```
apps/web/app/admin/
  layout.tsx          ← session guard
  page.tsx            ← redirect → /admin/questions
  questions/
    page.tsx          ← question table (server component, reads all questions)
    actions.ts        ← Server Actions: createQuestion, updateQuestion, deleteQuestion
  // expandable: /admin/properties, /admin/rooms, /admin/settings
```

### Questions UI

- Table grouped by room, sorted by `sort_order`
- Columns: room, kind, text, banks, modes, active toggle, edit/delete actions
- Add button → modal with full question fields
- Edit inline or via modal
- Delete = soft delete (`active = false`), hard delete option with confirm
- `sort_order` editable as number field (drag-drop deferred)

---

## 4. MCP Server

`packages/mcp-server` — standalone MCP server, two tool categories.

### Auth Modes

| Category | Key used | Purpose |
|----------|----------|---------|
| Admin tools | Service role key | Mutate questions, config |
| User tools | Anon key | Read property + scout data |

### Initial Tools

**Admin category:**
```
list_questions(bank?, mode?, room?, includeInactive?)
create_question(fields)
update_question(id, fields)
delete_question(id)         ← soft delete by default
```

**User / property category:**
```
get_property_report(id)     ← property + all room scores + answers
get_property_notes(id)      ← notes + highlights only
compare_properties(ids[])   ← side-by-side room score breakdown
list_properties(status?)    ← scouted | todo | all
```

**Expandable:** additional categories (e.g. AI analysis, session replay, staging suggestions) added as new tool groups without touching existing tools.

### Transport

Ships as stdio MCP server (for Claude Code local use). HTTP transport wrapper deferred — add when remote/shared access needed.

---

## 5. Package Structure Changes

```
packages/
  db/                 NEW — schema SQL + Supabase migrations + seed script
    migrations/       ← SQL files applied via Supabase CLI
    seed.ts           ← imports data.ts, inserts into Supabase
  api-client/         UPDATED — typed Supabase wrapper (replaces stub)
  mcp-server/         NEW — MCP server with admin + user tools
  types/              UPDATED — types mirror DB schema exactly
  validation/         UPDATED — Zod schemas for all DB entities
  stores/             UNCHANGED — Zustand stays for ephemeral session state
```

> **Note on schema management:** Drizzle ORM (listed in AGENTS.md) is deferred. Migrations use **Supabase CLI** (`supabase db push`) for this phase — simpler, no extra dependency. Drizzle can be layered in later if complex queries emerge.

`apps/web/lib/data.ts` → deleted after seed migration.

---

## 6. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     ← server-side only, never public

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=bogdan.mosica@gmail.com
```

---

## 7. Out of Scope (this phase)

- User accounts / multi-tenant properties
- Real-time subscriptions (Supabase Realtime)
- File/photo storage (Supabase Storage)
- Mobile app (`apps/mobile`) — api-client works for it when ready
- HTTP MCP transport
- AI analysis tools in MCP
