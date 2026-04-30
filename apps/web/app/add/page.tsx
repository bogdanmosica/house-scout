'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePropertyStore } from '@house-scout/stores'
import type { PropertyType, PropertyMode, PropertyTone } from '@house-scout/types'
import { Icon } from '../../components/ui/icon'

const TONES: PropertyTone[] = ['terra', 'sage', 'sky', 'gold']

function randomTone(): PropertyTone {
  return TONES[Math.floor(Math.random() * TONES.length)] ?? 'terra'
}

function AddForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const addProperty = usePropertyStore((s) => s.addProperty)

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
        Back
      </button>
      <div style={{ marginBottom: 32 }}>
        <div className="hs-label">
          {type.charAt(0).toUpperCase() + type.slice(1)} · {mode === 'rent' ? 'Renting' : 'Buying'}
        </div>
        <h1 className="hs-h-serif" style={{ fontSize: 28, margin: '4px 0 0' }}>Add a property</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>Property name *</label>
          <input
            style={inputStyle}
            placeholder="e.g. Corner Flat on Maple"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Address *</label>
          <input
            style={inputStyle}
            placeholder="e.g. 412 Maple Ave"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>City</label>
          <input
            style={inputStyle}
            placeholder="e.g. East Village"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Price</label>
          <input
            style={inputStyle}
            placeholder={mode === 'rent' ? 'e.g. $2,850/mo' : 'e.g. $485,000'}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Beds</label>
            <input
              style={inputStyle}
              type="number" min={0} max={20}
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Baths</label>
            <input
              style={inputStyle}
              type="number" min={0} max={20}
              value={baths}
              onChange={(e) => setBaths(Number(e.target.value))}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Sqft</label>
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
          Start scouting →
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
