'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import { PropertyCard } from '../components/property-card'
import { isOnboarded } from '../lib/onboarding'
import { BottomTabBar } from '../components/ui/bottom-tab-bar'
import { AddSheet } from '../components/ui/add-sheet'
import { useTranslation } from '../lib/i18n'

export default function HomePage() {
  const router = useRouter()
  const { properties } = usePropertyStore()
  const [sheetOpen, setSheetOpen] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOnboarded()) router.push('/onboarding')
  }, [router])

  const scouted = properties.filter((p) => p.status === 'scouted')
  const todo = properties.filter((p) => p.status === 'todo')

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px 100px' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="hs-label" style={{ marginBottom: 4 }}>{t('app.name')}</div>
        <h1 className="hs-h-serif" style={{ fontSize: 32, margin: 0 }}>
          {t('home.title')}
        </h1>
      </div>

      {scouted.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px',
          }}>
            {t('home.scouted')} · {scouted.length}
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
            {t('home.todo')} · {todo.length}
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
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--accent-soft)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 20px',
          }}>
            🏠
          </div>
          <h2 className="hs-h-serif" style={{ fontSize: 22, margin: '0 0 10px', color: 'var(--ink)' }}>
            {t('home.empty.title')}
          </h2>
          <p style={{ fontSize: 14, margin: '0 0 24px', color: 'var(--ink-3)', lineHeight: 1.5 }}>
            {t('home.empty.sub')}
          </p>
          <button
            onClick={() => setSheetOpen(true)}
            className="hs-btn hs-btn--accent"
            style={{ display: 'inline-block' }}
          >
            {t('home.empty.cta')}
          </button>
        </div>
      )}

      <BottomTabBar onAddTap={() => setSheetOpen(true)} />
      <AddSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  )
}
