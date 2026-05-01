'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../lib/i18n'
import { useUserStore } from '@house-scout/stores'
import { usePropertyStore } from '@house-scout/stores'
import { Icon } from '../../components/ui/icon'

type ConfirmTarget = 'prefs' | 'data' | null

export default function SettingsPage() {
  const router = useRouter()
  const { t, locale, setLocale } = useTranslation()
  const [confirm, setConfirm] = useState<ConfirmTarget>(null)
  const clearUser = useUserStore((s) => s.clearUser)
  const clearAll = usePropertyStore((s) => s.clearAll)

  const pillBase: React.CSSProperties = {
    flex: 1, padding: '10px 20px', borderRadius: 999,
    border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
    transition: 'background 0.15s, color 0.15s',
  }

  function handleResetPrefs() {
    clearUser()
    router.push('/onboarding')
  }

  function handleClearData() {
    clearAll()
    setConfirm(null)
  }

  return (
    <main style={{ width: '100%', maxWidth: 860, margin: '0 auto', padding: '48px 16px 100px' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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

        <div className="hs-card" style={{ padding: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
          }}>
            {t('settings.danger')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <button
                onClick={() => setConfirm('prefs')}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 8,
                  border: '1px solid var(--line)', background: 'var(--bg)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                  {t('settings.reset_prefs')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                  {t('settings.reset_prefs.sub')}
                </div>
              </button>
            </div>
            <div>
              <button
                onClick={() => setConfirm('data')}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 8,
                  border: '1px solid #c0392b', background: 'var(--bg)',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: '#c0392b' }}>
                  {t('settings.clear_data')}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
                  {t('settings.clear_data.sub')}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {confirm !== null && (
        <div
          onClick={() => setConfirm(null)}
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
            <p style={{ fontSize: 16, color: 'var(--ink)', margin: '0 0 24px', lineHeight: 1.5 }}>
              {confirm === 'prefs' ? t('settings.reset_prefs.confirm') : t('settings.clear_data.confirm')}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirm(null)}
                className="hs-btn hs-btn--ghost"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {t('settings.cancel')}
              </button>
              <button
                onClick={confirm === 'prefs' ? handleResetPrefs : handleClearData}
                style={{
                  flex: 1, padding: '12px 20px', borderRadius: 8,
                  border: 'none', background: '#c0392b',
                  color: '#fff', fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                {t('settings.confirm_action')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
