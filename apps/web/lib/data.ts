import type { RoomDef, InspectionCategoryDef, Question, Property, Room, InspectionCategory, PropertyMode, QuestionBank } from '@house-scout/types'

export const ROOMS: RoomDef[] = [
  { id: 'entrance', name: 'Entrance',     desc: 'First impressions',     icon: 'door'   },
  { id: 'living',   name: 'Living Room',  desc: 'Light, layout, flow',   icon: 'sun'    },
  { id: 'kitchen',  name: 'Kitchen',      desc: 'Condition & workflow',  icon: 'window' },
  { id: 'bedroom',  name: 'Bedrooms',     desc: 'Comfort & quiet',       icon: 'bed'    },
  { id: 'bath',     name: 'Bathrooms',    desc: 'Fixtures & plumbing',   icon: 'bath'   },
  { id: 'outdoor',  name: 'Outdoor',      desc: 'Balcony, garden, view', icon: 'leaf'   },
  { id: 'neighbor', name: 'Neighborhood', desc: 'Commute, noise, fit',   icon: 'pin'    },
]

export const INSPECTION_CATEGORIES: InspectionCategoryDef[] = [
  { id: 'utilities',   name: 'Utilities',             desc: 'Water, sewage, electricity, gas',       icon: 'zap'    },
  { id: 'foundation',  name: 'Foundation',             desc: 'Soil, slab, waterproofing',             icon: 'layers' },
  { id: 'structure',   name: 'Structure',              desc: 'Concrete, steel reinforcement',         icon: 'grid'   },
  { id: 'windows',     name: 'Windows',                desc: 'Sealing, glazing quality',              icon: 'square' },
  { id: 'thermal',     name: 'Thermal & Plaster',      desc: 'Insulation type, thickness, finish',    icon: 'wind'   },
  { id: 'electrical',  name: 'Electrical & Plumbing',  desc: 'Panel compliance, sanitary system',     icon: 'cpu'    },
  { id: 'roof',        name: 'Roof',                   desc: 'Structure, materials, weatherproofing', icon: 'home'   },
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

export const INSPECTION_QUESTIONS: Record<InspectionCategory, Question[]> = {
  utilities: [
    {
      id: 'util_1', room: 'utilities', kind: 'radio', banks: ['full'],
      text: 'Is the property connected to water, sewage, electricity and gas?',
      options: [
        { label: 'Yes, fully connected', w: 10 },
        { label: 'Partially connected (only at gate)', w: 5 },
        { label: 'Not connected', w: 0 },
      ],
    },
    {
      id: 'util_2', room: 'utilities', kind: 'radio', banks: ['full'],
      text: 'Where are the utilities? In the yard or only at the gate?',
      options: [
        { label: 'In the yard, close to the house', w: 10 },
        { label: 'At the gate, with extension possibility', w: 7 },
        { label: 'Unspecified or uncertain', w: 0 },
      ],
    },
  ],
  foundation: [
    {
      id: 'found_1', room: 'foundation', kind: 'radio', banks: ['full'],
      text: 'Was the foundation built on well-compacted soil?',
      options: [
        { label: 'Yes, soil was properly compacted', w: 10 },
        { label: 'Partially compacted', w: 5 },
        { label: 'Not properly compacted', w: 0 },
      ],
    },
    {
      id: 'found_2', room: 'foundation', kind: 'radio', banks: ['full'],
      text: 'Were protection materials used under the first slab (gravel, polystyrene, waterproofing)?',
      options: [
        { label: 'Yes, all recommended materials used', w: 10 },
        { label: 'Only some materials', w: 5 },
        { label: 'No protection materials used', w: 0 },
      ],
    },
  ],
  structure: [
    {
      id: 'struct_1', room: 'structure', kind: 'radio', banks: ['full'],
      text: 'What type of concrete was used for structural elements?',
      options: [
        { label: 'High-strength concrete (e.g. C30/C35)', w: 10 },
        { label: 'Standard concrete (e.g. C20)', w: 7 },
        { label: 'Specifications uncertain', w: 0 },
      ],
    },
    {
      id: 'struct_2', room: 'structure', kind: 'radio', banks: ['full'],
      text: 'Are steel bars in columns and beams per technical recommendations?',
      options: [
        { label: 'Meets standards and recommendations', w: 10 },
        { label: 'Below recommended count', w: 5 },
        { label: 'No appropriate reinforcement', w: 0 },
      ],
    },
  ],
  windows: [
    {
      id: 'win_1', room: 'windows', kind: 'radio', banks: ['full'],
      text: 'Are windows equipped with sealing strips for thermal efficiency?',
      options: [
        { label: 'Yes, completely sealed', w: 10 },
        { label: 'Partially — only some windows', w: 5 },
        { label: 'No sealing strips', w: 0 },
      ],
    },
    {
      id: 'win_2', room: 'windows', kind: 'radio', banks: ['full'],
      text: 'What type of double glazing was installed?',
      options: [
        { label: 'Superior thermal and acoustic insulation', w: 10 },
        { label: 'Standard double glazing', w: 5 },
        { label: 'No double glazing', w: 0 },
      ],
    },
  ],
  thermal: [
    {
      id: 'therm_1', room: 'thermal', kind: 'radio', banks: ['full'],
      text: 'What type of insulating material was used?',
      options: [
        { label: 'High-performance (e.g. basalt wool)', w: 10 },
        { label: 'Medium quality polystyrene', w: 7 },
        { label: 'Poor quality or absent', w: 0 },
      ],
    },
    {
      id: 'therm_2', room: 'thermal', kind: 'radio', banks: ['full'],
      text: 'What thickness is the thermal insulation layer?',
      options: [
        { label: 'Per standard (minimum 10–15 cm)', w: 10 },
        { label: 'Below recommended thickness', w: 5 },
        { label: 'Unknown', w: 0 },
      ],
    },
    {
      id: 'therm_3', room: 'thermal', kind: 'radio', banks: ['full'],
      text: 'What type of exterior plaster was applied?',
      options: [
        { label: 'Superior quality decorative plaster', w: 10 },
        { label: 'Standard plaster', w: 5 },
        { label: 'Poor quality plaster', w: 0 },
      ],
    },
  ],
  electrical: [
    {
      id: 'elec_1', room: 'electrical', kind: 'radio', banks: ['full'],
      text: 'Does the electrical panel meet standards (circuits, differential, protections)?',
      options: [
        { label: 'Yes, all specifications compliant', w: 10 },
        { label: 'Partially compliant', w: 5 },
        { label: 'Not compliant', w: 0 },
      ],
    },
    {
      id: 'elec_2', room: 'electrical', kind: 'radio', banks: ['full'],
      text: 'How is the plumbing system implemented?',
      options: [
        { label: 'Centralized system, per standards', w: 10 },
        { label: 'Modular with some deficiencies', w: 5 },
        { label: 'Poor quality or non-compliant', w: 0 },
      ],
    },
  ],
  roof: [
    {
      id: 'roof_1', room: 'roof', kind: 'radio', banks: ['full'],
      text: 'Does the roof have a solid structure (truss, slab over floor, etc.)?',
      options: [
        { label: 'Yes, robust and compliant', w: 10 },
        { label: 'Some structural deficiencies', w: 5 },
        { label: 'Non-compliant or unsafe', w: 0 },
      ],
    },
    {
      id: 'roof_2', room: 'roof', kind: 'radio', banks: ['full'],
      text: 'What materials were used for roof construction?',
      options: [
        { label: 'High-quality with thermal efficiency', w: 10 },
        { label: 'Standard materials, compliant', w: 5 },
        { label: 'Poor quality materials', w: 0 },
      ],
    },
  ],
}

export function getInspectionQuestions(): Record<InspectionCategory, Question[]> {
  return INSPECTION_QUESTIONS
}

export const SEED_PROPERTIES: Property[] = [
  {
    id: 'p1', name: 'Corner Flat on Maple', address: '412 Maple Ave', city: 'East Village',
    type: 'apartment', mode: 'rent', price: 2850, beds: 2, baths: 1, sqm: 80,
    rating: 4.4, tone: 'terra', status: 'scouted',
    highlights: ['Great light', 'Quiet block', 'Near park'],
    notes: 'Upstairs neighbors felt quiet on a Tuesday afternoon. Kitchen has original hardwood that creaks charmingly.',
    createdAt: '2026-04-01T10:00:00Z', updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'p2', name: 'Garden Cottage', address: '28 Willow Lane', city: 'Brookside',
    type: 'house', mode: 'buy', price: 485000, beds: 3, baths: 2, sqm: 132,
    rating: 3.8, tone: 'sage', status: 'scouted',
    highlights: ['Private garden', 'Needs kitchen work', 'Owner motivated'],
    notes: 'Beautiful tree in the backyard. Kitchen cabinets clearly from the 80s — budget $15k for redo.',
    createdAt: '2026-04-05T14:00:00Z', updatedAt: '2026-04-05T14:00:00Z',
  },
  {
    id: 'p3', name: 'Tower 12B', address: 'Harborfront Tower', city: 'Downtown',
    type: 'condo', mode: 'buy', price: 612000, beds: 1, baths: 1, sqm: 67,
    rating: 4.1, tone: 'sky', status: 'scouted',
    highlights: ['Skyline view', 'Building gym', 'Small bedroom'],
    notes: 'View is absurd. Bedroom barely fits a queen — maybe for a single buyer or couple only.',
    createdAt: '2026-04-10T09:00:00Z', updatedAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'p4', name: 'Oak Street Loft', address: '91 Oak St', city: 'Arts District',
    type: 'loft', mode: 'rent', price: 3200, beds: 1, baths: 1, sqm: 102,
    rating: 3.5, tone: 'gold', status: 'scouted',
    highlights: ['High ceilings', 'Loud neighbors'],
    notes: 'Ceilings felt magical; then a bass line started up next door at 4pm.',
    createdAt: '2026-04-12T16:00:00Z', updatedAt: '2026-04-12T16:00:00Z',
  },
  {
    id: 'p5', name: 'Linden Cottage', address: '7 Linden Ct', city: 'Greenside',
    type: 'house', mode: 'buy', price: 520000, beds: 3, baths: 2, sqm: 144,
    rating: null, tone: 'sage', status: 'todo',
    highlights: [], notes: '',
    createdAt: '2026-04-15T11:00:00Z', updatedAt: '2026-04-15T11:00:00Z',
  },
]
