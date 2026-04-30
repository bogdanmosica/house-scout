'use client'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../lib/i18n'
import { Icon } from '../../components/ui/icon'

export default function SettingsPage() {
  const router = useRouter()
  const { t, locale, setLocale } = useTranslation()

  const pillBase: React.CSSProperties = {
    flex: 1, padding: '10px 20px', borderRadius: 999,
    border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
    transition: 'background 0.15s, color 0.15s',
  }

  return (
    <main style={{ maxWidth: 860, margin: '0 auto', padding: '48px 16px 100px' }}>
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
        {t('prop.back')}
      </button>

      <div className="hs-label" style={{ marginBottom: 4 }}>{t('app.name')}</div>
      <h1 className="hs-h-serif" style={{ fontSize: 32, margin: '0 0 32px' }}>
        {t('settings.title')}
      </h1>

      <div className="hs-card" style={{ padding: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
        }}>
          {t('settings.language')}
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-sunk)', borderRadius: 999, padding: 4 }}>
          {(['ro', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              style={{
                ...pillBase,
                background: locale === l ? 'var(--accent)' : 'transparent',
                color: locale === l ? '#fff' : 'var(--ink-3)',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
