import type { Question, AnswerRaw } from '@house-scout/types'

export function scoreAnswer(q: Question, raw: AnswerRaw): number | null {
  if (raw == null) return null
  if (q.kind === 'stars' || q.kind === 'scale') {
    return typeof raw === 'number' ? raw : null
  }
  if (q.kind === 'chips') {
    return typeof raw === 'number' ? (q.options?.[raw]?.w ?? null) : null
  }
  if (q.kind === 'yesno') {
    return raw === true ? 5 : raw === false ? 1 : null
  }
  if (q.kind === 'radio') {
    const w = typeof raw === 'number' ? (q.options?.[raw]?.w ?? null) : null
    if (w === null) return null
    // Normalize 0–10 weight to 1–5 scale: 0→1, 5→3, 10→5
    return (w / 10) * 4 + 1
  }
  return null
}

export function computeRoomScore(
  room: string,
  questionsByRoom: Record<string, Question[]>,
  answers: Record<string, AnswerRaw>
): number | null {
  const qs = questionsByRoom[room] ?? []
  const scores = qs
    .map((q) => scoreAnswer(q, answers[`${room}.${q.id}`] ?? null))
    .filter((s): s is number => s !== null)
  if (scores.length === 0) return null
  return scores.reduce((a, b) => a + b, 0) / scores.length
}

export function computeRating(
  questionsByRoom: Record<string, Question[]>,
  answers: Record<string, AnswerRaw>
): { overall: number; answered: number; total: number } {
  const scores: number[] = []
  let total = 0
  for (const [room, qs] of Object.entries(questionsByRoom)) {
    total += qs.length
    for (const q of qs) {
      const s = scoreAnswer(q, answers[`${room}.${q.id}`] ?? null)
      if (s !== null) scores.push(s)
    }
  }
  if (scores.length === 0) return { overall: 0, answered: 0, total }
  return {
    overall: scores.reduce((a, b) => a + b, 0) / scores.length,
    answered: scores.length,
    total,
  }
}
