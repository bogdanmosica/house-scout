export type PropertyMode = 'rent' | 'buy'
export type PropertyTone = 'terra' | 'sage' | 'sky' | 'gold'
export type PropertyStatus = 'scouted' | 'todo'

export type Room =
  | 'entrance'
  | 'living'
  | 'kitchen'
  | 'bedroom'
  | 'bath'
  | 'outdoor'
  | 'neighbor'

export const ROOM_ORDER: Room[] = [
  'entrance', 'living', 'kitchen', 'bedroom', 'bath', 'outdoor', 'neighbor',
]

export type QuestionKind = 'stars' | 'scale' | 'chips' | 'yesno'
export type QuestionBank = 'full' | 'light'

export interface RoomDef {
  id: Room
  name: string
  desc: string
  icon: string
}

export interface ChipOption {
  label: string
  w: number
}

export interface Property {
  id: string
  name: string
  address: string
  city: string
  type: string
  mode: PropertyMode
  price: string
  beds: number
  baths: number
  sqft: number
  rating: number | null
  tone: PropertyTone
  status: PropertyStatus
  highlights: string[]
  notes: string
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  room: Room
  kind: QuestionKind
  text: string
  sub?: string
  low?: string
  high?: string
  options?: ChipOption[]
  yesLabel?: string
  noLabel?: string
  modes?: PropertyMode[]
  banks: QuestionBank[]
}

export type AnswerRaw = number | boolean | null

export interface RoomScore {
  room: Room
  score: number | null
  answered: number
  total: number
}

export interface ScoutSession {
  propertyId: string
  bank: QuestionBank
  mode: PropertyMode
  answers: Record<string, AnswerRaw>
  currentRoom: Room
  startedAt: string
}
