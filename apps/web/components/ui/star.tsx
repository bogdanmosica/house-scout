interface StarProps {
  filled?: boolean
  half?: boolean
  size?: number
  color?: string
}

export function Star({ filled = false, half = false, size = 14, color }: StarProps) {
  const fillColor = color ?? 'var(--accent)'
  const emptyColor = 'var(--ink-4)'
  const path = "M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.5l7.1-.6z"

  if (half) {
    const gid = `hg-${size}`
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
        <defs>
          <linearGradient id={gid}>
            <stop offset="50%" stopColor={fillColor} />
            <stop offset="50%" stopColor={emptyColor} />
          </linearGradient>
        </defs>
        <path d={path} fill={`url(#${gid})`} />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
      <path d={path} fill={filled ? fillColor : emptyColor} />
    </svg>
  )
}

interface StarRowProps {
  score?: number
  size?: number
  showValue?: boolean
  color?: string
}

export function StarRow({ score = 0, size = 14, showValue = false, color }: StarRowProps) {
  const rounded = Math.round(score * 2) / 2
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rounded >= i
        const half = !filled && rounded >= i - 0.5
        return <Star key={i} filled={filled} half={half} size={size} color={color} />
      })}
      {showValue && (
        <span style={{ marginLeft: 6, fontSize: size - 1, fontWeight: 600, color: 'var(--ink-2)' }}>
          {score.toFixed(1)}
        </span>
      )}
    </span>
  )
}
