import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  icon?: ReactNode
}

export function Chip({ children, active = false, onClick, icon }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className="hs-focusable"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 999,
        background: active ? 'var(--ink)' : 'var(--bg-elev)',
        color: active ? 'var(--bg)' : 'var(--ink-2)',
        border: `1px solid ${active ? 'var(--ink)' : 'var(--line-strong)'}`,
        fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
        fontFamily: 'inherit', transition: 'all 160ms ease',
      }}
    >
      {icon}
      {children}
    </button>
  )
}
