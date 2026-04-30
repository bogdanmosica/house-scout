'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from './icon'
import type { PropertyMode, PropertyType } from '@house-scout/types'

interface Props {
  open: boolean
  onClose: () => void
}

const TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house',     label: 'House'     },
  { value: 'condo',     label: 'Condo'     },
  { value: 'loft',      label: 'Loft'      },
]

export function AddSheet({ open, onClose }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<PropertyMode | null>(null)

  const handleType = (type: PropertyType) => {
    router.push(`/add?mode=${mode}&type=${type}`)
    onClose()
    setMode(null)
  }

  const handleClose = () => {
    onClose()
    setMode(null)
  }

  if (!open) return null

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 100,
        }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--bg-elev)',
        borderRadius: '20px 20px 0 0',
        padding: '16px 20px 40px',
        zIndex: 101,
        boxShadow: 'var(--shadow-lift)',
      }}>
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: 'var(--line-strong)',
          margin: '0 auto 24px',
        }} />

        {mode === null ? (
          <>
            <h2 className="hs-h-serif" style={{ fontSize: 22, margin: '0 0 20px' }}>
              What are you looking for?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(['rent', 'buy'] as PropertyMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="hs-card hs-focusable"
                  style={{
                    padding: '18px 20px', textAlign: 'left', cursor: 'pointer',
                    border: '1px solid var(--line)', background: 'var(--bg)',
                    borderRadius: 'var(--r-lg)', width: '100%',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {m === 'rent' ? 'Renting' : 'Buying'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>
                    {m === 'rent'
                      ? 'Evaluate lifestyle fit & lease flexibility'
                      : 'Assess structural quality & resale prospects'}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setMode(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--ink-3)', fontSize: 13, fontFamily: 'inherit',
                marginBottom: 16, padding: 0,
              }}
            >
              <Icon name="chevron-left" size={14} />
              Back
            </button>
            <h2 className="hs-h-serif" style={{ fontSize: 22, margin: '0 0 20px' }}>
              What type of property?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => handleType(t.value)}
                  className="hs-card hs-focusable"
                  style={{
                    padding: '18px 16px', textAlign: 'left', cursor: 'pointer',
                    border: '1px solid var(--line)', background: 'var(--bg)',
                    borderRadius: 'var(--r-lg)', width: '100%',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{t.label}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
