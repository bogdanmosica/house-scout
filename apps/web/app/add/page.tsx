'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import type { PropertyType, PropertyMode, PropertyTone } from '@house-scout/types'
import { Icon } from '../../components/ui/icon'
import { useTranslation } from '../../lib/i18n'

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
  const [price, setPrice] = useState('')
  const [beds, setBeds] = useState(1)
  const [baths, setBaths] = useState(1)
  const [sqft, setSqft] = useState(0)

  const canSubmit = name.trim().length > 0 && address.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    // eslint-disable-next-line react-hooks/purity
    const id = `p${Date.now()}`
    addProperty({
      id,
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      type,
      mode,
      price: price.trim(),
      beds,
      baths,
      sqft,
      rating: null,
      tone: randomTone(),
      status: 'todo',
      highlights: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    router.push(`/scout/${id}/start`)
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1px solid var(--line-strong)',
    background: 'var(--bg-elev)',
    color: 'var(--ink)',
    borderRadius: 'var(--r-input)',
    fontSize: 14, fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: 'var(--ink-3)',
    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    display: 'block', marginBottom: 6,
  }

  const typeLabel = t(`sheet.${type}`)
  const modeLabel = mode === 'rent' ? t('sheet.rent') : t('sheet.buy')

  return (
    <div style={{ minHeight: '100svh', background: 'var(--bg)', padding: '48px 20px 80px' }}>
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
        {t('add.back')}
      </button>
      <div style={{ marginBottom: 32 }}>
        <div className="hs-label">{typeLabel} · {modeLabel}</div>
        <h1 className="hs-h-serif" style={{ fontSize: 28, margin: '4px 0 0' }}>{t('add.title')}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>{t('add.name')}</label>
          <input
            style={inputStyle}
            placeholder={t('add.name.ph')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>{t('add.address')}</label>
          <input
            style={inputStyle}
            placeholder={t('add.address.ph')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>{t('add.city')}</label>
          <input
            style={inputStyle}
            placeholder={t('add.city.ph')}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>{t('add.price')}</label>
          <input
            style={inputStyle}
            placeholder={mode === 'rent' ? t('add.price.ph.rent') : t('add.price.ph.buy')}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('add.beds')}</label>
            <input
              style={inputStyle}
              type="number" min={0} max={20}
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('add.baths')}</label>
            <input
              style={inputStyle}
              type="number" min={0} max={20}
              value={baths}
              onChange={(e) => setBaths(Number(e.target.value))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>{t('add.sqft')}</label>
            <input
              style={inputStyle}
              type="number" min={0}
              value={sqft || ''}
              placeholder="0"
              onChange={(e) => setSqft(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="hs-btn hs-btn--primary"
          style={{ width: '100%', marginTop: 8, opacity: canSubmit ? 1 : 0.4 }}
        >
          {t('add.cta')}
        </button>
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
