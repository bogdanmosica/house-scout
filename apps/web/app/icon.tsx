import { ImageResponse } from 'next/og'

export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1f1b17',
          borderRadius: '24px',
        }}
      >
        <span
          style={{
            color: '#d97757',
            fontSize: 100,
            fontFamily: 'serif',
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          H
        </span>
      </div>
    ),
    { ...size },
  )
}
