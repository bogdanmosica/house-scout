import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PropertyMode, QuestionBank } from '@house-scout/types'

interface UserProfile {
  onboarded: boolean
  mode: PropertyMode
  bank: QuestionBank
}

interface UserState extends UserProfile {
  setProfile: (mode: PropertyMode, bank: QuestionBank) => void
  clearUser: () => void
}

const DEFAULT_PROFILE: UserProfile = {
  onboarded: false,
  mode: 'rent',
  bank: 'full',
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROFILE,
      setProfile: (mode, bank) => set({ mode, bank, onboarded: true }),
      clearUser: () => set(DEFAULT_PROFILE),
    }),
    { name: 'house-scout-user' }
  )
)
