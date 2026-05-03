'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import type { PropertyType, PropertyMode, PropertyTone } from '@house-scout/types'
import { Icon } from '../../components/ui/icon'
import { useTranslation } from '../../lib/i18n'
import { CityAutocomplete } from '../../components/ui/city-autocomplete'

const TONES: PropertyTone[] = ['terra', 'sage', 'sky', 'gold']

function randomTone(): PropertyTone {
  return TONES[Math.floor(Math.random() * TONES.length)] ?? 'terra'
}

function AddForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addProperty = usePropertyStore((s) => s.addProperty)
  const { t } = useTranslation()

  const type = (searchParams.get('type') as PropertyType) ?? 'apartment'
  const mode = (searchParams.get('mode') as PropertyMode) ?? 'rent'

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [price, setPrice] = useState<string>('')
  const [beds, setBeds] = useState(1)
  const [baths, setBaths] = useState(1)
  const [sqm, setSqm] = useState<string>('')

  const canSubmit = name.trim().length > 0 && address.trim().length > 0

  const createProperty = () => {
    const id = `p${Date.now()}`
    addProperty({
      id,
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      type,
      mode,
      price: parseFloat(price) || 0,
      beds,
      baths,
      sqm: parseFloat(sqm) || 0,
      rating: null,
      tone: randomTone(),
      status: 'todo',
      highlights: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return id
  }

  const handleSaveLater = () => {
    if (!canSubmit) return
    createProperty()
    router.push('/')
  }

  const handleScoutNow = () => {
    if (!canSubmit) return
    const id = createProperty()
    router.push(`/scout/${id}/start`)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid var(--line-strong)',
    background: 'var(--bg-elev)',
    color: 'var(--ink)',
    borderRadius: 'var(--r-input)',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--ink-3)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  }

  const stepperBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    background: 'var(--bg)',
    border: '1px solid var(--line-strong)',
    borderRadius: '50%',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    color: 'var(--ink)',
    flexShrink: 0,
  }

  const typeLabel = t(`sheet.${type}`)
  const modeLabel = mode === 'rent' ? t('sheet.rent') : t('sheet.buy')

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)', padding: '48px 20px 80px' }}>
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ink-3)',
          fontSize: 13,
          fontFamily: 'inherit',
          marginBottom: 24,
          padding: 0,
        }}
      >
        <Icon name="chevron-left" size={14} />
        {t('add.back')}
      </button>

      <div style={{ marginBottom: 32 }}>
        <div className="hs-label">{typeLabel} · {modeLabel}</div>
        <h1 className="hs-h-serif" style={{ fontSize: 28, margin: '4px 0 0' }}>{t('add.title')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>{t('add.name')}</label>
          <input
            style={inputStyle}
            placeholder={t('add.name.ph')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label style={labelStyle}>{t('add.address')}</label>
          <input
            style={inputStyle}
            placeholder={t('add.address.ph')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* City — autocomplete */}
        <div>
          <label style={labelStyle}>{t('add.city')}</label>
          <CityAutocomplete
            value={city}
            onChange={setCity}
            placeholder={t('add.city.ph')}
          />
        </div>

        {/* Price */}
        <div>
          <label style={labelStyle}>{t('add.price')}</label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--line-strong)',
              background: 'var(--bg-elev)',
              borderRadius: 'var(--r-input)',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                padding: '0 10px',
                color: 'var(--ink-3)',
                fontSize: 14,
                fontFamily: 'inherit',
                flexShrink: 0,
              }}
            >
              €
            </span>
            <input
              style={{
                flex: 1,
                padding: '12px 4px',
                border: 'none',
                background: 'transparent',
                color: 'var(--ink)',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
              inputMode="numeric"
              placeholder={mode === 'rent' ? t('add.price.ph.rent') : t('add.price.ph.buy')}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {mode === 'rent' && (
              <span
                style={{
                  padding: '0 10px',
                  color: 'var(--ink-3)',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                /mo
              </span>
            )}
          </div>
        </div>

        {/* Beds / Baths / Sqm */}
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Beds stepper */}
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('add.beds')}</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <button
                type="button"
                style={stepperBtnStyle}
                onClick={() => setBeds((v) => Math.max(0, v - 1))}
                aria-label="Decrease beds"
              >
                −
              </button>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  minWidth: 32,
                  textAlign: 'center',
                  color: 'var(--ink)',
                }}
              >
                {beds}
              </span>
              <button
                type="button"
                style={stepperBtnStyle}
                onClick={() => setBeds((v) => Math.min(20, v + 1))}
                aria-label="Increase beds"
              >
                +
              </button>
            </div>
          </div>

          {/* Baths stepper */}
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('add.baths')}</label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <button
                type="button"
                style={stepperBtnStyle}
                onClick={() => setBaths((v) => Math.max(0, v - 1))}
                aria-label="Decrease baths"
              >
                −
              </button>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  minWidth: 32,
                  textAlign: 'center',
                  color: 'var(--ink)',
                }}
              >
                {baths}
              </span>
              <button
                type="button"
                style={stepperBtnStyle}
                onClick={() => setBaths((v) => Math.min(20, v + 1))}
                aria-label="Increase baths"
              >
                +
              </button>
            </div>
          </div>

          {/* Sqm */}
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('add.sqft')}</label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--line-strong)',
                background: 'var(--bg-elev)',
                borderRadius: 'var(--r-input)',
                overflow: 'hidden',
              }}
            >
              <input
                style={{
                  flex: 1,
                  padding: '12px 4px 12px 14px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ink)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  minWidth: 0,
                }}
                inputMode="numeric"
                placeholder="0"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
              />
              <span
                style={{
                  padding: '0 8px',
                  color: 'var(--ink-3)',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  flexShrink: 0,
                }}
              >
                m²
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <button
            onClick={handleScoutNow}
            disabled={!canSubmit}
            className="hs-btn hs-btn--primary"
            style={{ width: '100%', opacity: canSubmit ? 1 : 0.4 }}
          >
            {t('add.cta.scout')}
          </button>
          <button
            onClick={handleSaveLater}
            disabled={!canSubmit}
            className="hs-btn"
            style={{ width: '100%', opacity: canSubmit ? 1 : 0.4 }}
          >
            {t('add.cta.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AddPropertyPage() {
  return (
    <Suspense>
      <AddForm />
    </Suspense>
  )
}
