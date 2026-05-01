'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@house-scout/stores'
import { useTranslation } from '../../lib/i18n'
import type { PropertyMode, QuestionBank } from '@house-scout/types'

const SLIDE_KEYS = ['s0', 's1', 's2', 's3', 's4'] as const
const LAST = SLIDE_KEYS.length - 1

export default function OnboardingPage() {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const [selectedMode, setSelectedMode] = useState<PropertyMode>('rent')
  const [selectedBank, setSelectedBank] = useState<QuestionBank>('full')
  const { t } = useTranslation()
  const onboarded = useUserStore((s) => s.onboarded)
  const setProfile = useUserStore((s) => s.setProfile)

  useEffect(() => {
    if (onboarded) router.replace('/')
  }, [onboarded, router])

  const isLast = slide === LAST
  const key = SLIDE_KEYS[slide]!

  function handleSkip() {
    setProfile(selectedMode, selectedBank)
    router.push('/')
  }

  function handleNext() {
    if (isLast) {
      setProfile(selectedMode, selectedBank)
      router.push('/')
    } else {
      setSlide((s) => s + 1)
    }
  }

  return (
    <div style={{
      height: '100svh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '48px 24px 40px',
      maxWidth: 480,
      margin: '0 auto',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        gap: 0,
      }}>
        <h1 className="hs-h-serif" style={{ fontSize: 32, margin: '0 0 16px', color: 'var(--ink)' }}>
          {t(`onboarding.${key}.title`)}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 32px', maxWidth: 320 }}>
          {t(`onboarding.${key}.sub`)}
        </p>

        {slide === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            {(['rent', 'buy'] as PropertyMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--r-lg)',
                  border: `2px solid ${selectedMode === m ? 'var(--accent)' : 'var(--line)'}`,
                  background: selectedMode === m ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: 16,
                  fontWeight: 700,
                  color: selectedMode === m ? 'var(--accent)' : 'var(--ink)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                {t(`onboarding.mode.${m}`)}
              </button>
            ))}
          </div>
        )}

        {slide === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
            {(['full', 'light'] as QuestionBank[]).map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBank(b)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--r-lg)',
                  border: `2px solid ${selectedBank === b ? 'var(--accent)' : 'var(--line)'}`,
                  background: selectedBank === b ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: 16,
                  fontWeight: 700,
                  color: selectedBank === b ? 'var(--accent)' : 'var(--ink)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                {t(`onboarding.bank.${b}`)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {SLIDE_KEYS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === slide ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slide ? 'var(--accent)' : 'var(--ink-4)',
                transition: 'width 0.2s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={handleNext} className="hs-btn hs-btn--primary" style={{ width: '100%' }}>
            {isLast ? t('onboarding.start') : t('onboarding.next')}
          </button>
          {!isLast && (
            <button onClick={handleSkip} className="hs-btn hs-btn--ghost" style={{ width: '100%' }}>
              {t('onboarding.skip')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
