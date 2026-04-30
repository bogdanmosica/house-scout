'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from './icon'

interface Props {
  onAddTap: () => void
}

export function BottomTabBar({ onAddTap }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 3, padding: '10px 0 12px',
    background: 'none', border: 'none', cursor: 'pointer',
    color: active ? 'var(--accent)' : 'var(--ink-3)',
    fontFamily: 'inherit',
  })

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--bg-elev)',
      borderTop: '1px solid var(--line)',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 50,
    }}>
      <button onClick={() => router.push('/')} style={tabStyle(pathname === '/')}>
        <Icon name="home" size={22} />
        <span style={{ fontSize: 10, fontWeight: 600 }}>Home</span>
      </button>

      <button onClick={onAddTap} style={tabStyle(false)}>
        <Icon name="plus" size={22} />
        <span style={{ fontSize: 10, fontWeight: 600 }}>Add</span>
      </button>
    </nav>
  )
}
