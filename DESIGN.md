# House Scout — Design System

> "Let's find your place." Mobile-first property scouting app with warm minimalism.
> Inspired structurally by Airbnb but with an original brand. Maps to shadcn + Next.js tokens.

---

## 1. Visual Theme & Atmosphere

Warm, photography-forward, editorial. Feels like a well-kept field notebook — honest, tactile, personal. The canvas is a warm off-white (`#fbf8f3`) rather than clinical white. The accent is terracotta (`#d97757`) — earthy, warm, trustworthy — not a tech-blue CTA.

Two fonts carry the system: **Fraunces** (variable serif) for display headings — giving editorial gravitas to scores and property names — and **Inter** for all UI chrome. The combination reads warm and capable.

Three secondary accent colors support room tones: sage (outdoor, gardens), gold (kitchen), sky (bathrooms). These appear only as photo placeholder tints and room-chip accents, never as brand elements.

**Key Characteristics:**
- Warm off-white canvas (`#fbf8f3`), never pure white
- Warm near-black ink (`#1f1b17`), never pure black
- Terracotta accent (`#d97757`) — earthy, singular brand CTA
- Fraunces (editorial serif) + Inter (UI sans) — warm and readable
- Three-layer warm shadow system (border ring + soft ambient + primary lift)
- Generous radius: 8px controls, 12px inputs, 20px cards, 50% pill/circle
- "Evening scout" dark mode: warm charcoal (`#1a1613`), same terracotta accent
- Mobile-first — phone in hand, standing in a hallway

---

## 2. Color System

### CSS Variables (shadcn-compatible naming)

```css
/* Light (default) */
:root {
  --bg:        #fbf8f3;   /* warm off-white canvas */
  --bg-elev:   #ffffff;   /* card surfaces */
  --bg-sunk:   #f4efe7;   /* sunken surfaces, pill toggles */
  --ink:       #1f1b17;   /* primary text, buttons */
  --ink-2:     #4a413a;   /* secondary text */
  --ink-3:     #847a6f;   /* tertiary, labels */
  --ink-4:     #b8ad9f;   /* disabled, empty stars */
  --line:      rgba(31,27,23,0.08);
  --line-strong: rgba(31,27,23,0.16);

  --accent:      #d97757;  /* terracotta — primary CTA */
  --accent-deep: #b95d3f;  /* pressed accent */
  --accent-soft: #fbeee5;  /* tinted surfaces */

  --sage:      #6b8f7a;   /* outdoor / garden room tone */
  --sage-soft: #e4ece6;
  --gold:      #c4893a;   /* kitchen room tone */
  --gold-soft: #f5ead5;
  --sky:       #6b8aa8;   /* bathroom room tone */
  --sky-soft:  #e2ebf1;
}

/* Dark — "Evening Scout" */
[data-theme="dark"] {
  --bg:       #1a1613;
  --bg-elev:  #262020;
  --bg-sunk:  #15110f;
  --ink:      #f4efe7;
  --ink-2:    #c9beb1;
  --ink-3:    #8a8075;
  --ink-4:    #5c544b;
  /* accent, sage, gold, sky keep same hues */
}
```

### Accent Variants (user-selectable)
- `terra` (default): `#d97757` / deep `#b95d3f`
- `sage`: `#6b8f7a` / deep `#4e6e5d`
- `sky`: `#6b8aa8` / deep `#4a6a88`
- `gold`: `#c4893a` / deep `#9c6b26`

### Color Roles
| Token | Use |
|-------|-----|
| `--accent` | Primary CTA button, active states, star fill, accent chips |
| `--ink` | Primary text, dark button backgrounds |
| `--ink-2` | Descriptions, secondary labels |
| `--ink-3` | Timestamps, placeholder labels, room labels |
| `--ink-4` | Empty stars, disabled states |
| `--bg-sunk` | Toggle pill background, sunken inputs |
| `--line` | Card borders, dividers |
| `--sage/--gold/--sky` | Room-specific photo tints only |

---

## 3. Typography

### Font Stack
```css
--font-serif: "Fraunces", "Iowan Old Style", Georgia, serif;
--font-sans:  "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
```

Fraunces is a variable font — use `font-variation-settings: "opsz" 144, "SOFT" 50` on display headings for maximum expressiveness.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Display Score | Fraunces | 72px | 400 | 1.0 | -0.03em |
| Page Title | Fraunces | 48px | 400 | 1.05 | -0.03em |
| Section Heading | Fraunces | 28–30px | 400 | 1.05 | -0.02em |
| Card Heading | Fraunces | 22px | 400 | 1.05 | -0.02em |
| Sub-heading | Inter | 16px | 700 | 1.25 | -0.01em |
| UI Label | Inter | 11px | 700 | — | 0.08–0.1em (uppercase) |
| Body | Inter | 14–15px | 400 | 1.5 | normal |
| Body Medium | Inter | 13–14px | 500 | 1.5 | normal |
| Button | Inter | 13–14px | 600 | — | -0.01em |
| Small / Caption | Inter | 11–12px | 400–500 | — | normal |
| Mono (debug) | JetBrains Mono | 11px | 400 | — | 0.04em |

**Principles:**
- Fraunces for scores, property names, section titles — the "editorial voice"
- Inter for everything interactive — questions, answers, nav, buttons
- Labels always uppercase + tracked: `font-size: 11px; font-weight: 700; letter-spacing: 0.08–0.1em; text-transform: uppercase; color: var(--ink-3)`
- No thin weights (< 400) on headings

---

## 4. Elevation & Shadows

```css
--shadow-card:  0 0 0 1px rgba(31,27,23,0.04),
                0 2px 6px rgba(31,27,23,0.04),
                0 4px 10px rgba(31,27,23,0.06);

--shadow-hover: 0 0 0 1px rgba(31,27,23,0.05),
                0 6px 16px rgba(31,27,23,0.08),
                0 12px 24px rgba(31,27,23,0.06);

--shadow-lift:  0 10px 30px rgba(31,27,23,0.10),
                0 2px 6px rgba(31,27,23,0.06);
```

| Level | Shadow | Use |
|-------|--------|-----|
| Card | `--shadow-card` | Listing cards, QuestionCards, sheets |
| Hover | `--shadow-hover` | Card hover state |
| Lift | `--shadow-lift` | Floating bottom nav pill, modals |

Dark mode: replace `rgba(31,27,23,x)` with `rgba(0,0,0,x*4)` for depth on dark surfaces.

---

## 5. Border Radius Scale

```css
--r-sm:  8px;   /* small buttons, toggles */
--r-md:  12px;  /* inputs, chips, room list items */
--r-lg:  20px;  /* cards, hero photo containers */
--r-xl:  28px;  /* large containers */
--r-2xl: 36px;  /* hero sections */
/* circle: 50% or 999px — avatars, FABs, bottom pill nav */
```

---

## 6. Component Library

### Buttons

**Primary (dark)**
```
background: var(--ink)   color: var(--bg)
padding: 12px 20px   radius: var(--r-md)   font: Inter 14px 600
active: scale(0.98)
```

**Accent (terracotta)**
```
background: var(--accent)   color: #fff
Same padding/radius/font as primary
```

**Ghost**
```
background: transparent   border: 1px solid var(--line-strong)   color: var(--ink)
hover: background var(--bg-sunk)
```

**Pill CTA (floating bottom nav)**
```
background: var(--ink) or var(--accent) when room complete
padding: 0 18px   height: 42px   radius: 999px
font: Inter 13px 600
```

**Circular FAB**
```
width/height: 40–42px   radius: 50%
background: var(--accent)   color: #fff
shadow: var(--shadow-card)
```

### Cards

```css
.hs-card {
  background: var(--bg-elev);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-card);
}
```

QuestionCard uses `padding: 16px` with `animationDelay` per index.

### Chips (mode toggle + room selector)

```
border-radius: 999px
active: background var(--ink)  color var(--bg)  border var(--ink)
inactive: background var(--bg-elev)  color var(--ink-2)  border var(--line-strong)
font: Inter 12.5px 500
transition: all 160ms ease
```

Room chips add icon + score when complete: `sage-soft` bg + `#3f6b52` text.

### Mode Toggle (Rent / Buy)
```
Pill container: background var(--bg-sunk)  padding: 3px  radius: 999px
Active segment: background var(--ink)  color #fff
Inactive: transparent  color var(--ink-3)
font: 10px 700 uppercase
```

### Photo Placeholder
```css
/* Warm diagonal stripe texture + gradient per tone */
.hs-photo         { background: linear-gradient(135deg, #e6d9c6, #d9c7ad); }
.hs-photo--sage   { background: linear-gradient(135deg, #cfdcd0, #b8c9bc); }
.hs-photo--terra  { background: linear-gradient(135deg, #ead5c6, #dcb89f); }
.hs-photo--sky    { background: linear-gradient(135deg, #cdd7e0, #b1bfcb); }
.hs-photo--gold   { background: linear-gradient(135deg, #ecdcb9, #dcc38a); }
/* Stripe overlay via repeating-linear-gradient */
```

### Star Rating
- Fill color: `var(--accent)` — terracotta
- Empty color: `var(--ink-4)`
- Half-star via SVG `linearGradient`
- Display sizes: 10px (room list), 12px (header), 14px (default), 20px (result), 26px (star picker)

### Q&A Input Types

| Kind | UI |
|------|----|
| `stars` | `StarPicker` — 5 tappable stars, 26px, hover state |
| `scale` | 5 equal-width buttons (1–5) with low/high label row |
| `chips` | Wrapping chip row — single select |
| `yesno` | Two chips with check/x icons |

---

## 7. App Structure

### Data Model

**Property**
```js
{
  id, name, address, city,
  type: 'Apartment' | 'House' | 'Condo' | 'Loft' | ...,
  mode: 'rent' | 'buy',
  price, beds, baths, sqft,
  rating: 1–5 | null,
  tone: 'terra' | 'sage' | 'sky' | 'gold',
  status: 'scouted' | 'todo',
  highlights: string[],
  notes: string,
}
```

**Rooms** (ordered)
```
entrance → living → kitchen → bedroom → bath → outdoor → neighbor
```

**Question Types**
```
stars    → answer: 1–5 number
scale    → answer: 1–5 number, with low/high labels
chips    → answer: index into options[], each option has weight w (1–5)
yesno    → answer: boolean (true=yes=5pts, false=no=1pt)
```

**Scoring**
```
score per question → normalized 1–5
room score = avg of answered questions in room
overall rating = avg of all answered questions
displayed as Fraunces display number + StarRow
```

### Question Banks
- **Full**: 2–3 questions per room (default)
- **Light**: 1 question per room (quick scout)
- **Mode extras**: `BUY_EXTRAS` adds structural/resale; `RENT_EXTRAS` adds lease flexibility

### Rent vs Buy modes
- Shared base questions in all 7 rooms
- `buy`: adds resale prospects (neighbor), structural concerns (entrance)
- `rent`: adds lease flexibility (neighbor)

---

## 8. Mobile Variations

Three distinct interaction metaphors. All share the same question bank, scoring, and data model.

### Variation A — Room-by-room Walkthrough
- Scrollable room chips at top (floorplan rail)
- Hero photo per room (tap to add real photo)
- Question stack scrolls below photo
- Floating pill bottom nav: `← prev | X/N answered | Next room →`
- Rooms light up sage when complete + show score
- **Best for**: first-time scouts wanting a thorough checklist

### Variation B — Stories-style Cards
- Full-screen dark cards (`#1f1b17` bg)
- One question per card
- Instagram Stories progress dashes at top
- House SVG silhouette fills in as answers accumulate (illustrated build metaphor)
- Dark gradient overlay: `180deg, rgba(31,27,23,0.85) → rgba(31,27,23,0.95)`
- Thumb-centric — answer area pinned to bottom quarter
- **Best for**: quick 5-min sanity check, fastest flow

### Variation C — Field Notebook (Capture-first)
- Camera roll–style photo feed, each tied to a room + timestamp
- Sticky header: property name + live score bar + rent/buy toggle
- Each photo card opens inline micro-quiz for its room
- Lens bubbles (tappable) show room completion status
- Running score prominent at top
- Full checklist in bottom sheet
- **Best for**: real on-site viewings, piggybacks on photo habit

---

## 9. Screens & Navigation (Future)

| Screen | Purpose |
|--------|---------|
| Home / Shortlist | Grid of scouted + todo properties |
| Property Detail | Full scout report, room breakdown, notes |
| Scout Flow | One of the 3 Q&A variations |
| Add Property | Type picker → mode picker → start scout |
| Compare | Side-by-side star breakdown, bars vs shortlist |
| Onboarding | What are you looking for? (rent/buy, type, priorities) |

---

## 10. Dark Mode ("Evening Scout")

Warm charcoal `#1a1613`, not blue-black. Same terracotta accent (`#d97757`) — unchanged, provides the only color in dark mode. Photo tints darken: terra `#5a3f30`, sage `#3a4e42`, sky `#324250`, gold `#5a4224`.

Toggle: `data-theme="light" | "dark"` on `<html>`. Also an accent switcher: `data-accent="terra | sage | sky | gold"`.

Not just a color inversion — the evening scout mode is intentionally useful for real-world property viewings in lower light. V2 (Stories dark cards) is the natural dark-mode native.

---

## 11. Implementation Target

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS with CSS variable tokens in `globals.css`
- **Components**: shadcn/ui (Button, Card, Badge, Dialog, Tabs, Progress, Sheet)
- **Icons**: lucide-react (icon names in design match lucide 1:1)
- **Font loading**: `next/font/google` — Fraunces + Inter
- **Theme**: `next-themes` for light/dark toggle

---

## 12. Do's and Don'ts

### Do
- Use `#fbf8f3` as page background — the warmth matters
- Use `#1f1b17` for ink — warmer than `#000`
- Terracotta (`#d97757`) only for CTAs and active states — singular accent
- Fraunces only for scores, property names, section headings
- All interactive UI (buttons, labels, inputs) in Inter
- Always use the three-layer shadow stack on cards
- Generous radius: 12px inputs, 20px cards, 50% pill buttons
- Uppercase + tracked labels for room names and section headers
- Room tones (sage/gold/sky) only for photo placeholders — not brand

### Don't
- Don't use pure `#000` or `#fff` for text/backgrounds
- Don't apply terracotta to large background surfaces
- Don't use Fraunces for body copy or button labels
- Don't use thin font weights (< 400) for headings
- Don't add new brand colors — the sage/gold/sky are utility tones, not palette expansion
- Don't skip the `--bg-sunk` warmth on sunken surfaces — cold grays break the atmosphere
