'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import { useScoutStore } from '@house-scout/stores'
import type { AnswerRaw, Question } from '@house-scout/types'
import { ROOMS, INSPECTION_CATEGORIES, getQuestions, getInspectionQuestions } from '../../../lib/data'
import { computeRating } from '../../../lib/scoring'
import { Photo } from '../../../components/ui/photo'
import { RoomChips } from '../../../components/scout/room-chips'
import { BottomNav } from '../../../components/scout/bottom-nav'
import { QuestionCard } from '../../../components/ui/question-card'
import { ScoutResults } from '../../../components/scout/results'
import { Icon } from '../../../components/ui/icon'
import { useTranslation, translateQuestion, translateDefs } from '../../../lib/i18n'

export default function ScoutPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''
  const { t } = useTranslation()

  const property = usePropertyStore((s) => s.properties.find((p) => p.id === id))
  const setRating = usePropertyStore((s) => s.setRating)
  const { session, setAnswer, setCurrentRoom, endSession } = useScoutStore()

  const [screen, setScreen] = useState<'tour' | 'result'>('tour')
  const [roomIdx, setRoomIdx] = useState(0)
  const isSaving = useRef(false)

  useEffect(() => {
    if (property && !session && !isSaving.current) {
      router.replace(`/scout/${id}/start`)
    }
  }, [property, session, id, router])

  const isInspection = session?.inspectionDepth === 'inspection'
  const rawCategories: { id: string; name: string; desc: string; icon: string }[] =
    isInspection ? INSPECTION_CATEGORIES : ROOMS
  const categories = useMemo(
    () => translateDefs(rawCategories, t, isInspection ? 'insp' : 'room'),
    [rawCategories, t, isInspection],
  )

  const rawQuestionsByRoom = useMemo(
    () => isInspection ? getInspectionQuestions() : getQuestions(session?.mode ?? 'rent'),
    [isInspection, session?.mode],
  )

  const questionsByRoom = useMemo(() => {
    const out: Record<string, Question[]> = {}
    for (const key of Object.keys(rawQuestionsByRoom)) {
      out[key] = (rawQuestionsByRoom as Record<string, Question[]>)[key]!.map((q) => translateQuestion(q, t))
    }
    return out
  }, [rawQuestionsByRoom, t])

  const answers = session?.answers ?? {}

  const category = categories[roomIdx]
  if (!category || !property || !session) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        {!property ? t('scout.not_found') : t('scout.loading')}
      </div>
    )
  }

  const qs: Question[] = questionsByRoom[category.id] ?? []
  const rating = computeRating(rawQuestionsByRoom, answers)
  const answeredInRoom = qs.filter((q) => answers[`${category.id}.${q.id}`] != null).length
  const allInRoomAnswered = answeredInRoom === qs.length && qs.length > 0
  const totalAnswered = Object.values(answers).filter((v) => v != null).length

  const handleAnswer = (questionId: string, raw: AnswerRaw) => {
    setAnswer(category.id, questionId, raw)
  }

  const handleCurrentRoom = (idx: number) => {
    const c = rawCategories[idx]
    if (c) setCurrentRoom(c.id)
    setRoomIdx(idx)
  }

  const handleNext = () => {
    const next = roomIdx + 1
    if (next >= categories.length) {
      setScreen('result')
      return
    }
    handleCurrentRoom(next)
  }

  const handlePrev = () => {
    if (roomIdx > 0) handleCurrentRoom(roomIdx - 1)
  }

  const handleSave = () => {
    isSaving.current = true
    const rounded = Math.round(Math.min(5, Math.max(1, rating.overall)))
    setRating(id, rounded)
    endSession()
    router.push('/')
  }

  const handleBack = () => {
    if (window.confirm(t('scout.leave'))) {
      isSaving.current = true
      endSession()
      router.push('/')
    }
  }

  if (screen === 'result') {
    return (
      <div style={{ height: '100svh', display: 'flex', flexDirection: 'column', paddingTop: 0 }}>
        <ScoutResults
          propertyName={property.name}
          overall={rating.overall}
          answered={rating.answered}
          total={rating.total}
          categoryDefs={categories}
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
        <button
          onClick={handleBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ink-3)', fontSize: 13, fontFamily: 'inherit',
            marginBottom: 12, padding: 0,
          }}
        >
          <Icon name="chevron-left" size={14} />
          {t('scout.back')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Photo tone={property.tone} height={36} style={{ width: 36, borderRadius: 10 }} label="" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {property.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>
              {property.address} · {isInspection ? t('scout.deep') : session.mode === 'rent' ? t('scout.renting') : t('scout.buying')}
            </div>
          </div>
        </div>

        <RoomChips
          rooms={categories}
          currentIdx={roomIdx}
          questionsByRoom={questionsByRoom}
          answers={answers}
          onSelect={handleCurrentRoom}
        />
      </div>

      <Photo
        tone={property.tone}
        height={200}
        label={`${category.name.toLowerCase()}${t('scout.photo')}`}
        style={{ margin: '0 20px', borderRadius: 'var(--r-lg)' }}
      />

      <div style={{ padding: '16px 20px 8px' }}>
        <div className="hs-label">
          {isInspection ? t('scout.label.insp') : t('scout.label.room')} {roomIdx + 1} of {categories.length}
        </div>
        <h2 className="hs-h-serif" style={{ fontSize: 28, margin: '2px 0 4px' }}>{category.name}</h2>
        <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{category.desc}</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 120px' }} className="scrollable">
        {qs.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 12 }}>
            <QuestionCard
              q={q}
              value={answers[`${category.id}.${q.id}`] ?? null}
              onChange={(v) => handleAnswer(q.id, v)}
              index={i}
            />
          </div>
        ))}
      </div>

      <BottomNav
        roomIdx={roomIdx}
        totalRooms={categories.length}
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
