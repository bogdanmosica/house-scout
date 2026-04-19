'use client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePropertyStore } from '@house-scout/stores'
import { Photo } from '../../../components/ui/photo'
import { StarRow } from '../../../components/ui/star'
import { Icon } from '../../../components/ui/icon'
import type { IconName } from '../../../components/ui/icon'
import { ROOMS } from '../../../lib/data'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? params.id : ''

  const property = usePropertyStore((s) => s.properties.find((p) => p.id === id))

  if (!property) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
        Property not found.{' '}
        <Link href="/" style={{ color: 'var(--accent)' }}>Go home</Link>
      </div>
    )
  }

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 100px' }}>
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
          Back
        </button>

        <div className="hs-label" style={{ marginBottom: 4 }}>
          {property.type} · {property.mode === 'rent' ? 'Renting' : 'Buying'}
        </div>
        <h1 className="hs-h-serif" style={{ fontSize: 30, margin: '0 0 4px' }}>
          {property.name}
        </h1>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16 }}>
          {property.address}, {property.city}
        </div>

        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--ink-2)', marginBottom: 20 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="bed" size={14} /> {property.beds} bed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="bath" size={14} /> {property.baths} bath
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Icon name="sqft" size={14} /> {property.sqft.toLocaleString()} sqft
          </span>
        </div>

        {property.rating !== null ? (
          <div className="hs-card" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <div
                className="hs-anim-pop"
                style={{
                  fontFamily: 'var(--font-serif)', fontSize: 64,
                  lineHeight: 1, letterSpacing: '-0.03em',
                }}
              >
                {property.rating.toFixed(1)}
              </div>
              <StarRow score={property.rating} size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 8 }}>Scout rating</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{property.price}</div>
            </div>
          </div>
        ) : (
          <div className="hs-card" style={{ padding: 20, marginBottom: 24, textAlign: 'center', color: 'var(--ink-3)' }}>
            <div style={{ fontSize: 13 }}>Not scouted yet</div>
          </div>
        )}

        {property.highlights.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{
              fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
              letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px',
            }}>
              Highlights
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
              Notes
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
            {property.status === 'todo' ? 'Start scout' : 'Scout again'}
            <Icon name="arrow" size={16} color="currentColor" />
          </Link>
          <Link
            href="/"
            className="hs-btn hs-btn--ghost"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Back to shortlist
          </Link>
        </div>
      </div>
    </main>
  )
}
