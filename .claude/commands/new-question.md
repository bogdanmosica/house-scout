# /new-question

Add a new question to the House Scout question bank.

## Usage
```
/new-question <room> <kind> "<question text>"
```

Rooms: `entrance | living | kitchen | bedroom | bath | outdoor | neighbor`
Kinds: `stars | scale | chips | yesno`

## What to do

1. Locate the question bank file (e.g. `data.js`, `questions.ts`, or equivalent)
2. Add to `QUESTIONS_FULL[<room>]`:

```ts
// stars — answer: 1–5
{ id: 'unique_id', text: "Question text?", kind: 'stars' }

// scale — answer: 1–5, labeled endpoints
{ id: 'unique_id', text: "Question?", kind: 'scale', low: 'Low label', high: 'High label' }

// chips — answer: index into options[], each option has weight w (1–5)
{ id: 'unique_id', text: "Question?", kind: 'chips', options: [
  { label: 'Best option', w: 5 },
  { label: 'Good option', w: 4 },
  { label: 'Poor option', w: 1 },
]}

// yesno — answer: boolean (true=5pts, false=1pt)
{ id: 'unique_id', text: "Question?", kind: 'yesno', yesLabel: 'Yes label', noLabel: 'No label' }
```

3. If mode-specific (buy/rent only), add to `BUY_EXTRAS[<room>]` or `RENT_EXTRAS[<room>]` instead
4. ID must be unique within the room — use snake_case
