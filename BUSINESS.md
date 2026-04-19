# House Scout — Business Overview

> "Let's find your place." A mobile-first property scouting tool that turns viewings into structured, comparable data.

---

## Problem

People visit multiple properties and make one of the biggest financial decisions of their lives based on fragmented notes, blurry photos, and fading memory. There is no standard way to evaluate and compare properties during or after a viewing. Real estate agents provide listings — not tools for the buyer or renter to think clearly.

---

## Solution

House Scout gives users a guided, room-by-room evaluation framework during a property visit. Every answer contributes to a weighted 1–5 star score. At the end, properties are comparable: not by price or square footage alone, but by how they actually felt in person.

**Core loop:**
1. Add a property (rent or buy, type, address)
2. Walk through room-by-room questions on your phone
3. Get a star rating + room breakdown
4. Compare against your shortlist

---

## Target Users

**Primary**: Individuals and couples actively searching for a property to rent or buy. Tech-comfortable, mobile-first, typically 25–45. Overwhelmed by the volume of viewings and lack of a structured way to compare.

**Secondary**: Families making a joint decision — one person scouts, shares the report with a partner who wasn't present.

**Future**: Buyers' agents who want a standardised scouting format for clients.

---

## Key Differentiators

| Feature | House Scout | Notes app | Spreadsheet | Zillow/Rightmove |
|---------|-------------|-----------|-------------|------------------|
| Guided room Q&A | ✓ | ✗ | ✗ | ✗ |
| Weighted star rating | ✓ | ✗ | Manual | ✗ |
| Rent vs buy mode | ✓ | ✗ | Manual | ✗ |
| Mobile-first UX | ✓ | ✓ | ✗ | Partial |
| Property comparison | ✓ | ✗ | Manual | Listing data only |
| AI insights (roadmap) | ✓ | ✗ | ✗ | Basic |

---

## Business Model (Planned)

**Phase 1 — Free**
Core scout flow, property shortlist, comparison. Build user base, validate retention.

**Phase 2 — Pro (subscription)**
- Unlimited properties (free tier: 5)
- AI insights: pattern analysis across your shortlist, red flag detection
- AI staging suggestions: "Based on your scores, this kitchen needs £8–12k"
- Export: PDF scout reports to share with a partner or agent
- Photo capture + annotation

**Phase 3 — Teams / Agents**
- Shared shortlists between buyer and agent
- Bulk property import from listing portals
- Branded reports for agents to send to clients
- API access

**Pricing hypothesis**: £7–9/mo Pro, £25–35/mo Agent seat.

---

## Roadmap

### v1 — Core Scout (current focus)
- [ ] Property list (shortlist + todo)
- [ ] Add property wizard (type + mode + address)
- [ ] Room-by-room Q&A flow (Variation A — walkthrough)
- [ ] Weighted star rating + room breakdown
- [ ] Property comparison view
- [ ] Local storage persistence (no auth required)

### v2 — Social & Sharing
- [ ] Auth (email or Google)
- [ ] Share scout report (link or PDF)
- [ ] Partner view (read-only shared shortlist)
- [ ] "Evening scout" dark mode

### v3 — AI Features
- [ ] AI property insights (scoring pattern analysis)
- [ ] AI staging cost estimates per room
- [ ] Photo capture + room tagging
- [ ] AI design suggestions from photos

### v4 — Platform
- [ ] Agent accounts + branded reports
- [ ] Listing portal import (Rightmove, Zoopla, Zillow)
- [ ] Market data overlay (price trends, walk score)

---

## Metrics to Track

| Metric | Why |
|--------|-----|
| Properties scouted per user | Core engagement — are they actually using it at viewings? |
| Questions answered per scout | Completion rate — is the Q&A too long? |
| Return rate (>1 session) | Retention — do they come back for the next viewing? |
| Shortlist size at decision | Depth of use — comparing 2 properties vs 8 |
| Time-to-scout | UX efficiency — should be <5 min per property |

---

## Risks

**Habit change**: People default to WhatsApp voice notes. Onboarding must make the first scout feel effortless, not like filling in a form.

**Timing**: The user is standing in a hallway. The UX must be thumb-only, fast, and forgiving. Slow or confusing flows get abandoned mid-viewing.

**Market size**: Active house hunters are a high-intent but transient audience — once they find a place, they churn. Retention past the search phase requires a "saved properties" use case (landlord portfolio, investment tracking).

**Competition**: Notion/Obsidian power users have built elaborate templates. House Scout wins on mobile UX, not feature depth.
