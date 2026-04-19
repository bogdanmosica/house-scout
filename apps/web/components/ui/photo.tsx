import type { PropertyTone } from '@house-scout/types'
import type { CSSProperties, ReactNode } from 'react'

interface PhotoProps {
  label?: string
  tone?: PropertyTone | ''
  height?: number
  style?: CSSProperties
  children?: ReactNode
}

export function Photo({ label = 'photo', tone = '', height = 180, style, children }: PhotoProps) {
  const toneClass = tone ? `hs-photo--${tone}` : ''
  return (
    <div
      className={`hs-photo ${toneClass}`}
      style={{ height, ...style }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      {children}
    </div>
  )
}
