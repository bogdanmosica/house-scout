import { Icon } from '../ui/icon'

interface BottomNavProps {
  roomIdx: number
  totalRooms: number
  answeredInRoom: number
  totalInRoom: number
  totalAnswered: number
  allInRoomAnswered: boolean
  onPrev: () => void
  onNext: () => void
}

export function BottomNav({
  roomIdx, totalRooms, answeredInRoom, totalInRoom,
  totalAnswered, allInRoomAnswered, onPrev, onNext,
}: BottomNavProps) {
  const isFirst = roomIdx === 0
  const isLast = roomIdx === totalRooms - 1

  return (
    <div style={{
      position: 'fixed', left: 12, right: 12, bottom: 32,
      background: 'var(--bg-elev)', borderRadius: 999,
      boxShadow: 'var(--shadow-lift)',
      padding: 8, display: 'flex', alignItems: 'center', gap: 8,
      zIndex: 10,
    }}>
      <button
        onClick={onPrev}
        disabled={isFirst}
        style={{
          width: 42, height: 42, borderRadius: '50%', border: 'none',
          background: 'var(--bg-sunk)', cursor: isFirst ? 'default' : 'pointer',
          opacity: isFirst ? 0.4 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="chevron-left" size={16} />
      </button>

      <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'var(--ink-3)' }}>
        {answeredInRoom}/{totalInRoom} answered · {totalAnswered} total
      </div>

      <button
        onClick={onNext}
        className="hs-focusable"
        style={{
          padding: '0 18px', height: 42, borderRadius: 999,
          background: allInRoomAnswered ? 'var(--accent)' : 'var(--ink)',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        {isLast ? 'Finish' : 'Next room'}
        <Icon name="arrow" size={14} color="#fff" />
      </button>
    </div>
  )
}
