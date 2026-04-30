import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'House Scout',
    short_name: 'House Scout',
    description: 'Mobile-first property scouting app',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf8f3',
    theme_color: '#d97757',
    icons: [
      { src: '/icon', sizes: '192x192', type: 'image/png', purpose: 'any' },
    ],
  }
}
