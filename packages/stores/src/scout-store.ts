import { create } from 'zustand'
import type { ScoutSession, Room, QuestionBank, PropertyMode, AnswerRaw } from '@house-scout/types'

interface ScoutState {
  session: ScoutSession | null
  startSession: (propertyId: string, mode: PropertyMode, bank?: QuestionBank) => void
  setAnswer: (roomId: Room, questionId: string, raw: AnswerRaw) => void
  setCurrentRoom: (room: Room) => void
  endSession: () => void
}

export const useScoutStore = create<ScoutState>()((set) => ({
  session: null,
  startSession: (propertyId, mode, bank = 'full') =>
    set({
      session: {
        propertyId,
        bank,
        mode,
        answers: {},
        currentRoom: 'entrance',
        startedAt: new Date().toISOString(),
      },
    }),
  setAnswer: (roomId, questionId, raw) =>
    set((s) => {
      if (!s.session) return s
      return {
        session: {
          ...s.session,
          answers: { ...s.session.answers, [`${roomId}.${questionId}`]: raw },
        },
      }
    }),
  setCurrentRoom: (room) =>
    set((s) =>
      s.session ? { session: { ...s.session, currentRoom: room } } : s
    ),
  endSession: () => set({ session: null }),
}))
