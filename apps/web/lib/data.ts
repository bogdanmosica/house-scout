import type { RoomDef, Question, Property, Room, PropertyMode, QuestionBank } from '@house-scout/types'

export const ROOMS: RoomDef[] = [
  { id: 'entrance', name: 'Entrance',     desc: 'First impressions',     icon: 'door'   },
  { id: 'living',   name: 'Living Room',  desc: 'Light, layout, flow',   icon: 'sun'    },
  { id: 'kitchen',  name: 'Kitchen',      desc: 'Condition & workflow',  icon: 'window' },
  { id: 'bedroom',  name: 'Bedrooms',     desc: 'Comfort & quiet',       icon: 'bed'    },
  { id: 'bath',     name: 'Bathrooms',    desc: 'Fixtures & plumbing',   icon: 'bath'   },
  { id: 'outdoor',  name: 'Outdoor',      desc: 'Balcony, garden, view', icon: 'leaf'   },
  { id: 'neighbor', name: 'Neighborhood', desc: 'Commute, noise, fit',   icon: 'pin'    },
]

export const QUESTIONS_FULL: Record<Room, Question[]> = {
  entrance: [
    { id: 'curb', room: 'entrance', text: 'How strong is the curb appeal?', sub: 'Door, entry, hallway first impression', kind: 'stars', banks: ['full'] },
    { id: 'smell', room: 'entrance', text: 'How does it smell when you walk in?', kind: 'chips', options: [
      { label: 'Fresh & clean', w: 5 }, { label: 'Neutral', w: 4 },
      { label: 'A little musty', w: 2 }, { label: 'Strong odors', w: 1 },
    ], banks: ['full'] },
  ],
  living: [
    { id: 'light', room: 'living', text: 'Natural light in the main room?', kind: 'scale', low: 'Dim', high: 'Radiant', banks: ['full'] },
    { id: 'layout', room: 'living', text: 'Does the layout flow well?', kind: 'chips', options: [
      { label: 'Intuitive', w: 5 }, { label: 'Works fine', w: 4 },
      { label: 'Awkward spots', w: 2 }, { label: 'Choppy', w: 1 },
    ], banks: ['full'] },
    { id: 'ceiling', room: 'living', text: 'Ceiling height feels…', kind: 'chips', options: [
      { label: 'Airy', w: 5 }, { label: 'Standard', w: 3 }, { label: 'Low', w: 2 },
    ], banks: ['full'] },
  ],
  kitchen: [
    { id: 'k_condition', room: 'kitchen', text: 'Kitchen condition overall?', kind: 'stars', banks: ['full'] },
    { id: 'appliances', room: 'kitchen', text: 'Appliances included & working?', kind: 'chips', options: [
      { label: 'All new', w: 5 }, { label: 'Good shape', w: 4 },
      { label: 'Aging but fine', w: 3 }, { label: 'Needs replacing', w: 1 },
    ], banks: ['full'] },
    { id: 'counter', room: 'kitchen', text: 'Counter & storage space?', kind: 'scale', low: 'Cramped', high: 'Generous', banks: ['full'] },
  ],
  bedroom: [
    { id: 'bed_size', room: 'bedroom', text: 'Primary bedroom size?', kind: 'chips', options: [
      { label: 'Spacious', w: 5 }, { label: 'Comfortable', w: 4 }, { label: 'Snug', w: 2 },
    ], banks: ['full'] },
    { id: 'quiet', room: 'bedroom', text: 'How quiet is it?', kind: 'scale', low: 'Noisy', high: 'Silent', banks: ['full'] },
    { id: 'closet', room: 'bedroom', text: 'Closet / storage situation?', kind: 'stars', banks: ['full'] },
  ],
  bath: [
    { id: 'bath_cond', room: 'bath', text: 'Bathroom condition?', kind: 'stars', banks: ['full'] },
    { id: 'pressure', room: 'bath', text: 'Did you test water pressure?', kind: 'chips', options: [
      { label: 'Strong', w: 5 }, { label: 'Okay', w: 3 }, { label: 'Weak', w: 1 }, { label: "Didn't test", w: 3 },
    ], banks: ['full'] },
    { id: 'ventilation', room: 'bath', text: 'Ventilation in the bathroom?', kind: 'yesno', yesLabel: 'Has window/fan', noLabel: 'Neither', banks: ['full'] },
  ],
  outdoor: [
    { id: 'out_access', room: 'outdoor', text: 'Any outdoor space?', kind: 'chips', options: [
      { label: 'Private garden', w: 5 }, { label: 'Balcony/terrace', w: 4 },
      { label: 'Shared outdoor', w: 3 }, { label: 'None', w: 1 },
    ], banks: ['full'] },
    { id: 'view', room: 'outdoor', text: 'Rate the view from the main windows', kind: 'stars', banks: ['full'] },
  ],
  neighbor: [
    { id: 'commute', room: 'neighbor', text: 'Commute to work/school?', kind: 'chips', options: [
      { label: 'Under 20 min', w: 5 }, { label: '20–40 min', w: 4 },
      { label: '40–60 min', w: 2 }, { label: 'Over an hour', w: 1 },
    ], banks: ['full'] },
    { id: 'walkable', room: 'neighbor', text: 'How walkable is the area?', kind: 'scale', low: 'Car-only', high: 'Everything nearby', banks: ['full'] },
    { id: 'vibe', room: 'neighbor', text: 'Does the neighborhood vibe fit you?', kind: 'stars', banks: ['full'] },
  ],
}

export const QUESTIONS_LIGHT: Record<Room, Question[]> = {
  entrance: [{ id: 'curb',        room: 'entrance', text: 'First impression?',            kind: 'stars', banks: ['light'] }],
  living:   [{ id: 'light',       room: 'living',   text: 'Natural light?',               kind: 'scale', low: 'Dim', high: 'Radiant', banks: ['light'] }],
  kitchen:  [{ id: 'k_condition', room: 'kitchen',  text: 'Kitchen condition?',           kind: 'stars', banks: ['light'] }],
  bedroom:  [{ id: 'quiet',       room: 'bedroom',  text: 'How quiet is the bedroom?',    kind: 'scale', low: 'Noisy', high: 'Silent', banks: ['light'] }],
  bath:     [{ id: 'bath_cond',   room: 'bath',     text: 'Bathroom condition?',          kind: 'stars', banks: ['light'] }],
  outdoor:  [{ id: 'view',        room: 'outdoor',  text: 'The view?',                    kind: 'stars', banks: ['light'] }],
  neighbor: [{ id: 'vibe',        room: 'neighbor', text: 'Neighborhood vibe?',           kind: 'stars', banks: ['light'] }],
}

export const BUY_EXTRAS: Partial<Record<Room, Question[]>> = {
  neighbor: [{ id: 'resale',     room: 'neighbor', text: 'Long-term resale prospects?',       kind: 'scale', low: 'Declining', high: 'Rising',  banks: ['full'] }],
  entrance: [{ id: 'structural', room: 'entrance', text: 'Any visible structural concerns?',  kind: 'yesno', yesLabel: 'None visible', noLabel: 'Some worry', banks: ['full'] }],
}

export const RENT_EXTRAS: Partial<Record<Room, Question[]>> = {
  neighbor: [{ id: 'lease', room: 'neighbor', text: 'Lease flexibility?', kind: 'chips', options: [
    { label: '12mo+ renewable', w: 5 }, { label: 'Standard 12mo', w: 4 },
    { label: '6mo only', w: 3 }, { label: 'Month-to-month', w: 3 },
  ], banks: ['full'] }],
}

export function getQuestions(mode: PropertyMode, bank: QuestionBank = 'full'): Record<Room, Question[]> {
  const base = bank === 'light' ? QUESTIONS_LIGHT : QUESTIONS_FULL
  const extras = mode === 'buy' ? BUY_EXTRAS : RENT_EXTRAS
  const out = {} as Record<Room, Question[]>
  for (const r of ROOMS) {
    out[r.id] = [...(base[r.id] ?? []), ...(extras[r.id] ?? [])]
  }
  return out
}

export const SEED_PROPERTIES: Property[] = [
  {
    id: 'p1', name: 'Corner Flat on Maple', address: '412 Maple Ave', city: 'East Village',
    type: 'Apartment', mode: 'rent', price: '$2,850/mo', beds: 2, baths: 1, sqft: 860,
    rating: 4.4, tone: 'terra', status: 'scouted',
    highlights: ['Great light', 'Quiet block', 'Near park'],
    notes: 'Upstairs neighbors felt quiet on a Tuesday afternoon. Kitchen has original hardwood that creaks charmingly.',
    createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'p2', name: 'Garden Cottage', address: '28 Willow Lane', city: 'Brookside',
    type: 'House', mode: 'buy', price: '$485,000', beds: 3, baths: 2, sqft: 1420,
    rating: 3.8, tone: 'sage', status: 'scouted',
    highlights: ['Private garden', 'Needs kitchen work', 'Owner motivated'],
    notes: 'Beautiful tree in the backyard. Kitchen cabinets clearly from the 80s — budget $15k for redo.',
    createdAt: '2026-04-05T14:00:00Z', updatedAt: '2026-04-05T14:00:00Z',
  },
  {
    id: 'p3', name: 'Tower 12B', address: 'Harborfront Tower', city: 'Downtown',
    type: 'Condo', mode: 'buy', price: '$612,000', beds: 1, baths: 1, sqft: 720,
    rating: 4.1, tone: 'sky', status: 'scouted',
    highlights: ['Skyline view', 'Building gym', 'Small bedroom'],
    notes: 'View is absurd. Bedroom barely fits a queen — maybe for a single buyer or couple only.',
    createdAt: '2026-04-10T09:00:00Z', updatedAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'p4', name: 'Oak Street Loft', address: '91 Oak St', city: 'Arts District',
    type: 'Loft', mode: 'rent', price: '$3,200/mo', beds: 1, baths: 1, sqft: 1100,
    rating: 3.5, tone: 'gold', status: 'scouted',
    highlights: ['High ceilings', 'Loud neighbors'],
    notes: 'Ceilings felt magical; then a bass line started up next door at 4pm.',
    createdAt: '2026-04-12T16:00:00Z', updatedAt: '2026-04-12T16:00:00Z',
  },
  {
    id: 'p5', name: 'Linden Cottage', address: '7 Linden Ct', city: 'Greenside',
    type: 'House', mode: 'buy', price: '$520,000', beds: 3, baths: 2, sqft: 1550,
    rating: null, tone: 'sage', status: 'todo',
    highlights: [], notes: '',
    createdAt: '2026-04-15T11:00:00Z', updatedAt: '2026-04-15T11:00:00Z',
  },
]
