# Skill: typescript

House Scout TypeScript conventions. Read before writing any `.ts` / `.tsx` file.

## Strict config

Target `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

`noUncheckedIndexedAccess` means array/object index access returns `T | undefined` — always guard.

## Core types

```ts
// Property — top-level entity
export type PropertyMode = 'rent' | 'buy'
export type PropertyStatus = 'scouted' | 'todo'
export type Tone = 'terra' | 'sage' | 'sky' | 'gold'
export type PropertyType = 'Apartment' | 'House' | 'Condo' | 'Loft' | 'Studio' | 'Townhouse'

export interface Property {
  id: string
  name: string
  address: string
  city: string
  type: PropertyType
  mode: PropertyMode
  price: string
  beds: number
  baths: number
  sqft: number
  rating: number | null   // 1–5, null = not yet scouted
  tone: Tone
  status: PropertyStatus
  highlights: string[]
  notes: string
  createdAt: Date
}

// Question system
export type QuestionKind = 'stars' | 'scale' | 'chips' | 'yesno'
export type RoomId = 'entrance' | 'living' | 'kitchen' | 'bedroom' | 'bath' | 'outdoor' | 'neighbor'

export interface ChipOption { label: string; w: 1 | 2 | 3 | 4 | 5 }

export interface Question {
  id: string
  text: string
  sub?: string
  kind: QuestionKind
  // scale only
  low?: string
  high?: string
  // chips only
  options?: ChipOption[]
  // yesno only
  yesLabel?: string
  noLabel?: string
}

// Answer: index for chips, boolean for yesno, 1-5 for stars/scale
export type AnswerValue = number | boolean

export type Answers = Record<string, AnswerValue>  // key: `${roomId}.${questionId}`

export interface RatingResult {
  overall: number   // 0–5
  answered: number
  total: number
}
```

## Naming conventions

- Components: `PascalCase.tsx` — co-locate styles if needed
- Stores: `use<Name>Store.ts` (Zustand)
- Utilities: `camelCase.ts`
- Types: `types.ts` at feature root or `@/types` for shared

## Component pattern

```tsx
// Props interface always before component
interface QuestionCardProps {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
  index?: number
}

export function QuestionCard({ question, value, onChange, index = 0 }: QuestionCardProps) {
  // ...
}
```

## Discriminated unions for question kinds

```ts
// Narrow by kind before accessing kind-specific fields
function renderAnswer(q: Question, value: AnswerValue | undefined) {
  if (q.kind === 'chips') {
    // q.options is available here — TS knows
    return q.options?.map((o, i) => ...)
  }
  if (q.kind === 'scale') {
    // q.low / q.high available
  }
}
```

## Never use `any`

Use `unknown` for truly unknown data (API responses, JSON.parse), then narrow:
```ts
function parseProperty(raw: unknown): Property {
  // validate with zod or manual checks
}
```

## Async / server patterns (Next.js)

```ts
// Server component — async by default
export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)
  if (!property) notFound()
  return <PropertyDetail property={property} />
}

// Server action
'use server'
export async function saveScoutReport(propertyId: string, answers: Answers) {
  // ...
}
```
