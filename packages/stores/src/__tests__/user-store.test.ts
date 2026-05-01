import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../user-store'

beforeEach(() => {
  localStorage.clear()
  useUserStore.setState({ onboarded: false, mode: 'rent', bank: 'full' })
})

describe('useUserStore defaults', () => {
  it('starts with onboarded false', () => {
    expect(useUserStore.getState().onboarded).toBe(false)
  })

  it('starts with mode rent', () => {
    expect(useUserStore.getState().mode).toBe('rent')
  })

  it('starts with bank full', () => {
    expect(useUserStore.getState().bank).toBe('full')
  })
})

describe('setProfile', () => {
  it('sets mode, bank, and marks onboarded', () => {
    useUserStore.getState().setProfile('buy', 'light')
    const { onboarded, mode, bank } = useUserStore.getState()
    expect(onboarded).toBe(true)
    expect(mode).toBe('buy')
    expect(bank).toBe('light')
  })

  it('persists to house-scout-user localStorage key', () => {
    useUserStore.getState().setProfile('buy', 'full')
    const raw = localStorage.getItem('house-scout-user')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.state.mode).toBe('buy')
    expect(parsed.state.onboarded).toBe(true)
    expect(parsed.state.bank).toBe('full')
  })
})

describe('clearUser', () => {
  it('resets all fields to defaults', () => {
    useUserStore.getState().setProfile('buy', 'light')
    useUserStore.getState().clearUser()
    const { onboarded, mode, bank } = useUserStore.getState()
    expect(onboarded).toBe(false)
    expect(mode).toBe('rent')
    expect(bank).toBe('full')
  })
})
