import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Property } from '@house-scout/types'

interface PropertyState {
  properties: Property[]
  addProperty: (p: Property) => void
  updateProperty: (id: string, updates: Partial<Property>) => void
  deleteProperty: (id: string) => void
  setRating: (id: string, rating: number) => void
  initializeWithSeed: (seed: Property[]) => void
  clearAll: () => void
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      properties: [],
      addProperty: (p) =>
        set((s) => ({ properties: [...s.properties, p] })),
      updateProperty: (id, updates) =>
        set((s) => ({
          properties: s.properties.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProperty: (id) =>
        set((s) => ({ properties: s.properties.filter((p) => p.id !== id) })),
      setRating: (id, rating) =>
        set((s) => ({
          properties: s.properties.map((p) =>
            p.id === id
              ? { ...p, rating, status: 'scouted' as const, updatedAt: new Date().toISOString() }
              : p
          ),
        })),
      initializeWithSeed: (seed) => {
        if (get().properties.length === 0) {
          set({ properties: seed })
        }
      },
      clearAll: () => set({ properties: [] }),
    }),
    { name: 'house-scout-properties' }
  )
)
