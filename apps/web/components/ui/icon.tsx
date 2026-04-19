export type IconName =
  | 'home' | 'plus' | 'search' | 'heart' | 'bed' | 'bath' | 'sqft'
  | 'pin' | 'arrow' | 'check' | 'x' | 'chevron' | 'chevron-left' | 'chevron-down'
  | 'sparkle' | 'camera' | 'compare' | 'grid' | 'user' | 'door' | 'window'
  | 'sun' | 'leaf' | 'moon' | 'settings' | 'bell' | 'trash' | 'share'
  | 'image' | 'bookmark'

interface IconProps {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
}

export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.75 }: IconProps) {
  const p = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: color, strokeWidth,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'home':        return <svg {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>
    case 'plus':        return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>
    case 'search':      return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
    case 'heart':       return <svg {...p}><path d="M20.8 5.6a5.5 5.5 0 00-9-1.8L12 4.5l-.3-.7a5.5 5.5 0 10-7.8 7.8l7.3 7.3a1 1 0 001.4 0l7.3-7.3a5.5 5.5 0 00-.1-6"/></svg>
    case 'bed':         return <svg {...p}><path d="M3 18V8"/><path d="M21 18V12a2 2 0 00-2-2H3"/><path d="M3 14h18"/></svg>
    case 'bath':        return <svg {...p}><path d="M4 12V5a2 2 0 014-.5"/><path d="M8 7h2"/><path d="M3 12h18v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3z"/><path d="M7 19v2M17 19v2"/></svg>
    case 'sqft':        return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
    case 'pin':         return <svg {...p}><path d="M12 22s-7-7.5-7-13a7 7 0 0114 0c0 5.5-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
    case 'arrow':       return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case 'check':       return <svg {...p}><path d="M5 13l4 4L19 7"/></svg>
    case 'x':           return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>
    case 'chevron':     return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>
    case 'chevron-left':return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>
    case 'chevron-down':return <svg {...p}><path d="M6 9l6 6 6-6"/></svg>
    case 'sparkle':     return <svg {...p}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"/><path d="M19 15l.8 1.8L21.6 17.6l-1.8.8L19 20.2l-.8-1.8L16.4 17.6l1.8-.8L19 15z"/></svg>
    case 'camera':      return <svg {...p}><path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="4"/></svg>
    case 'compare':     return <svg {...p}><path d="M3 6h7v14"/><path d="M21 18h-7V4"/></svg>
    case 'grid':        return <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    case 'user':        return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
    case 'door':        return <svg {...p}><path d="M6 3h12v18H6z"/><circle cx="14.5" cy="12" r="0.8" fill={color} stroke="none"/></svg>
    case 'window':      return <svg {...p}><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/></svg>
    case 'sun':         return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>
    case 'leaf':        return <svg {...p}><path d="M5 19c6-1 11-6 12-14 0 0-8 0-12 4s-4 10 0 10z"/><path d="M5 19c2-4 5-7 9-9"/></svg>
    case 'moon':        return <svg {...p}><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></svg>
    case 'settings':    return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8h0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>
    case 'bell':        return <svg {...p}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 003.4 0"/></svg>
    case 'trash':       return <svg {...p}><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
    case 'share':       return <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.9 4M15.4 6.5l-6.8 4"/></svg>
    case 'image':       return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>
    case 'bookmark':    return <svg {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
    default:            return null
  }
}
