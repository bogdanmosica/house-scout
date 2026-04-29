import { create } from 'zustand'
import type { ScoutSession, QuestionBank, PropertyMode, AnswerRaw, ScoutDepth } from '@house-scout/types'

interface ScoutState {
  session: ScoutSession | null
  startSession: (propertyId: string, mode: PropertyMode, bank?: QuestionBank, depth?: ScoutDepth) => void
  setAnswer: (categoryId: string, questionId: string, raw: AnswerRaw) => void
  setCurrentRoom: (room: string) => void
  endSession: () => void
}

export const useScoutStore = create<ScoutState>()((set) => ({
  session: null,
  startSession: (propertyId, mode, bank = 'full', depth = 'quick') =>
    set({
      session: {
        propertyId,
        bank,
        mode,
        inspectionDepth: depth,
        answers: {},
        currentRoom: depth === 'inspection' ? 'utilities' : 'entrance',
        startedAt: new Date().toISOString(),
      },
    }),
  setAnswer: (categoryId, questionId, raw) =>
    set((s) => {
      if (!s.session) return s
      return {
        session: {
          ...s.session,
          answers: { ...s.session.answers, [`${categoryId}.${questionId}`]: raw },
        },
      }
    }),
  setCurrentRoom: (room) =>
    set((s) =>
      s.session ? { session: { ...s.session, currentRoom: room } } : s
    ),
  endSession: () => set({ session: null }),
}))
