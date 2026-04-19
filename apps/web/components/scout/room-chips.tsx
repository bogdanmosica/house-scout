import type { RoomDef, Room, Question, AnswerRaw } from '@house-scout/types'
import { Icon } from '../ui/icon'
import type { IconName } from '../ui/icon'
import { computeRoomScore } from '../../lib/scoring'

interface RoomChipsProps {
  rooms: RoomDef[]
  currentIdx: number
  questionsByRoom: Record<Room, Question[]>
  answers: Record<string, AnswerRaw>
  onSelect: (idx: number) => void
}

export function RoomChips({ rooms, currentIdx, questionsByRoom, answers, onSelect }: RoomChipsProps) {
  return (
    <div
      style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 20px' }}
      className="scrollable"
    >
      {rooms.map((r, i) => {
        const score = computeRoomScore(r.id, questionsByRoom, answers)
        const done = score !== null
        const active = i === currentIdx
        return (
          <button
            key={r.id}
            onClick={() => onSelect(i)}
            style={{
              flex: '0 0 auto', padding: '8px 12px', borderRadius: 12,
              background: active ? 'var(--ink)' : done ? 'var(--sage-soft)' : 'var(--bg-elev)',
              color: active ? '#fff' : done ? '#3f6b52' : 'var(--ink-3)',
              border: `1px solid ${active ? 'var(--ink)' : done ? 'var(--sage)' : 'var(--line)'}`,
              fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'inherit', cursor: 'pointer',
            }}
          >
            <Icon name={r.icon as IconName} size={12} color="currentColor" />
            {r.name}
            {done && <span>· {score.toFixed(1)}★</span>}
          </button>
        )
      })}
    </div>
  )
}
