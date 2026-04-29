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

export function ScoutResults({
  propertyName, overall, answered, total,
  categoryDefs, questionsByRoom, answers, onSave,
}: ScoutResultsProps) {
  const roomScores = categoryDefs
    .map((r) => ({ ...r, score: computeRoomScore(r.id, questionsByRoom, answers) }))
    .filter((r): r is typeof r & { score: number } => r.score !== null)

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
        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
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
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              background: 'var(--bg-elev)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-md)',
            }}
          >
            <Icon name={r.icon as IconName} size={14} color="var(--ink-3)" />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{r.name}</span>
            <StarRow score={r.score} size={10} />
            <span style={{ fontSize: 12, color: 'var(--ink-3)', minWidth: 28, textAlign: 'right' }}>
              {r.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <button onClick={onSave} className="hs-btn hs-btn--primary" style={{ width: '100%' }}>
        Save report
      </button>
    </div>
  )
}
