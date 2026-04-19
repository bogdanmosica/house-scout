'use client'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import { useScoutStore } from '@house-scout/stores'
import type { Room, AnswerRaw } from '@house-scout/types'
import { ROOMS, getQuestions } from '../../../lib/data'
import { computeRating, computeRoomScore } from '../../../lib/scoring'
import { Photo } from '../../../components/ui/photo'
import { RoomChips } from '../../../components/scout/room-chips'
import { BottomNav } from '../../../components/scout/bottom-nav'
import { QuestionCard } from '../../../components/ui/question-card'
import { ScoutResults } from '../../../components/scout/results'

const ROOM_TONES: Record<Room, string> = {
  entrance: 'terra', living: 'terra', kitchen: 'gold',
  bedroom: 'terra', bath: 'sky', outdoor: 'sage', neighbor: 'sage',
}

export default function ScoutPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''

  const property = usePropertyStore((s) => s.properties.find((p) => p.id === id))
  const setRating = usePropertyStore((s) => s.setRating)
  const { session, startSession, setAnswer, setCurrentRoom, endSession } = useScoutStore()

  const [screen, setScreen] = useState<'tour' | 'result'>('tour')
  const [mode, setMode] = useState<'rent' | 'buy'>(property?.mode ?? 'rent')
  const [roomIdx, setRoomIdx] = useState(0)

  useEffect(() => {
    if (property && !session) {
      startSession(property.id, property.mode)
      setMode(property.mode)
    }
  }, [property, session, startSession])

  const questionsByRoom = useMemo(() => getQuestions(mode), [mode])
  const answers = session?.answers ?? {}

  const room = ROOMS[roomIdx]
  if (!room || !property) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        {!property ? 'Property not found.' : 'Loading…'}
      </div>
    )
  }

  const qs = questionsByRoom[room.id] ?? []
  const rating = computeRating(questionsByRoom, answers)
  const answeredInRoom = qs.filter((q) => answers[`${room.id}.${q.id}`] != null).length
  const allInRoomAnswered = answeredInRoom === qs.length && qs.length > 0

  const totalAnswered = Object.values(answers).filter((v) => v != null).length

  const handleAnswer = (questionId: string, raw: AnswerRaw) => {
    setAnswer(room.id, questionId, raw)
  }

  const handleCurrentRoom = (idx: number) => {
    const r = ROOMS[idx]
    if (r) setCurrentRoom(r.id)
    setRoomIdx(idx)
  }

  const handleNext = () => {
    const next = roomIdx + 1
    if (next >= ROOMS.length) {
      setScreen('result')
      return
    }
    handleCurrentRoom(next)
  }

  const handlePrev = () => {
    if (roomIdx > 0) handleCurrentRoom(roomIdx - 1)
  }

  const handleSave = () => {
    const rounded = Math.round(Math.min(5, Math.max(1, rating.overall)))
    setRating(id, rounded)
    endSession()
    router.push(`/property/${id}`)
  }

  if (screen === 'result') {
    return (
      <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', paddingTop: 0 }}>
        <ScoutResults
          propertyName={property.name}
          overall={rating.overall}
          answered={rating.answered}
          total={rating.total}
          questionsByRoom={questionsByRoom}
          answers={answers}
          onSave={handleSave}
        />
      </div>
    )
  }

  return (
    <div style={{ height: '100svh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', paddingTop: 16 }}>
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Photo tone={property.tone} height={36} style={{ width: 36, borderRadius: 10 }} label="" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {property.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              {property.address} · {mode === 'rent' ? 'Renting' : 'Buying'}
            </div>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-sunk)', padding: 3, borderRadius: 999 }}>
            {(['rent', 'buy'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '4px 10px', borderRadius: 999, border: 'none',
                  background: mode === m ? 'var(--ink)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--ink-3)',
                  fontSize: 10, fontWeight: 700, fontFamily: 'inherit',
                  cursor: 'pointer', textTransform: 'uppercase',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <RoomChips
          rooms={ROOMS}
          currentIdx={roomIdx}
          questionsByRoom={questionsByRoom}
          answers={answers}
          onSelect={handleCurrentRoom}
        />
      </div>

      <Photo
        tone={ROOM_TONES[room.id] as 'terra' | 'sage' | 'sky' | 'gold'}
        height={200}
        label={`${room.name.toLowerCase()} — tap to add photo`}
        style={{ margin: '0 20px', borderRadius: 'var(--r-lg)' }}
      />

      <div style={{ padding: '16px 20px 8px' }}>
        <div className="hs-label">Room {roomIdx + 1} of {ROOMS.length}</div>
        <h2 className="hs-h-serif" style={{ fontSize: 28, margin: '2px 0 4px' }}>{room.name}</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{room.desc}</div>
      </div>

      <div
        style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 120px' }}
        className="scrollable"
      >
        {qs.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 12 }}>
            <QuestionCard
              q={q}
              value={answers[`${room.id}.${q.id}`] ?? null}
              onChange={(v) => handleAnswer(q.id, v)}
              index={i}
            />
          </div>
        ))}
      </div>

      <BottomNav
        roomIdx={roomIdx}
        totalRooms={ROOMS.length}
        answeredInRoom={answeredInRoom}
        totalInRoom={qs.length}
        totalAnswered={totalAnswered}
        allInRoomAnswered={allInRoomAnswered}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
