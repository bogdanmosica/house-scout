'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePropertyStore } from '@house-scout/stores'
import { Photo } from '../../../components/ui/photo'
import { StarRow } from '../../../components/ui/star'
import { Icon } from '../../../components/ui/icon'
import type { IconName } from '../../../components/ui/icon'
import { useTranslation } from '../../../lib/i18n'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''
  const { t } = useTranslation()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const property = usePropertyStore((s) => s.properties.find((p) => p.id === id))
  const deleteProperty = usePropertyStore((s) => s.deleteProperty)

  function handleDelete() {
    deleteProperty(id)
    router.push('/')
  }

  if (!property) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        {t('prop.not_found')}{' '}
        <Link href="/" style={{ color: 'var(--accent)' }}>{t('prop.go_home')}</Link>
      </div>
    )
  }

  return (
    <main style={{ width: '100%', maxWidth: 640, margin: '0 auto', padding: '0 0 100px' }}>
      <Photo tone={property.tone} height={260} label={property.name} style={{ borderRadius: 0 }} />

      <div style={{ padding: '20px 20px 0' }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ink-3)', fontSize: 13, fontFamily: 'inherit',
            marginBottom: 16, padding: 0,
          }}
        >
          <Icon name="chevron-left" size={14} />
          {t('prop.back')}
        </button>

        <div className="hs-label" style={{ marginBottom: 4 }}>
          {t(`sheet.${property.type}`)} · {property.mode === 'rent' ? t('prop.renting') : t('prop.buying')}
        </div>
        <h1 className="hs-h-serif" style={{ fontSize: 30, margin: '0 0 4px' }}>
          {property.name}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16 }}>
          {property.address}, {property.city}
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--ink-2)', marginBottom: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="bed" size={14} /> {property.beds}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="bath" size={14} /> {property.baths}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="sqft" size={14} /> {property.sqm.toLocaleString()} {t('prop.sqft')}
          </span>
        </div>

        {property.rating !== null ? (
          <div className="hs-card" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div className="hs-anim-pop" style={{
                fontFamily: 'var(--font-serif)', fontSize: 64,
                lineHeight: 1, letterSpacing: '-0.03em',
              }}>
                {property.rating.toFixed(1)}
              </div>
              <StarRow score={property.rating} size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>{t('prop.rating')}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{`€${property.price.toLocaleString()}${property.mode === 'rent' ? '/mo' : ''}`}</div>
            </div>
          </div>
        ) : (
          <div className="hs-card" style={{ padding: 20, marginBottom: 24, textAlign: 'center', color: 'var(--ink-3)' }}>
            <div style={{ fontSize: 13 }}>{t('prop.not_scouted')}</div>
          </div>
        )}

        {property.highlights.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
              letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px',
            }}>
              {t('prop.highlights')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {property.highlights.map((h) => (
                <span key={h} className="hs-chip">{h}</span>
              ))}
            </div>
          </div>
        )}

        {property.notes && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
              letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px',
            }}>
              {t('prop.notes')}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
              {property.notes}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href={`/scout/${property.id}`}
            className="hs-btn hs-btn--primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {property.status === 'todo' ? t('prop.start') : t('prop.again')}
            <Icon name="arrow" size={16} color="currentColor" />
          </Link>
          <Link href="/" className="hs-btn hs-btn--ghost" style={{ width: '100%', justifyContent: 'center' }}>
            {t('prop.shortlist')}
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 8,
              border: '1.5px solid #c0392b', background: 'none',
              color: '#c0392b', fontSize: 14, fontWeight: 600,
              fontFamily: 'inherit', cursor: 'pointer', marginTop: 8,
            }}
          >
            {t('prop.delete')}
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg)', borderRadius: 16, padding: '28px 24px',
              maxWidth: 360, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, margin: '0 0 8px' }}>
              {t('prop.delete.confirm.title').replace('{name}', property.name)}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '0 0 24px', lineHeight: 1.5 }}>
              {t('prop.delete.confirm.body')}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="hs-btn hs-btn--ghost"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {t('prop.delete.confirm.cancel')}
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1, padding: '12px 20px', borderRadius: 8,
                  border: 'none', background: '#c0392b',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                {t('prop.delete.confirm.action')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
