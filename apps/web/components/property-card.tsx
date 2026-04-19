import Link from 'next/link'
import type { Property } from '@house-scout/types'
import { Photo } from './ui/photo'
import { StarRow } from './ui/star'
import { Icon } from './ui/icon'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property: p }: PropertyCardProps) {
  const href = p.status === 'todo' ? `/scout/${p.id}` : `/property/${p.id}`

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        className="hs-card hs-anim-in"
        style={{ overflow: 'hidden', transition: 'box-shadow 200ms ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
      >
        <Photo tone={p.tone} height={160} label={p.name} />

        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span className="hs-chip" style={{ fontSize: 10, padding: '3px 8px' }}>
              {p.mode === 'rent' ? 'Rent' : 'Buy'}
            </span>
            {p.status === 'todo' && (
              <span className="hs-chip" style={{ fontSize: 10, padding: '3px 8px', color: 'var(--accent)' }}>
                To scout
              </span>
            )}
          </div>

          <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', marginBottom: 2 }}>
            {p.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>
            {p.address} · {p.city}
          </div>

          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--ink-2)', marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="bed" size={12} /> {p.beds}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="bath" size={12} /> {p.baths}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="sqft" size={12} /> {p.sqft.toLocaleString()} sqft
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{p.price}</span>
            {p.rating != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <StarRow score={p.rating} size={11} />
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{p.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
