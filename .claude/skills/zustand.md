# Skill: zustand

Zustand state management patterns for House Scout. Read before creating or editing any store.

## Store structure

One store per feature domain. House Scout has two:

```
src/stores/
  usePropertyStore.ts   — property list, active property, CRUD
  useScoutStore.ts      — active scout session (room progress, answers, mode)
```

## Standard store template

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface PropertyState {
  properties: Property[]
  activePropertyId: string | null
  // actions
  addProperty: (p: Omit<Property, 'id' | 'createdAt'>) => void
  updateProperty: (id: string, patch: Partial<Property>) => void
  removeProperty: (id: string) => void
  setActive: (id: string | null) => void
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      properties: [],
      activePropertyId: null,

      addProperty: (p) => set((s) => ({
        properties: [
          ...s.properties,
          { ...p, id: crypto.randomUUID(), createdAt: new Date() },
        ],
      })),

      updateProperty: (id, patch) => set((s) => ({
        properties: s.properties.map((p) => p.id === id ? { ...p, ...patch } : p),
      })),

      removeProperty: (id) => set((s) => ({
        properties: s.properties.filter((p) => p.id !== id),
      })),

      setActive: (id) => set({ activePropertyId: id }),
    }),
    {
      name: 'house-scout-properties',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

## Scout session store (no persistence — ephemeral per visit)

```ts
interface ScoutState {
  propertyId: string | null
  mode: PropertyMode
  roomIdx: number
  answers: Answers
  screen: 'tour' | 'result'
  // actions
  startScout: (propertyId: string, mode: PropertyMode) => void
  setAnswer: (roomId: RoomId, questionId: string, value: AnswerValue) => void
  goToRoom: (idx: number) => void
  finishScout: () => void
  resetScout: () => void
}

export const useScoutStore = create<ScoutState>()((set) => ({
  propertyId: null,
  mode: 'rent',
  roomIdx: 0,
  answers: {},
  screen: 'tour',

  startScout: (propertyId, mode) => set({ propertyId, mode, roomIdx: 0, answers: {}, screen: 'tour' }),

  setAnswer: (roomId, questionId, value) => set((s) => ({
    answers: { ...s.answers, [`${roomId}.${questionId}`]: value },
  })),

  goToRoom: (idx) => set({ roomIdx: idx }),
  finishScout: () => set({ screen: 'result' }),
  resetScout: () => set({ propertyId: null, roomIdx: 0, answers: {}, screen: 'tour' }),
}))
```

## Selectors — derive, don't store

Computed values belong in selectors, not store state:

```ts
// co-locate selectors with the store file
export const selectRating = (s: ScoutState): RatingResult =>
  computeRating(getQuestions(s.mode), s.answers)

export const selectRoomScore = (roomId: RoomId) => (s: ScoutState): number | null =>
  computeRoomScore(roomId, getQuestions(s.mode), s.answers)

// Usage in component — subscribe to just what you need
const rating = useScoutStore(selectRating)
const roomScore = useScoutStore(selectRoomScore('living'))
```

## Rules

- **No derived state in stores** — only raw data + actions. Derive in selectors or `useMemo`.
- **Immer not needed** — stores are small, spread updates are fine.
- **Persist only property list** — scout session is ephemeral, no need to survive refresh.
- **One action = one atomic `set`** — never call `set` twice for one logical operation.
- **Server state = TanStack Query or fetch** — Zustand is for client UI state only. If you add a backend, fetch/cache with React Query, not Zustand.
