'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import { SEED_PROPERTIES } from '../lib/data'
import { PropertyCard } from '../components/property-card'
import { isOnboarded } from '../lib/onboarding'
import { BottomTabBar } from '../components/ui/bottom-tab-bar'
import { AddSheet } from '../components/ui/add-sheet'

export default function HomePage() {
  const router = useRouter()
  const { properties, initializeWithSeed } = usePropertyStore()
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    if (!isOnboarded()) {
      router.push('/onboarding')
      return
    }
    initializeWithSeed(SEED_PROPERTIES)
  }, [initializeWithSeed, router])

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
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--ink-3)' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              margin: '0 auto 20px',
            }}
          >
            🏠
          </div>
          <h2
            className="hs-h-serif"
            style={{ fontSize: 22, margin: '0 0 10px', color: 'var(--ink)' }}
          >
            Ready to scout your first property?
          </h2>
          <p style={{ fontSize: 14, margin: '0 0 24px', color: 'var(--ink-3)', lineHeight: 1.5 }}>
            Walk through every room and get a 1–5 star score.
          </p>
          <button
            onClick={() => setSheetOpen(true)}
            className="hs-btn hs-btn--accent"
            style={{ display: 'inline-block' }}
          >
            Add first property →
          </button>
        </div>
      )}

      <BottomTabBar onAddTap={() => setSheetOpen(true)} />
      <AddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  )
}
