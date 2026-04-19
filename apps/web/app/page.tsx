'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePropertyStore } from '@house-scout/stores'
import { SEED_PROPERTIES } from '../lib/data'
import { PropertyCard } from '../components/property-card'

export default function HomePage() {
  const { properties, initializeWithSeed } = usePropertyStore()

  useEffect(() => {
    initializeWithSeed(SEED_PROPERTIES)
  }, [initializeWithSeed])

  const scouted = properties.filter((p) => p.status === 'scouted')
  const todo = properties.filter((p) => p.status === 'todo')

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 100px' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="hs-label" style={{ marginBottom: 4 }}>House Scout</div>
        <h1
          className="hs-h-serif"
          style={{ fontSize: 32, margin: 0 }}
        >
          Your shortlist
        </h1>
      </div>

      {scouted.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px',
          }}>
            Scouted · {scouted.length}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {scouted.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {todo.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px',
          }}>
            To scout · {todo.length}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {todo.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {properties.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>No properties yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Add a property to start scouting</div>
        </div>
      )}

      <Link
        href="/add"
        style={{
          position: 'fixed', right: 20, bottom: 32,
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--ink)', color: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-lift)', textDecoration: 'none', fontSize: 24,
        }}
      >
        +
      </Link>
    </main>
  )
}
