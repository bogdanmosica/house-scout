'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markOnboarded } from '../../lib/onboarding'

const SLIDES = [
  {
    title: 'Scout smarter',
    subtitle: 'Stop second-guessing. Rate every room as you walk through.',
  },
  {
    title: 'Room by room',
    subtitle: 'Entrance, kitchen, bedroom, bath — a structured checklist for every space.',
  },
  {
    title: 'Get a score',
    subtitle: 'Walk out with a 1–5 star rating so you can compare properties head to head.',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [slide, setSlide] = useState(0)

  const isLast = slide === SLIDES.length - 1
  const current = SLIDES[slide]

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
    <div
      style={{
        minHeight: '100svh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {/* Slide content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* Icon area */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            marginBottom: 32,
          }}
        >
          {slide === 0 ? '🏡' : slide === 1 ? '🚪' : '⭐'}
        </div>

        <h1
          className="hs-h-serif"
          style={{ fontSize: 32, margin: '0 0 16px', color: 'var(--ink)' }}
        >
          {current?.title}
        </h1>

        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: 'var(--ink-2)',
            margin: 0,
            maxWidth: 320,
          }}
        >
          {current?.subtitle}
        </p>
      </div>

      {/* Dot indicators */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 40,
        }}
      >
        {SLIDES.map((_, i) => (
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

      {/* Actions */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          onClick={handleNext}
          className="hs-btn hs-btn--primary"
          style={{ width: '100%' }}
        >
          {isLast ? 'Start scouting →' : 'Next →'}
        </button>

        {!isLast && (
          <button
            onClick={handleSkip}
            className="hs-btn hs-btn--ghost"
            style={{ width: '100%' }}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
