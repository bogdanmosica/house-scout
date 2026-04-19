'use client'
import { useState } from 'react'
import type { Question, AnswerRaw } from '@house-scout/types'
import { Star } from './star'
import { Chip } from './chip'
import { Icon } from './icon'

interface StarPickerProps {
  value?: number
  onChange?: (v: number) => void
  size?: number
}

export function StarPicker({ value = 0, onChange, size = 26 }: StarPickerProps) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className="hs-focusable"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0 }}
        >
          <Star filled={(hover || value) >= i} size={size} />
        </button>
      ))}
    </div>
  )
}

interface AnswerInputProps {
  q: Question
  value: AnswerRaw
  onChange: (v: AnswerRaw) => void
}

export function AnswerInput({ q, value, onChange }: AnswerInputProps) {
  if (q.kind === 'stars') {
    return <StarPicker value={typeof value === 'number' ? value : 0} onChange={onChange} size={26} />
  }

  if (q.kind === 'scale') {
    const v = typeof value === 'number' ? value : 0
    return (
      <div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => onChange(n)}
              className="hs-focusable"
              style={{
                flex: 1, padding: '12px 0',
                border: `1px solid ${v === n ? 'var(--ink)' : 'var(--line-strong)'}`,
                background: v === n ? 'var(--ink)' : 'var(--bg-elev)',
                color: v === n ? 'var(--bg)' : 'var(--ink-2)',
                borderRadius: 10, fontWeight: 600, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 140ms ease',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--ink-3)' }}>
          <span>{q.low}</span>
          <span>{q.high}</span>
        </div>
      </div>
    )
  }

  if (q.kind === 'chips') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(q.options ?? []).map((o, i) => (
          <Chip key={i} active={value === i} onClick={() => onChange(i)}>
            {o.label}
          </Chip>
        ))}
      </div>
    )
  }

  if (q.kind === 'yesno') {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Chip active={value === true} onClick={() => onChange(true)} icon={<Icon name="check" size={14} />}>
          {q.yesLabel ?? 'Yes'}
        </Chip>
        <Chip active={value === false} onClick={() => onChange(false)} icon={<Icon name="x" size={14} />}>
          {q.noLabel ?? 'No'}
        </Chip>
      </div>
    )
  }

  return null
}

interface QuestionCardProps {
  q: Question
  value: AnswerRaw
  onChange: (v: AnswerRaw) => void
  index?: number
}

export function QuestionCard({ q, value, onChange, index = 0 }: QuestionCardProps) {
  return (
    <div
      className="hs-card hs-anim-in"
      style={{ padding: 16, animationDelay: `${index * 50}ms` }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
        {q.text}
      </div>
      {q.sub && (
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{q.sub}</div>
      )}
      <div style={{ marginTop: 12 }}>
        <AnswerInput q={q} value={value} onChange={onChange} />
      </div>
    </div>
  )
}
