import { describe, it, expect, beforeEach } from 'vitest'
import { usePropertyStore } from '../property-store'

const SAMPLE_PROPERTY = {
  id: 'p1',
  name: 'Test Flat',
  address: '1 Main St',
  city: 'Testville',
  type: 'apartment' as const,
  mode: 'rent' as const,
  price: 800,
  beds: 2,
  baths: 1,
  sqm: 55,
  rating: null,
  tone: 'terra' as const,
  status: 'todo' as const,
  highlights: [],
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

beforeEach(() => {
  localStorage.clear()
  usePropertyStore.setState({ properties: [] })
})

describe('clearAll', () => {
  it('removes all properties', () => {
    usePropertyStore.getState().addProperty(SAMPLE_PROPERTY)
    expect(usePropertyStore.getState().properties).toHaveLength(1)
    usePropertyStore.getState().clearAll()
    expect(usePropertyStore.getState().properties).toHaveLength(0)
  })

  it('does not affect other state', () => {
    usePropertyStore.getState().addProperty(SAMPLE_PROPERTY)
    usePropertyStore.getState().clearAll()
    expect(usePropertyStore.getState().properties).toEqual([])
  })
})
