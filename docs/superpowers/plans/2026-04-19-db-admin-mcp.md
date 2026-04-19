# DB + Admin + MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace client-side `data.ts` + localStorage with Supabase Postgres as single source of truth; add a protected admin page to manage questions; expose an MCP server for admin + property queries.

**Architecture:** Supabase hosts Postgres and auto-serves PostgREST. `packages/api-client` wraps `@supabase/supabase-js`. `packages/stores` keeps Zustand for ephemeral scout session state; PropertyStore switches from localStorage-seed to DB-sourced. Admin page at `apps/web/app/admin/questions` uses NextAuth v5 (Google OAuth) + server-side service role key via Server Actions. `packages/mcp-server` is a stdio MCP server with admin tools (service role) and user tools (anon key).

**Tech Stack:** Supabase (Postgres + PostgREST), `@supabase/supabase-js` 2.x, `next-auth@5`, `@modelcontextprotocol/sdk` 1.x, Zod 3.x, `tsx` 4.x, Next.js 16 App Router, TypeScript strict

---

## File Map

### New files
```
supabase/                              Supabase CLI project root
  migrations/
    001_rooms_questions.sql
    002_properties_sessions_answers.sql
    003_rls.sql

packages/db/                           New package — seed script only, no dist
  package.json
  src/seed.ts

packages/api-client/src/
  index.ts                             REPLACE stub — typed Supabase wrapper
  mappers.ts                           DB snake_case ↔ TS camelCase

packages/mcp-server/                   New package
  package.json
  tsconfig.json
  src/
    index.ts                           Entry — McpServer + stdio transport
    client.ts                          Admin + anon Supabase clients
    tools/
      admin.ts                         list/create/update/delete questions
      user.ts                          get_property_report, compare, list

apps/web/
  lib/
    supabase.ts                        Anon client (browser-safe)
    supabase-server.ts                 Server-side clients (anon + service role)
  auth.ts                              NextAuth config
  middleware.ts                        Admin route guard
  app/
    api/auth/[...nextauth]/route.ts    NextAuth handlers
    admin/
      layout.tsx                       Session check — redirect if not admin
      page.tsx                         Redirect → /admin/questions
      questions/
        page.tsx                       Server component — question table
        _components/
          question-form.tsx            Add/edit modal form
          question-row.tsx             Table row with inline actions
        actions.ts                     Server Actions: create/update/delete
```

### Modified files
```
packages/types/src/index.ts            Add DbQuestion, DbProperty, DbAnswer row types
packages/validation/src/index.ts       Add Zod schemas for Question, Property, Answer
packages/stores/src/property-store.ts  Remove initializeWithSeed; add loadFromDb
packages/stores/src/scout-store.ts     endSession flushes answers to DB
apps/web/app/page.tsx                  Load properties from DB (server component)
apps/web/app/scout/[id]/page.tsx       Load questions from DB
apps/web/app/property/[id]/page.tsx    Load property from DB
apps/web/lib/data.ts                   DELETE after seed confirmed
```

---

## Phase 1 — Supabase + Schema

### Task 1: Bootstrap Supabase project

> Manual steps + CLI wiring. No code to write.

**Files:**
- Create: `apps/web/.env.local`

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com/dashboard → New project. Note the project URL and keys from Project Settings → API.

- [ ] **Step 2: Install Supabase CLI at repo root**

```bash
cd /path/to/house-scout
pnpm add -D supabase -w
```

Expected: supabase added to root devDependencies.

- [ ] **Step 3: Init Supabase at repo root**

```bash
npx supabase init
```

Expected: `supabase/` directory created with `config.toml`.

- [ ] **Step 4: Link to your project**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
```

Project ref is the string in your Supabase dashboard URL: `https://supabase.com/dashboard/project/<ref>`.

- [ ] **Step 5: Create env file**

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from dashboard>
SUPABASE_SERVICE_ROLE_KEY=<service role key from dashboard>

# NextAuth (fill in after Task 14)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=bogdan.mosica@gmail.com
```

- [ ] **Step 6: Add .env.local to .gitignore**

```bash
echo "apps/web/.env.local" >> .gitignore
```

- [ ] **Step 7: Commit**

```bash
git add supabase/ .gitignore
git commit -m "chore: init supabase CLI project"
```

---

### Task 2: Schema migration — rooms + questions

**Files:**
- Create: `supabase/migrations/001_rooms_questions.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/001_rooms_questions.sql

CREATE TABLE rooms (
  id         text PRIMARY KEY,
  label      text NOT NULL,
  sort_order integer NOT NULL
);

INSERT INTO rooms VALUES
  ('entrance', 'Entrance',     1),
  ('living',   'Living Room',  2),
  ('kitchen',  'Kitchen',      3),
  ('bedroom',  'Bedrooms',     4),
  ('bath',     'Bathrooms',    5),
  ('outdoor',  'Outdoor',      6),
  ('neighbor', 'Neighborhood', 7);

CREATE TABLE questions (
  id         uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    text    NOT NULL REFERENCES rooms(id),
  kind       text    NOT NULL CHECK (kind IN ('stars','scale','chips','yesno')),
  text       text    NOT NULL,
  sub        text,
  low        text,
  high       text,
  options    jsonb,
  yes_label  text,
  no_label   text,
  banks      text[]  NOT NULL DEFAULT '{"full"}',
  modes      text[]  NOT NULL DEFAULT '{"rent","buy"}',
  sort_order integer NOT NULL DEFAULT 0,
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/001_rooms_questions.sql
git commit -m "feat(db): add rooms and questions schema"
```

---

### Task 3: Schema migration — properties, sessions, answers

**Files:**
- Create: `supabase/migrations/002_properties_sessions_answers.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/002_properties_sessions_answers.sql

CREATE TABLE properties (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  address    text,
  city       text,
  type       text,
  mode       text NOT NULL CHECK (mode IN ('rent','buy')),
  price      text,
  beds       integer,
  baths      numeric,
  sqft       integer,
  rating     numeric CHECK (rating >= 1 AND rating <= 5),
  tone       text CHECK (tone IN ('terra','sage','sky','gold')),
  status     text NOT NULL DEFAULT 'todo' CHECK (status IN ('scouted','todo')),
  highlights text[]      DEFAULT '{}',
  notes      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE scout_sessions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  bank         text NOT NULL CHECK (bank IN ('full','light')),
  mode         text NOT NULL CHECK (mode IN ('rent','buy')),
  current_room text REFERENCES rooms(id),
  started_at   timestamptz NOT NULL DEFAULT now(),
  ended_at     timestamptz
);

CREATE TABLE answers (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid    NOT NULL REFERENCES scout_sessions(id) ON DELETE CASCADE,
  room_id     text    NOT NULL REFERENCES rooms(id),
  question_id uuid    NOT NULL REFERENCES questions(id),
  raw_value   jsonb,
  score       numeric CHECK (score >= 1 AND score <= 5),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, question_id)
);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/002_properties_sessions_answers.sql
git commit -m "feat(db): add properties, scout_sessions, answers schema"
```

---

### Task 4: RLS policies migration

**Files:**
- Create: `supabase/migrations/003_rls.sql`

- [ ] **Step 1: Create migration file**

```sql
-- supabase/migrations/003_rls.sql

ALTER TABLE rooms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties     ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers        ENABLE ROW LEVEL SECURITY;

-- rooms: public read
CREATE POLICY "rooms_read" ON rooms
  FOR SELECT TO anon, authenticated USING (true);

-- questions: public read active only
CREATE POLICY "questions_read_active" ON questions
  FOR SELECT TO anon, authenticated USING (active = true);

-- properties: open read+write (tighten when user accounts land)
CREATE POLICY "properties_read"   ON properties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "properties_insert" ON properties FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "properties_update" ON properties FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "properties_delete" ON properties FOR DELETE TO anon, authenticated USING (true);

-- scout_sessions: open read+write
CREATE POLICY "sessions_read"   ON scout_sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "sessions_insert" ON scout_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "sessions_update" ON scout_sessions FOR UPDATE TO anon, authenticated USING (true);

-- answers: open read+write
CREATE POLICY "answers_read"   ON answers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "answers_insert" ON answers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "answers_update" ON answers FOR UPDATE TO anon, authenticated USING (true);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/003_rls.sql
git commit -m "feat(db): add RLS policies"
```

---

### Task 5: Create packages/db + seed script

**Files:**
- Create: `packages/db/package.json`
- Create: `packages/db/src/seed.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@house-scout/db",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "seed": "tsx src/seed.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.49.4"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create seed script**

This script inserts all questions from `apps/web/lib/data.ts` plus the 5 seed properties. Run it once after migrations are applied.

```typescript
// packages/db/src/seed.ts
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}

const db = createClient(url, key)

// ── Questions ────────────────────────────────────────────────────────────────

const questions = [
  // entrance — full
  { room_id: 'entrance', kind: 'stars',  text: 'How strong is the curb appeal?',       sub: 'Door, entry, hallway first impression', banks: ['full'],         modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'entrance', kind: 'chips',  text: 'How does it smell when you walk in?',  options: [{label:'Fresh & clean',w:5},{label:'Neutral',w:4},{label:'A little musty',w:2},{label:'Strong odors',w:1}], banks: ['full'], modes: ['rent','buy'], sort_order: 2 },
  // entrance — light (same question id 'curb' rephrased for light)
  { room_id: 'entrance', kind: 'stars',  text: 'First impression?', banks: ['light'], modes: ['rent','buy'], sort_order: 3 },
  // entrance — buy extra
  { room_id: 'entrance', kind: 'yesno',  text: 'Any visible structural concerns?', yes_label: 'None visible', no_label: 'Some worry', banks: ['full'], modes: ['buy'], sort_order: 4 },

  // living — full
  { room_id: 'living', kind: 'scale', text: 'Natural light in the main room?', low: 'Dim',      high: 'Radiant',         banks: ['full','light'], modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'living', kind: 'chips', text: 'Does the layout flow well?',      options: [{label:'Intuitive',w:5},{label:'Works fine',w:4},{label:'Awkward spots',w:2},{label:'Choppy',w:1}], banks: ['full'], modes: ['rent','buy'], sort_order: 2 },
  { room_id: 'living', kind: 'chips', text: 'Ceiling height feels…',           options: [{label:'Airy',w:5},{label:'Standard',w:3},{label:'Low',w:2}], banks: ['full'], modes: ['rent','buy'], sort_order: 3 },

  // kitchen — full + light
  { room_id: 'kitchen', kind: 'stars',  text: 'Kitchen condition overall?',        banks: ['full','light'], modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'kitchen', kind: 'chips',  text: 'Appliances included & working?',    options: [{label:'All new',w:5},{label:'Good shape',w:4},{label:'Aging but fine',w:3},{label:'Needs replacing',w:1}], banks: ['full'], modes: ['rent','buy'], sort_order: 2 },
  { room_id: 'kitchen', kind: 'scale',  text: 'Counter & storage space?',          low: 'Cramped', high: 'Generous', banks: ['full'], modes: ['rent','buy'], sort_order: 3 },

  // bedroom — full + light
  { room_id: 'bedroom', kind: 'chips',  text: 'Primary bedroom size?',    options: [{label:'Spacious',w:5},{label:'Comfortable',w:4},{label:'Snug',w:2}], banks: ['full'], modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'bedroom', kind: 'scale',  text: 'How quiet is it?',         low: 'Noisy', high: 'Silent', banks: ['full','light'], modes: ['rent','buy'], sort_order: 2 },
  { room_id: 'bedroom', kind: 'stars',  text: 'Closet / storage situation?', banks: ['full'], modes: ['rent','buy'], sort_order: 3 },

  // bath — full + light
  { room_id: 'bath', kind: 'stars',  text: 'Bathroom condition?',         banks: ['full','light'], modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'bath', kind: 'chips',  text: 'Did you test water pressure?', options: [{label:'Strong',w:5},{label:'Okay',w:3},{label:'Weak',w:1},{label:"Didn't test",w:3}], banks: ['full'], modes: ['rent','buy'], sort_order: 2 },
  { room_id: 'bath', kind: 'yesno',  text: 'Ventilation in the bathroom?', yes_label: 'Has window/fan', no_label: 'Neither', banks: ['full'], modes: ['rent','buy'], sort_order: 3 },

  // outdoor — full + light
  { room_id: 'outdoor', kind: 'chips', text: 'Any outdoor space?', options: [{label:'Private garden',w:5},{label:'Balcony/terrace',w:4},{label:'Shared outdoor',w:3},{label:'None',w:1}], banks: ['full'], modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'outdoor', kind: 'stars', text: 'Rate the view from the main windows', banks: ['full','light'], modes: ['rent','buy'], sort_order: 2 },

  // neighbor — full + light
  { room_id: 'neighbor', kind: 'chips',  text: 'Commute to work/school?',      options: [{label:'Under 20 min',w:5},{label:'20–40 min',w:4},{label:'40–60 min',w:2},{label:'Over an hour',w:1}], banks: ['full'], modes: ['rent','buy'], sort_order: 1 },
  { room_id: 'neighbor', kind: 'scale',  text: 'How walkable is the area?',    low: 'Car-only', high: 'Everything nearby', banks: ['full'], modes: ['rent','buy'], sort_order: 2 },
  { room_id: 'neighbor', kind: 'stars',  text: 'Does the neighborhood vibe fit you?', banks: ['full','light'], modes: ['rent','buy'], sort_order: 3 },
  // neighbor — buy extra
  { room_id: 'neighbor', kind: 'scale',  text: 'Long-term resale prospects?',  low: 'Declining', high: 'Rising', banks: ['full'], modes: ['buy'], sort_order: 4 },
  // neighbor — rent extra
  { room_id: 'neighbor', kind: 'chips',  text: 'Lease flexibility?', options: [{label:'12mo+ renewable',w:5},{label:'Standard 12mo',w:4},{label:'6mo only',w:3},{label:'Month-to-month',w:3}], banks: ['full'], modes: ['rent'], sort_order: 5 },
]

// ── Properties ───────────────────────────────────────────────────────────────

const properties = [
  { name: 'Corner Flat on Maple', address: '412 Maple Ave',    city: 'East Village', type: 'Apartment', mode: 'rent', price: '$2,850/mo', beds: 2, baths: 1, sqft: 860,  rating: 4.4, tone: 'terra', status: 'scouted', highlights: ['Great light','Quiet block','Near park'],          notes: 'Upstairs neighbors felt quiet on a Tuesday afternoon. Kitchen has original hardwood that creaks charmingly.' },
  { name: 'Garden Cottage',       address: '28 Willow Lane',   city: 'Brookside',    type: 'House',     mode: 'buy',  price: '$485,000',  beds: 3, baths: 2, sqft: 1420, rating: 3.8, tone: 'sage', status: 'scouted', highlights: ['Private garden','Needs kitchen work','Owner motivated'], notes: 'Beautiful tree in the backyard. Kitchen cabinets clearly from the 80s — budget $15k for redo.' },
  { name: 'Tower 12B',            address: 'Harborfront Tower',city: 'Downtown',     type: 'Condo',     mode: 'buy',  price: '$612,000',  beds: 1, baths: 1, sqft: 720,  rating: 4.1, tone: 'sky',  status: 'scouted', highlights: ['Skyline view','Building gym','Small bedroom'],          notes: 'View is absurd. Bedroom barely fits a queen — maybe for a single buyer or couple only.' },
  { name: 'Oak Street Loft',      address: '91 Oak St',        city: 'Arts District',type: 'Loft',      mode: 'rent', price: '$3,200/mo', beds: 1, baths: 1, sqft: 1100, rating: 3.5, tone: 'gold', status: 'scouted', highlights: ['High ceilings','Loud neighbors'],                        notes: 'Ceilings felt magical; then a bass line started up next door at 4pm.' },
  { name: 'Linden Cottage',       address: '7 Linden Ct',      city: 'Greenside',    type: 'House',     mode: 'buy',  price: '$520,000',  beds: 3, baths: 2, sqft: 1550, rating: null, tone: 'sage', status: 'todo',    highlights: [],                                                        notes: '' },
]

async function run() {
  console.log('Seeding questions…')
  const { error: qErr } = await db.from('questions').insert(questions)
  if (qErr) { console.error('Questions failed:', qErr.message); process.exit(1) }
  console.log(`  ✓ ${questions.length} questions inserted`)

  console.log('Seeding properties…')
  const { error: pErr } = await db.from('properties').insert(properties)
  if (pErr) { console.error('Properties failed:', pErr.message); process.exit(1) }
  console.log(`  ✓ ${properties.length} properties inserted`)

  console.log('Done.')
}

run()
```

- [ ] **Step 3: Install workspace deps**

```bash
pnpm install
```

- [ ] **Step 4: Commit**

```bash
git add packages/db/
git commit -m "feat(db): add seed script for questions and properties"
```

---

### Task 6: Apply migrations + run seed

**Files:** none (run commands only)

- [ ] **Step 1: Push migrations to Supabase**

```bash
npx supabase db push
```

Expected output: migration files applied in order, no errors.

- [ ] **Step 2: Verify tables exist in Supabase dashboard**

Go to Supabase Dashboard → Table Editor. Confirm: `rooms`, `questions`, `properties`, `scout_sessions`, `answers` all exist with correct columns.

- [ ] **Step 3: Run seed**

From repo root, set env vars and run:

```bash
NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> \
  pnpm --filter @house-scout/db seed
```

Expected:
```
Seeding questions…
  ✓ 23 questions inserted
Seeding properties…
  ✓ 5 properties inserted
Done.
```

- [ ] **Step 4: Verify in Supabase dashboard**

Table Editor → questions: 23 rows. Table Editor → properties: 5 rows.

---

## Phase 2 — Shared Packages

### Task 7: Update packages/types

**Files:**
- Modify: `packages/types/src/index.ts`

- [ ] **Step 1: Add DB row types and insert types**

Open `packages/types/src/index.ts`. Append below the existing exports:

```typescript
// ── DB row types (mirror Postgres schema exactly, snake_case) ─────────────

export interface DbQuestion {
  id: string
  room_id: Room
  kind: QuestionKind
  text: string
  sub: string | null
  low: string | null
  high: string | null
  options: ChipOption[] | null   // jsonb parsed by Supabase client
  yes_label: string | null
  no_label: string | null
  banks: QuestionBank[]
  modes: PropertyMode[]
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface DbProperty {
  id: string
  name: string
  address: string | null
  city: string | null
  type: string | null
  mode: PropertyMode
  price: string | null
  beds: number | null
  baths: number | null
  sqft: number | null
  rating: number | null
  tone: PropertyTone | null
  status: PropertyStatus
  highlights: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DbScoutSession {
  id: string
  property_id: string
  bank: QuestionBank
  mode: PropertyMode
  current_room: Room | null
  started_at: string
  ended_at: string | null
}

export interface DbAnswer {
  id: string
  session_id: string
  room_id: Room
  question_id: string
  raw_value: number | boolean | null
  score: number | null
  created_at: string
}

// Insert types (id + timestamps are DB-generated)
export type DbQuestionInsert = Omit<DbQuestion, 'id' | 'created_at' | 'updated_at'>
export type DbPropertyInsert = Omit<DbProperty, 'id' | 'created_at' | 'updated_at'>
export type DbSessionInsert  = Omit<DbScoutSession, 'id' | 'started_at'>
export type DbAnswerInsert   = Omit<DbAnswer, 'id' | 'created_at'>
```

- [ ] **Step 2: Typecheck**

```bash
pnpm --filter @house-scout/types tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/types/src/index.ts
git commit -m "feat(types): add DB row and insert types"
```

---

### Task 8: Implement packages/validation

**Files:**
- Modify: `packages/validation/src/index.ts`
- Modify: `packages/validation/package.json` (add zod if not a dep yet)

- [ ] **Step 1: Check validation package.json**

```bash
cat packages/validation/package.json
```

Confirm `zod` is in dependencies. If not, run:
```bash
pnpm add zod --filter @house-scout/validation
```

- [ ] **Step 2: Write Zod schemas**

Replace `packages/validation/src/index.ts`:

```typescript
import { z } from 'zod'

export const PropertyModeSchema = z.enum(['rent', 'buy'])
export const PropertyToneSchema = z.enum(['terra', 'sage', 'sky', 'gold'])
export const PropertyStatusSchema = z.enum(['scouted', 'todo'])
export const RoomSchema = z.enum(['entrance','living','kitchen','bedroom','bath','outdoor','neighbor'])
export const QuestionKindSchema = z.enum(['stars','scale','chips','yesno'])
export const QuestionBankSchema = z.enum(['full','light'])

export const ChipOptionSchema = z.object({ label: z.string(), w: z.number() })

export const DbQuestionSchema = z.object({
  id:         z.string().uuid(),
  room_id:    RoomSchema,
  kind:       QuestionKindSchema,
  text:       z.string().min(1),
  sub:        z.string().nullable(),
  low:        z.string().nullable(),
  high:       z.string().nullable(),
  options:    z.array(ChipOptionSchema).nullable(),
  yes_label:  z.string().nullable(),
  no_label:   z.string().nullable(),
  banks:      z.array(QuestionBankSchema),
  modes:      z.array(PropertyModeSchema),
  sort_order: z.number().int(),
  active:     z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const DbPropertySchema = z.object({
  id:         z.string().uuid(),
  name:       z.string().min(1),
  address:    z.string().nullable(),
  city:       z.string().nullable(),
  type:       z.string().nullable(),
  mode:       PropertyModeSchema,
  price:      z.string().nullable(),
  beds:       z.number().int().nullable(),
  baths:      z.number().nullable(),
  sqft:       z.number().int().nullable(),
  rating:     z.number().min(1).max(5).nullable(),
  tone:       PropertyToneSchema.nullable(),
  status:     PropertyStatusSchema,
  highlights: z.array(z.string()),
  notes:      z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const DbAnswerSchema = z.object({
  id:          z.string().uuid(),
  session_id:  z.string().uuid(),
  room_id:     RoomSchema,
  question_id: z.string().uuid(),
  raw_value:   z.union([z.number(), z.boolean(), z.null()]),
  score:       z.number().min(1).max(5).nullable(),
  created_at:  z.string(),
})

export type ValidatedQuestion = z.infer<typeof DbQuestionSchema>
export type ValidatedProperty = z.infer<typeof DbPropertySchema>
export type ValidatedAnswer   = z.infer<typeof DbAnswerSchema>
```

- [ ] **Step 3: Typecheck**

```bash
pnpm --filter @house-scout/validation tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/validation/
git commit -m "feat(validation): add Zod schemas for DB entities"
```

---

### Task 9: Implement packages/api-client

**Files:**
- Modify: `packages/api-client/package.json`
- Create: `packages/api-client/src/mappers.ts`
- Modify: `packages/api-client/src/index.ts`

- [ ] **Step 1: Add supabase-js dependency**

```bash
pnpm add @supabase/supabase-js --filter @house-scout/api-client
```

Also add peer:
```bash
pnpm add @house-scout/types @house-scout/validation --filter @house-scout/api-client
```

- [ ] **Step 2: Create mappers.ts**

```typescript
// packages/api-client/src/mappers.ts
import type { DbQuestion, DbProperty, Question, Property } from '@house-scout/types'

export function mapQuestion(db: DbQuestion): Question {
  return {
    id:       db.id,
    room:     db.room_id,
    kind:     db.kind,
    text:     db.text,
    sub:      db.sub ?? undefined,
    low:      db.low ?? undefined,
    high:     db.high ?? undefined,
    options:  db.options ?? undefined,
    yesLabel: db.yes_label ?? undefined,
    noLabel:  db.no_label ?? undefined,
    modes:    db.modes,
    banks:    db.banks,
  }
}

export function mapProperty(db: DbProperty): Property {
  return {
    id:        db.id,
    name:      db.name,
    address:   db.address ?? '',
    city:      db.city ?? '',
    type:      db.type ?? '',
    mode:      db.mode,
    price:     db.price ?? '',
    beds:      db.beds ?? 0,
    baths:     db.baths ?? 0,
    sqft:      db.sqft ?? 0,
    rating:    db.rating,
    tone:      db.tone ?? 'terra',
    status:    db.status,
    highlights: db.highlights,
    notes:     db.notes ?? '',
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}
```

- [ ] **Step 3: Implement index.ts**

```typescript
// packages/api-client/src/index.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type {
  Question, Property, DbQuestion, DbProperty,
  DbPropertyInsert, DbSessionInsert, DbAnswerInsert,
  QuestionBank, PropertyMode, Room,
} from '@house-scout/types'
import { mapQuestion, mapProperty } from './mappers.js'

export { mapQuestion, mapProperty }

export function createAnonClient(url: string, anonKey: string) {
  return buildClient(createClient(url, anonKey))
}

export function createAdminClient(url: string, serviceRoleKey: string) {
  return buildClient(createClient(url, serviceRoleKey))
}

function buildClient(client: SupabaseClient) {
  return {
    questions: {
      async list(bank?: QuestionBank, mode?: PropertyMode, room?: Room): Promise<Question[]> {
        let q = client.from('questions').select('*').eq('active', true).order('sort_order')
        if (bank) q = q.contains('banks', [bank])
        if (mode) q = q.contains('modes', [mode])
        if (room) q = q.eq('room_id', room)
        const { data, error } = await q
        if (error) throw new Error(error.message)
        return (data as DbQuestion[]).map(mapQuestion)
      },
      async listRaw(opts?: { includeInactive?: boolean; bank?: QuestionBank; mode?: PropertyMode; room?: Room }): Promise<DbQuestion[]> {
        let q = client.from('questions').select('*').order('room_id').order('sort_order')
        if (!opts?.includeInactive) q = q.eq('active', true)
        if (opts?.bank) q = q.contains('banks', [opts.bank])
        if (opts?.mode) q = q.contains('modes', [opts.mode])
        if (opts?.room) q = q.eq('room_id', opts.room)
        const { data, error } = await q
        if (error) throw new Error(error.message)
        return data as DbQuestion[]
      },
      async create(row: Omit<DbQuestion, 'id'|'created_at'|'updated_at'>): Promise<DbQuestion> {
        const { data, error } = await client.from('questions').insert(row).select().single()
        if (error) throw new Error(error.message)
        return data as DbQuestion
      },
      async update(id: string, patch: Partial<Omit<DbQuestion, 'id'|'created_at'|'updated_at'>>): Promise<DbQuestion> {
        const { data, error } = await client.from('questions').update(patch).eq('id', id).select().single()
        if (error) throw new Error(error.message)
        return data as DbQuestion
      },
      async softDelete(id: string): Promise<void> {
        const { error } = await client.from('questions').update({ active: false }).eq('id', id)
        if (error) throw new Error(error.message)
      },
      async hardDelete(id: string): Promise<void> {
        const { error } = await client.from('questions').delete().eq('id', id)
        if (error) throw new Error(error.message)
      },
    },

    properties: {
      async list(): Promise<Property[]> {
        const { data, error } = await client.from('properties').select('*').order('created_at', { ascending: false })
        if (error) throw new Error(error.message)
        return (data as DbProperty[]).map(mapProperty)
      },
      async get(id: string): Promise<Property> {
        const { data, error } = await client.from('properties').select('*').eq('id', id).single()
        if (error) throw new Error(error.message)
        return mapProperty(data as DbProperty)
      },
      async create(row: DbPropertyInsert): Promise<Property> {
        const { data, error } = await client.from('properties').insert(row).select().single()
        if (error) throw new Error(error.message)
        return mapProperty(data as DbProperty)
      },
      async update(id: string, patch: Partial<DbPropertyInsert>): Promise<Property> {
        const { data, error } = await client.from('properties').update(patch).eq('id', id).select().single()
        if (error) throw new Error(error.message)
        return mapProperty(data as DbProperty)
      },
      async delete(id: string): Promise<void> {
        const { error } = await client.from('properties').delete().eq('id', id)
        if (error) throw new Error(error.message)
      },
    },

    sessions: {
      async create(row: DbSessionInsert): Promise<{ id: string }> {
        const { data, error } = await client.from('scout_sessions').insert(row).select('id').single()
        if (error) throw new Error(error.message)
        return data as { id: string }
      },
      async end(id: string): Promise<void> {
        const { error } = await client.from('scout_sessions').update({ ended_at: new Date().toISOString() }).eq('id', id)
        if (error) throw new Error(error.message)
      },
    },

    answers: {
      async upsertMany(rows: DbAnswerInsert[]): Promise<void> {
        const { error } = await client.from('answers').upsert(rows, { onConflict: 'session_id,question_id' })
        if (error) throw new Error(error.message)
      },
      async listBySession(sessionId: string) {
        const { data, error } = await client.from('answers').select('*').eq('session_id', sessionId)
        if (error) throw new Error(error.message)
        return data
      },
    },
  }
}
```

- [ ] **Step 4: Typecheck**

```bash
pnpm --filter @house-scout/api-client tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/api-client/
git commit -m "feat(api-client): implement typed Supabase wrapper with mappers"
```

---

## Phase 3 — Web Integration

### Task 10: Add Supabase clients to apps/web

**Files:**
- Create: `apps/web/lib/supabase.ts`
- Create: `apps/web/lib/supabase-server.ts`
- Modify: `apps/web/package.json` (add @supabase/supabase-js + @house-scout/api-client)

- [ ] **Step 1: Add dependencies**

```bash
pnpm add @supabase/supabase-js @house-scout/api-client --filter @house-scout/web
```

- [ ] **Step 2: Create browser client**

```typescript
// apps/web/lib/supabase.ts
import { createAnonClient } from '@house-scout/api-client'

export const api = createAnonClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

- [ ] **Step 3: Create server-side clients**

```typescript
// apps/web/lib/supabase-server.ts
import { createAnonClient, createAdminClient } from '@house-scout/api-client'

export function getServerApi() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function getAdminApi() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 4: Typecheck**

```bash
pnpm --filter @house-scout/web tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib/supabase.ts apps/web/lib/supabase-server.ts apps/web/package.json
git commit -m "feat(web): add Supabase client wrappers"
```

---

### Task 11: Update PropertyStore + wire up pages

**Files:**
- Modify: `packages/stores/src/property-store.ts`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/app/property/[id]/page.tsx`
- Modify: `apps/web/app/scout/[id]/page.tsx`

- [ ] **Step 1: Remove localStorage seed from PropertyStore**

Replace `packages/stores/src/property-store.ts`:

```typescript
import { create } from 'zustand'
import type { Property } from '@house-scout/types'

interface PropertyState {
  properties: Property[]
  setProperties: (ps: Property[]) => void
  addProperty: (p: Property) => void
  updateProperty: (id: string, updates: Partial<Property>) => void
  deleteProperty: (id: string) => void
  setRating: (id: string, rating: number) => void
}

export const usePropertyStore = create<PropertyState>()((set) => ({
  properties: [],
  setProperties: (ps) => set({ properties: ps }),
  addProperty: (p) => set((s) => ({ properties: [...s.properties, p] })),
  updateProperty: (id, updates) =>
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),
  deleteProperty: (id) => set((s) => ({ properties: s.properties.filter((p) => p.id !== id) })),
  setRating: (id, rating) =>
    set((s) => ({
      properties: s.properties.map((p) =>
        p.id === id
          ? { ...p, rating, status: 'scouted' as const, updatedAt: new Date().toISOString() }
          : p
      ),
    })),
}))
```

Note: `persist` middleware removed — properties now come from DB. `initializeWithSeed` removed. `setProperties` added for server-fetched data.

- [ ] **Step 2: Update Home page to fetch from DB**

Read current `apps/web/app/page.tsx`. Replace the seed initialization with a server-side DB fetch. The page is a server component — fetch properties at the top:

```typescript
// apps/web/app/page.tsx  (server component — keep existing UI, replace data source)
import { getServerApi } from '@/lib/supabase-server'
// ... existing imports

export default async function HomePage() {
  const api = getServerApi()
  const properties = await api.properties.list()
  // pass `properties` to existing UI components — replace wherever SEED_PROPERTIES was used
  // ...
}
```

Read the existing file first, then make the minimal change: replace `SEED_PROPERTIES` import + `initializeWithSeed` call with the DB fetch shown above.

- [ ] **Step 3: Update Property Detail page**

Read `apps/web/app/property/[id]/page.tsx`. Replace any local-data lookup with:

```typescript
const api = getServerApi()
const property = await api.properties.get(params.id)
```

- [ ] **Step 4: Update Scout page**

Read `apps/web/app/scout/[id]/page.tsx`. Replace `getQuestions` import from `data.ts` with:

```typescript
const api = getServerApi()
const [property, questions] = await Promise.all([
  api.properties.get(params.id),
  api.questions.list(bank, mode),  // bank/mode from search params or property
])
```

- [ ] **Step 5: Typecheck**

```bash
pnpm --filter @house-scout/web tsc --noEmit
pnpm --filter @house-scout/stores tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Start dev server and verify home page loads from DB**

```bash
pnpm --filter @house-scout/web dev
```

Open http://localhost:3000. Confirm 5 properties appear (from DB, not seed).

- [ ] **Step 7: Delete data.ts**

```bash
rm apps/web/lib/data.ts
```

Fix any remaining import errors. Re-run typecheck:

```bash
pnpm --filter @house-scout/web tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add packages/stores/ apps/web/
git commit -m "feat: load properties and questions from DB, remove data.ts"
```

---

### Task 12: Update ScoutStore to flush answers to DB

**Files:**
- Modify: `packages/stores/src/scout-store.ts`
- Modify: `packages/stores/package.json`

> The scout session stays in-memory during the walkthrough for performance. On `endSession`, answers flush to DB.

- [ ] **Step 1: Add api-client dep to stores package**

```bash
pnpm add @house-scout/api-client --filter @house-scout/stores
```

- [ ] **Step 2: Update scout-store.ts**

Replace `packages/stores/src/scout-store.ts`:

```typescript
import { create } from 'zustand'
import type { ScoutSession, Room, QuestionBank, PropertyMode, AnswerRaw } from '@house-scout/types'
import { createAnonClient } from '@house-scout/api-client'

interface ScoutState {
  session: ScoutSession | null
  sessionId: string | null           // DB row id, set after session created in DB
  startSession: (propertyId: string, mode: PropertyMode, bank?: QuestionBank) => Promise<void>
  setAnswer: (roomId: Room, questionId: string, raw: AnswerRaw) => void
  setCurrentRoom: (room: Room) => void
  endSession: () => Promise<void>
}

function getApi() {
  return createAnonClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!
  )
}

export const useScoutStore = create<ScoutState>()((set, get) => ({
  session: null,
  sessionId: null,

  startSession: async (propertyId, mode, bank = 'full') => {
    const api = getApi()
    const { id } = await api.sessions.create({ property_id: propertyId, bank, mode, current_room: 'entrance', ended_at: null })
    set({
      sessionId: id,
      session: { propertyId, bank, mode, answers: {}, currentRoom: 'entrance', startedAt: new Date().toISOString() },
    })
  },

  setAnswer: (roomId, questionId, raw) =>
    set((s) => {
      if (!s.session) return s
      return { session: { ...s.session, answers: { ...s.session.answers, [`${roomId}.${questionId}`]: raw } } }
    }),

  setCurrentRoom: (room) =>
    set((s) => (s.session ? { session: { ...s.session, currentRoom: room } } : s)),

  endSession: async () => {
    const { session, sessionId } = get()
    if (!session || !sessionId) return

    const api = getApi()
    const rows = Object.entries(session.answers)
      .filter(([, raw]) => raw !== null)
      .map(([key, raw]) => {
        const [roomId, questionId] = key.split('.')
        const score = typeof raw === 'boolean' ? (raw ? 5 : 1) : (raw as number)
        return { session_id: sessionId, room_id: roomId, question_id: questionId, raw_value: raw, score }
      })

    await api.answers.upsertMany(rows)
    await api.sessions.end(sessionId)
    set({ session: null, sessionId: null })
  },
}))
```

Note: question IDs in the answer keys are now DB UUIDs (loaded from DB). No mapping needed. Call sites just call `endSession()` with no args.

- [ ] **Step 3: Update call sites of endSession**

Find all `endSession(` calls in `apps/web/`:

```bash
grep -r "endSession(" apps/web/
```

Remove any arguments — signature is now `endSession()`. Example: `endSession(questionMap)` → `endSession()`.

- [ ] **Step 4: Typecheck**

```bash
pnpm typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/stores/
git commit -m "feat(stores): ScoutStore flushes answers to DB on session end"
```

---

## Phase 4 — Admin Page

### Task 13: Install + configure NextAuth v5

**Files:**
- Create: `apps/web/auth.ts`
- Create: `apps/web/middleware.ts`
- Create: `apps/web/app/api/auth/[...nextauth]/route.ts`
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install next-auth v5**

```bash
pnpm add next-auth@5 --filter @house-scout/web
```

- [ ] **Step 2: Create auth.ts**

```typescript
// apps/web/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})
```

- [ ] **Step 3: Create middleware.ts**

```typescript
// apps/web/middleware.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  if (!isAdminRoute) return NextResponse.next()

  const email = req.auth?.user?.email
  const isAdmin = email === process.env.ADMIN_EMAIL

  if (!isAdmin) {
    const signInUrl = new URL('/api/auth/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 4: Create NextAuth route handler**

```typescript
// apps/web/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 5: Set up Google OAuth**

Go to https://console.cloud.google.com → Credentials → Create OAuth 2.0 Client.
- Authorized origin: `http://localhost:3000`
- Authorized redirect: `http://localhost:3000/api/auth/callback/google`

Copy Client ID and Secret into `.env.local`. Also add:
```
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
```

- [ ] **Step 6: Test auth redirect**

```bash
pnpm --filter @house-scout/web dev
```

Visit http://localhost:3000/admin — should redirect to Google sign-in. Sign in with bogdan.mosica@gmail.com — should proceed (or 404 since admin page not built yet, that's fine).

- [ ] **Step 7: Commit**

```bash
git add apps/web/auth.ts apps/web/middleware.ts apps/web/app/api/auth/
git commit -m "feat(web): add NextAuth v5 Google OAuth with admin gate"
```

---

### Task 14: Admin layout + questions page + Server Actions

**Files:**
- Create: `apps/web/app/admin/layout.tsx`
- Create: `apps/web/app/admin/page.tsx`
- Create: `apps/web/app/admin/questions/page.tsx`
- Create: `apps/web/app/admin/questions/_components/question-form.tsx`
- Create: `apps/web/app/admin/questions/_components/question-row.tsx`
- Create: `apps/web/app/admin/questions/actions.ts`

- [ ] **Step 1: Create admin layout**

```typescript
// apps/web/app/admin/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect('/api/auth/signin')
  }
  return (
    <div style={{ fontFamily: 'var(--font-inter)', padding: '2rem', maxWidth: 960, margin: '0 auto' }}>
      <nav style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong style={{ color: 'var(--ink)' }}>House Scout Admin</strong>
        <a href="/admin/questions" style={{ color: 'var(--accent)' }}>Questions</a>
      </nav>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create admin index redirect**

```typescript
// apps/web/app/admin/page.tsx
import { redirect } from 'next/navigation'
export default function AdminPage() {
  redirect('/admin/questions')
}
```

- [ ] **Step 3: Create Server Actions**

```typescript
// apps/web/app/admin/questions/actions.ts
'use server'
import { revalidatePath } from 'next/cache'
import { getAdminApi } from '@/lib/supabase-server'
import type { DbQuestion } from '@house-scout/types'

type QuestionPatch = Partial<Omit<DbQuestion, 'id' | 'created_at' | 'updated_at'>>

export async function createQuestion(data: Omit<DbQuestion, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
  const api = getAdminApi()
  await api.questions.create(data)
  revalidatePath('/admin/questions')
}

export async function updateQuestion(id: string, data: QuestionPatch): Promise<void> {
  const api = getAdminApi()
  await api.questions.update(id, data)
  revalidatePath('/admin/questions')
}

export async function softDeleteQuestion(id: string): Promise<void> {
  const api = getAdminApi()
  await api.questions.softDelete(id)
  revalidatePath('/admin/questions')
}

export async function hardDeleteQuestion(id: string): Promise<void> {
  const api = getAdminApi()
  await api.questions.hardDelete(id)
  revalidatePath('/admin/questions')
}

export async function toggleActive(id: string, active: boolean): Promise<void> {
  const api = getAdminApi()
  await api.questions.update(id, { active })
  revalidatePath('/admin/questions')
}
```

- [ ] **Step 4: Create question-row component**

```typescript
// apps/web/app/admin/questions/_components/question-row.tsx
'use client'
import type { DbQuestion } from '@house-scout/types'
import { toggleActive, softDeleteQuestion } from '../actions'

export function QuestionRow({ q }: { q: DbQuestion }) {
  return (
    <tr style={{ opacity: q.active ? 1 : 0.45, borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--ink-2)' }}>{q.room_id}</td>
      <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>{q.kind}</td>
      <td style={{ padding: '0.5rem 0.75rem' }}>{q.text}</td>
      <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>{q.banks.join(', ')}</td>
      <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>{q.modes.join(', ')}</td>
      <td style={{ padding: '0.5rem 0.75rem' }}>
        <button
          onClick={() => toggleActive(q.id, !q.active)}
          style={{ background: q.active ? 'var(--accent)' : '#ccc', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
        >
          {q.active ? 'on' : 'off'}
        </button>
      </td>
      <td style={{ padding: '0.5rem 0.75rem' }}>
        <button
          onClick={() => { if (confirm('Soft delete this question?')) softDeleteQuestion(q.id) }}
          style={{ background: 'none', border: '1px solid #ccc', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
        >
          delete
        </button>
      </td>
    </tr>
  )
}
```

- [ ] **Step 5: Create question-form component**

```typescript
// apps/web/app/admin/questions/_components/question-form.tsx
'use client'
import { useState } from 'react'
import type { DbQuestion } from '@house-scout/types'
import { createQuestion } from '../actions'

const ROOMS = ['entrance','living','kitchen','bedroom','bath','outdoor','neighbor'] as const
const KINDS = ['stars','scale','chips','yesno'] as const

export function AddQuestionButton() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<DbQuestion>>({
    room_id: 'entrance', kind: 'stars', banks: ['full'], modes: ['rent','buy'],
    sort_order: 0, active: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.text || !form.room_id || !form.kind) return
    await createQuestion(form as Omit<DbQuestion, 'id'|'created_at'|'updated_at'>)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        + Add question
      </button>

      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <form onSubmit={handleSubmit} style={{ background: 'var(--bg)', borderRadius: 16, padding: '2rem', width: 480, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-fraunces)', color: 'var(--ink)' }}>New Question</h2>

            <label>Room
              <select value={form.room_id} onChange={e => setForm(f => ({...f, room_id: e.target.value as DbQuestion['room_id']}))} style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)' }}>
                {ROOMS.map(r => <option key={r}>{r}</option>)}
              </select>
            </label>

            <label>Kind
              <select value={form.kind} onChange={e => setForm(f => ({...f, kind: e.target.value as DbQuestion['kind']}))} style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)' }}>
                {KINDS.map(k => <option key={k}>{k}</option>)}
              </select>
            </label>

            <label>Question text
              <input required value={form.text ?? ''} onChange={e => setForm(f => ({...f, text: e.target.value}))} style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>

            <label>Sub-text (optional)
              <input value={form.sub ?? ''} onChange={e => setForm(f => ({...f, sub: e.target.value || null}))} style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>

            <label>Banks (comma-separated: full, light)
              <input value={(form.banks ?? []).join(',')} onChange={e => setForm(f => ({...f, banks: e.target.value.split(',').map(s => s.trim()) as DbQuestion['banks']}))} style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>

            <label>Modes (comma-separated: rent, buy)
              <input value={(form.modes ?? []).join(',')} onChange={e => setForm(f => ({...f, modes: e.target.value.split(',').map(s => s.trim()) as DbQuestion['modes']}))} style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid var(--border)', background: 'none', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: 8, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 6: Create questions page**

```typescript
// apps/web/app/admin/questions/page.tsx
import { getAdminApi } from '@/lib/supabase-server'
import type { DbQuestion } from '@house-scout/types'
import { QuestionRow } from './_components/question-row'
import { AddQuestionButton } from './_components/question-form'

const ROOMS = ['entrance','living','kitchen','bedroom','bath','outdoor','neighbor']

export default async function QuestionsPage() {
  const api = getAdminApi()
  const questions = await api.questions.listRaw({ includeInactive: true })

  const byRoom = ROOMS.reduce<Record<string, DbQuestion[]>>((acc, r) => {
    acc[r] = questions.filter(q => q.room_id === r)
    return acc
  }, {})

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-fraunces)', color: 'var(--ink)', fontSize: '1.5rem' }}>Questions</h1>
        <AddQuestionButton />
      </div>

      {ROOMS.map(room => (
        <section key={room} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>{room}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)', color: 'var(--ink-2)', fontSize: '0.75rem' }}>
                <th style={{ padding: '0.25rem 0.75rem' }}>room</th>
                <th style={{ padding: '0.25rem 0.75rem' }}>kind</th>
                <th style={{ padding: '0.25rem 0.75rem' }}>text</th>
                <th style={{ padding: '0.25rem 0.75rem' }}>banks</th>
                <th style={{ padding: '0.25rem 0.75rem' }}>modes</th>
                <th style={{ padding: '0.25rem 0.75rem' }}>active</th>
                <th style={{ padding: '0.25rem 0.75rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {byRoom[room]?.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '0.5rem 0.75rem', color: 'var(--ink-2)' }}>No questions</td></tr>
              )}
              {byRoom[room]?.map(q => <QuestionRow key={q.id} q={q} />)}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 7: Start dev server and verify admin page**

```bash
pnpm --filter @house-scout/web dev
```

Visit http://localhost:3000/admin/questions after signing in. Confirm: question table loads with 23 rows grouped by room. Add a question via the modal. Toggle active. Delete.

- [ ] **Step 8: Typecheck**

```bash
pnpm --filter @house-scout/web tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add apps/web/app/admin/
git commit -m "feat(web): add admin questions page with NextAuth guard and Server Actions"
```

---

## Phase 5 — MCP Server

### Task 15: Create packages/mcp-server

**Files:**
- Create: `packages/mcp-server/package.json`
- Create: `packages/mcp-server/tsconfig.json`
- Create: `packages/mcp-server/src/client.ts`
- Create: `packages/mcp-server/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@house-scout/mcp-server",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "bin": {
    "house-scout-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@house-scout/api-client": "workspace:*",
    "@house-scout/types": "workspace:*",
    "@modelcontextprotocol/sdk": "^1.10.2",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "tsx": "^4.19.2",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create client.ts**

```typescript
// packages/mcp-server/src/client.ts
import { createAnonClient, createAdminClient } from '@house-scout/api-client'

const url = process.env['SUPABASE_URL'] ?? process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? ''
const anonKey = process.env['SUPABASE_ANON_KEY'] ?? process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? ''
const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? ''

if (!url) throw new Error('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL required')
if (!anonKey) throw new Error('SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY required')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY required')

export const anonApi = createAnonClient(url, anonKey)
export const adminApi = createAdminClient(url, serviceKey)
```

- [ ] **Step 4: Install deps**

```bash
pnpm install
```

- [ ] **Step 5: Commit**

```bash
git add packages/mcp-server/
git commit -m "feat(mcp-server): scaffold MCP server package"
```

---

### Task 16: Admin + user MCP tools

**Files:**
- Create: `packages/mcp-server/src/tools/admin.ts`
- Create: `packages/mcp-server/src/tools/user.ts`
- Create: `packages/mcp-server/src/index.ts`

- [ ] **Step 1: Create admin tools**

```typescript
// packages/mcp-server/src/tools/admin.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { adminApi } from '../client.js'

const RoomEnum = z.enum(['entrance','living','kitchen','bedroom','bath','outdoor','neighbor'])
const KindEnum = z.enum(['stars','scale','chips','yesno'])
const BankEnum = z.enum(['full','light'])
const ModeEnum = z.enum(['rent','buy'])

export function registerAdminTools(server: McpServer) {
  server.tool(
    'list_questions',
    {
      bank:             BankEnum.optional(),
      mode:             ModeEnum.optional(),
      room:             RoomEnum.optional(),
      include_inactive: z.boolean().optional(),
    },
    async ({ bank, mode, room, include_inactive }) => {
      const questions = await adminApi.questions.listRaw({ bank, mode, room, includeInactive: include_inactive })
      return { content: [{ type: 'text' as const, text: JSON.stringify(questions, null, 2) }] }
    }
  )

  server.tool(
    'create_question',
    {
      room_id:    RoomEnum,
      kind:       KindEnum,
      text:       z.string().min(1),
      sub:        z.string().optional(),
      low:        z.string().optional(),
      high:       z.string().optional(),
      yes_label:  z.string().optional(),
      no_label:   z.string().optional(),
      banks:      z.array(BankEnum).default(['full']),
      modes:      z.array(ModeEnum).default(['rent','buy']),
      sort_order: z.number().int().default(0),
    },
    async (input) => {
      const question = await adminApi.questions.create({
        ...input,
        sub:       input.sub ?? null,
        low:       input.low ?? null,
        high:      input.high ?? null,
        yes_label: input.yes_label ?? null,
        no_label:  input.no_label ?? null,
        options:   null,
        active:    true,
      })
      return { content: [{ type: 'text' as const, text: JSON.stringify(question, null, 2) }] }
    }
  )

  server.tool(
    'update_question',
    {
      id:         z.string().uuid(),
      text:       z.string().optional(),
      sub:        z.string().nullable().optional(),
      active:     z.boolean().optional(),
      sort_order: z.number().int().optional(),
      banks:      z.array(BankEnum).optional(),
      modes:      z.array(ModeEnum).optional(),
    },
    async ({ id, ...patch }) => {
      const question = await adminApi.questions.update(id, patch)
      return { content: [{ type: 'text' as const, text: JSON.stringify(question, null, 2) }] }
    }
  )

  server.tool(
    'delete_question',
    {
      id:   z.string().uuid(),
      hard: z.boolean().default(false).describe('true = permanent delete, false = soft delete (active=false)'),
    },
    async ({ id, hard }) => {
      if (hard) {
        await adminApi.questions.hardDelete(id)
        return { content: [{ type: 'text' as const, text: `Question ${id} permanently deleted.` }] }
      }
      await adminApi.questions.softDelete(id)
      return { content: [{ type: 'text' as const, text: `Question ${id} deactivated.` }] }
    }
  )
}
```

- [ ] **Step 2: Create user tools**

```typescript
// packages/mcp-server/src/tools/user.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { anonApi } from '../client.js'

export function registerUserTools(server: McpServer) {
  server.tool(
    'list_properties',
    { status: z.enum(['scouted','todo','all']).default('all') },
    async ({ status }) => {
      const all = await anonApi.properties.list()
      const filtered = status === 'all' ? all : all.filter(p => p.status === status)
      return { content: [{ type: 'text' as const, text: JSON.stringify(filtered, null, 2) }] }
    }
  )

  server.tool(
    'get_property_report',
    { id: z.string().uuid() },
    async ({ id }) => {
      const property = await anonApi.properties.get(id)
      // get answers for most recent session
      // For now, return property data — extend when session queries are needed
      return { content: [{ type: 'text' as const, text: JSON.stringify(property, null, 2) }] }
    }
  )

  server.tool(
    'get_property_notes',
    { id: z.string().uuid() },
    async ({ id }) => {
      const property = await anonApi.properties.get(id)
      const result = {
        id: property.id,
        name: property.name,
        rating: property.rating,
        highlights: property.highlights,
        notes: property.notes,
      }
      return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'compare_properties',
    { ids: z.array(z.string().uuid()).min(2).max(5) },
    async ({ ids }) => {
      const properties = await Promise.all(ids.map(id => anonApi.properties.get(id)))
      const comparison = properties.map(p => ({
        id: p.id, name: p.name, rating: p.rating, mode: p.mode,
        price: p.price, beds: p.beds, baths: p.baths, sqft: p.sqft,
        highlights: p.highlights, status: p.status,
      }))
      return { content: [{ type: 'text' as const, text: JSON.stringify(comparison, null, 2) }] }
    }
  )
}
```

- [ ] **Step 3: Create index.ts**

```typescript
// packages/mcp-server/src/index.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerAdminTools } from './tools/admin.js'
import { registerUserTools } from './tools/user.js'

const server = new McpServer({
  name: 'house-scout',
  version: '0.1.0',
})

registerAdminTools(server)
registerUserTools(server)

const transport = new StdioServerTransport()
await server.connect(transport)
```

- [ ] **Step 4: Build and typecheck**

```bash
pnpm --filter @house-scout/mcp-server build
```

Expected: `dist/` directory with compiled JS, no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/mcp-server/src/
git commit -m "feat(mcp-server): add admin and user tools"
```

---

### Task 17: Register MCP server in Claude Code

**Files:**
- Modify: `.claude/settings.json` (or create if absent)

- [ ] **Step 1: Build the MCP server**

```bash
pnpm --filter @house-scout/mcp-server build
```

- [ ] **Step 2: Add env vars to a local env file**

Create `packages/mcp-server/.env` (gitignored):
```
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

Add to `.gitignore`:
```
packages/mcp-server/.env
```

- [ ] **Step 3: Register in .claude/settings.json**

Open or create `.claude/settings.json`. Add the mcpServers entry:

```json
{
  "mcpServers": {
    "house-scout": {
      "command": "node",
      "args": ["packages/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_URL": "<your url>",
        "SUPABASE_ANON_KEY": "<your anon key>",
        "SUPABASE_SERVICE_ROLE_KEY": "<your service role key>"
      }
    }
  }
}
```

- [ ] **Step 4: Restart Claude Code and verify tools**

In Claude Code, run:
```
/mcp
```

Expected: `house-scout` server listed with tools: `list_questions`, `create_question`, `update_question`, `delete_question`, `list_properties`, `get_property_report`, `get_property_notes`, `compare_properties`.

- [ ] **Step 5: Smoke-test a tool**

Ask Claude Code: "List all active questions for the full bank"

Expected: JSON list of 23 questions.

- [ ] **Step 6: Final commit**

```bash
git add packages/mcp-server/ .gitignore
git commit -m "feat(mcp-server): register MCP server in Claude Code settings"
```

---

## Phase Summary

| Phase | Tasks | Deliverable |
|-------|-------|-------------|
| 1 — DB | 1–6 | Supabase project, 3 migrations, RLS, seed |
| 2 — Packages | 7–9 | Updated types, Zod schemas, full api-client |
| 3 — Web | 10–12 | Pages load from DB, stores sync to DB, data.ts deleted |
| 4 — Admin | 13–14 | /admin/questions with Google OAuth + full CRUD |
| 5 — MCP | 15–17 | stdio MCP server with 8 tools, registered in Claude Code |
