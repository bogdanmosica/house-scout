'use client'
import { useState, useEffect, useRef } from 'react'

interface PhotonFeature {
  properties: {
    name: string
    country: string
    state?: string
  }
}

interface PhotonResponse {
  features: PhotonFeature[]
}

interface CityAutocompleteProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  style?: React.CSSProperties
}

export function CityAutocomplete({ value, onChange, placeholder, style }: CityAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([])
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (value.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }

    timerRef.current = setTimeout(() => {
      fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5&layer=city`,
      )
        .then((res) => res.json())
        .then((data: PhotonResponse) => {
          if (data.features && data.features.length > 0) {
            setSuggestions(data.features)
            setOpen(true)
          } else {
            setSuggestions([])
            setOpen(false)
          }
        })
        .catch(() => {
          setSuggestions([])
          setOpen(false)
        })
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value])

  const handleSelect = (feature: PhotonFeature) => {
    const { name, state } = feature.properties
    const label = state ? `${name}, ${state}` : name
    onChange(label)
    setSuggestions([])
    setOpen(false)
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
    ...style,
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            background: 'var(--bg-elev)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow-lift)',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          {suggestions.map((feature, i) => {
            const { name, state, country } = feature.properties
            const primary = state ? `${name}, ${state}` : name
            return (
              <div
                key={i}
                onMouseDown={() => handleSelect(feature)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontSize: 13,
                  background: hovered === i ? 'var(--bg)' : 'transparent',
                  transition: 'background 0.1s',
                }}
              >
                <span style={{ color: 'var(--ink)' }}>{primary}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>{country}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
