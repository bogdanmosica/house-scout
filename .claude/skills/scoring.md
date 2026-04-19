# Skill: scoring

House Scout scoring system reference. Read before implementing or modifying any rating logic.

## Answer → Score normalization

All question kinds normalize to 1–5:

```ts
function scoreAnswer(q, answer) {
  if (answer == null) return null;
  if (q.kind === 'stars' || q.kind === 'scale') return answer; // already 1–5
  if (q.kind === 'chips') return q.options[answer]?.w ?? null; // option weight
  if (q.kind === 'yesno') return answer ? 5 : 1;
}
```

## Room score
```ts
roomScore = avg(scoreAnswer(q, answers[`${roomId}.${q.id}`]) for all answered q in room)
// Returns null if no questions answered in that room
```

## Overall rating
```ts
overall = avg(all non-null scoreAnswer results across all rooms)
// Returns { overall: 0–5, answered: number, total: number }
```

## Display rules
- Score number: Fraunces font, 72px on result screen, 22px in headers
- Stars: `StarRow` component, fill = `var(--accent)`, empty = `var(--ink-4)`
- Half-stars supported (round to nearest 0.5 for display)
- Room chips show score when done: `{score.toFixed(1)}★`
- Comparison bars: current property vs other scouted properties (percentage of max)

## Weight conventions for chips options
- 5 = best outcome (fresh/clean, spacious, under 20 min commute)
- 4 = good
- 3 = acceptable / neutral
- 2 = below average
- 1 = worst / deal-breaker signal

## Edge cases
- Unanswered questions excluded from avg (don't penalize for skipping)
- Room with 0 answered → no chip score shown, not counted in overall
- `light` bank has 1q/room → faster but lower confidence rating
