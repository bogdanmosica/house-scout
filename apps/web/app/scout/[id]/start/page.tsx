'use client'
import { useParams, useRouter } from 'next/navigation'
import { usePropertyStore, useScoutStore } from '@house-scout/stores'
import type { ScoutDepth } from '@house-scout/types'
import { Icon } from '../../../../components/ui/icon'
import { useTranslation } from '../../../../lib/i18n'

export default function ScoutStartPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''
  const { t } = useTranslation()

  const property = usePropertyStore((s) => s.properties.find((p) => p.id === id))
  const { startSession } = useScoutStore()

  if (!property) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        {t('scout.not_found')}
      </div>
    )
  }

  const handleSelect = (depth: ScoutDepth) => {
    startSession(property.id, property.mode, 'full', depth)
    router.push(`/scout/${id}`)
  }

  return (
    <div style={{
      minHeight: '100svh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      padding: '48px 20px 32px',
    }}>
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--ink-3)', fontSize: 13, fontFamily: 'inherit',
          marginBottom: 24, padding: 0,
        }}
      >
        <Icon name="chevron-left" size={14} />
        {t('start.back')}
      </button>
      <div className="hs-label" style={{ marginBottom: 6 }}>{t('start.label')}</div>
      <h1 className="hs-h-serif" style={{ fontSize: 28, margin: '0 0 4px' }}>
        {property.name}
      </h1>
      <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 40 }}>
        {property.address} · {property.city}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={() => handleSelect('quick')}
          className="hs-card hs-focusable"
          style={{
            padding: 20, textAlign: 'left', cursor: 'pointer',
            border: '1px solid var(--line)', background: 'var(--bg-elev)',
            borderRadius: 'var(--r-lg)', width: '100%',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {t('start.quick.title')}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
            {t('start.quick.sub')}
          </div>
        </button>

        {property.type === 'house' && (
          <button
            onClick={() => handleSelect('inspection')}
            className="hs-card hs-focusable"
            style={{
              padding: 20, textAlign: 'left', cursor: 'pointer',
              border: '1px solid var(--accent)', background: 'var(--bg-elev)',
              borderRadius: 'var(--r-lg)', width: '100%',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--accent)' }}>
              {t('start.deep.title')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
              {t('start.deep.sub')}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
