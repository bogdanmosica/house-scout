'use client'

import { useState } from 'react'
import { computeRoomScore } from '../../lib/scoring'
import type { Question, AnswerRaw } from '@house-scout/types'
import { StarRow } from '../ui/star'
import { Icon } from '../ui/icon'
import type { IconName } from '../ui/icon'

interface CategoryDef {
  id: string
  name: string
  desc: string
  icon: string
}

interface ScoutResultsProps {
  propertyName: string
  overall: number
  answered: number
  total: number
  categoryDefs: CategoryDef[]
  questionsByRoom: Record<string, Question[]>
  answers: Record<string, AnswerRaw>
  onSave: () => void
}

function getVerdictLabel(score: number): string {
  if (score >= 4.5) return 'Excellent pick'
  if (score >= 3.5) return 'Strong contender'
  if (score >= 2.5) return 'Worth considering'
  return 'Needs more thought'
}

function getBarColor(score: number): string {
  if (score >= 4) return 'var(--accent)'
  if (score >= 3) return 'var(--ink-2)'
  return 'var(--ink-3)'
}

export function ScoutResults({
  propertyName, overall, answered, total,
  categoryDefs, questionsByRoom, answers, onSave,
}: ScoutResultsProps) {
  const [shareCopied, setShareCopied] = useState(false)

  const roomScores = categoryDefs
    .map((r) => ({ ...r, score: computeRoomScore(r.id, questionsByRoom, answers) }))
    .filter((r): r is typeof r & { score: number } => r.score !== null)

  const verdictLabel = getVerdictLabel(overall)

  async function handleShare() {
    const shareText = `${propertyName}: ${overall.toFixed(1)}/5 stars — scouted with House Scout`
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: 'House Scout', text: shareText })
        return
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }

  return (
    <div
      style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 120px' }}
      className="scrollable hs-anim-slide-up"
    >
      <div className="hs-label">Your scout report</div>
      <h2
        className="hs-h-serif"
        style={{ fontSize: 28, margin: '4px 0 16px', lineHeight: 1.05 }}
      >
        {propertyName}
      </h2>

      <div className="hs-card" style={{ padding: 22, textAlign: 'center', marginBottom: 24 }}>
        <div
          className="hs-anim-pop"
          style={{
            fontFamily: 'var(--font-serif)', fontSize: 72,
            lineHeight: 1, letterSpacing: '-0.03em',
          }}
        >
          {overall.toFixed(1)}
        </div>
        <div style={{ margin: '8px 0 6px' }}>
          <StarRow score={overall} size={20} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', marginTop: 6 }}>
          {verdictLabel}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
          {answered} of {total} answered
        </div>
      </div>

      <h3 style={{
        fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
        letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px',
      }}>
        By room
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {roomScores.map((r) => (
          <div
            key={r.id}
            style={{
              padding: '10px 14px',
              background: 'var(--bg-elev)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name={r.icon as IconName} size={14} color="var(--ink-3)" />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{r.name}</span>
              <StarRow score={r.score} size={10} />
              <span style={{ fontSize: 12, color: 'var(--ink-3)', minWidth: 28, textAlign: 'right' }}>
                {r.score.toFixed(1)}
              </span>
            </div>
            <div style={{
              marginTop: 8,
              height: 4,
              borderRadius: 2,
              background: 'var(--bg-sunk)',
              overflow: 'hidden',
            }}>
              <div
                style={{
                  height: '100%',
                  width: `${(r.score / 5) * 100}%`,
                  background: getBarColor(r.score),
                  borderRadius: 2,
                  transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={onSave} className="hs-btn hs-btn--primary" style={{ width: '100%' }}>
        Save report
      </button>
      <button
        onClick={() => { void handleShare() }}
        className="hs-btn hs-btn--ghost"
        style={{ width: '100%', marginTop: 8 }}
      >
        {shareCopied ? 'Copied!' : 'Share'}
      </button>
    </div>
  )
}
