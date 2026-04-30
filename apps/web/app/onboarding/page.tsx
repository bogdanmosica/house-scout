'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isOnboarded, markOnboarded } from '../../lib/onboarding'
import { useTranslation } from '../../lib/i18n'

const SLIDE_ICONS = ['🏡', '🚪', '⭐']
const SLIDE_KEYS = ['s0', 's1', 's2'] as const

export default function OnboardingPage() {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    if (isOnboarded()) router.replace('/')
  }, [router])

  const isLast = slide === SLIDE_KEYS.length - 1
  const key = SLIDE_KEYS[slide]!

  function handleSkip() {
    markOnboarded()
    router.push('/')
  }

  function handleNext() {
    if (isLast) {
      markOnboarded()
      router.push('/')
    } else {
      setSlide((s) => s + 1)
    }
  }

  return (
    <div style={{
      minHeight: '100svh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '40px 24px',
      maxWidth: 480, margin: '0 auto',
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', width: '100%',
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'var(--accent-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, marginBottom: 32,
        }}>
          {SLIDE_ICONS[slide]}
        </div>
        <h1 className="hs-h-serif" style={{ fontSize: 32, margin: '0 0 16px', color: 'var(--ink)' }}>
          {t(`onboarding.${key}.title`)}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink-2)', margin: 0, maxWidth: 320 }}>
          {t(`onboarding.${key}.sub`)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
        {SLIDE_KEYS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === slide ? 20 : 8, height: 8, borderRadius: 4,
              background: i === slide ? 'var(--accent)' : 'var(--ink-4)',
              transition: 'width 0.2s ease',
            }}
          />
        ))}
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
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
  )
}
