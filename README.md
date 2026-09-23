# Campus Club

A React + Vite campus club directory. Browse student organizations, filter by interest (coding, sports, arts, entrepreneurship, music, media, and more), search live, and open a split-panel detail view.

Built for a college assignment covering **Props**, **Lists & Keys**, **Search/Filter UI**, **Conditional rendering**, and **Component reuse**.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run Oxlint |

## Design

- **Layout:** sticky left filter rail + main club grid + optional right detail pane (master–detail). Not a hero/stats landing layout.
- **Palette:** coral `#ff6b4a` + ink `#1a1a2e` on warm sand backgrounds.
- **Type:** Space Grotesk (display) + Instrument Sans (body).

## Features

- Search by name, blurb, tags, or lead name
- Interest filters with live counts
- Star clubs (persisted in `localStorage`)
- Split detail pane for schedule, leads, and upcoming sessions
- Empty state when filters match nothing
- In-app React concept map

## Concept map

| Concept | Where |
|---------|--------|
| **Props** | `App` passes data/handlers into `FilterRail`, `OrgTile`, `DetailPane`, `AppHeader` |
| **Lists & Keys** | `.map()` over clubs, interests, tags, leads, events with stable `key`s |
| **Search / filter** | Query + interest pipeline in `App` (`useMemo`) |
| **Conditional rendering** | Detail pane, `NoMatches`, starred styles, clear-search button |
| **Component reuse** | Shared `Chip` for interests, tags, and filter buttons |

## Project structure

```
src/
  App.jsx                 # State, filter pipeline, layout shell
  index.css               # Coral/ink design system
  data/clubsData.js       # INTERESTS + CLUBS
  components/
    AppHeader.jsx         # Top brand bar
    FilterRail.jsx        # Search + interest filters
    OrgTile.jsx           # Club card in the grid
    DetailPane.jsx        # Right-side detail panel
    NoMatches.jsx         # Empty results
    Chip.jsx              # Reusable chip/button
    ConceptMap.jsx        # Assignment concept panel
```

## Persistence

- `campus_club_starred` — JSON array of starred club ids

## Tech

React 19 · Vite 8 · lucide-react · vanilla CSS

## Enhancements

- **Themes**: Coral Sand, Ocean Mist, Meadow, and Dusk (dark) — pick from the header; choice persists in `localStorage`.
- **Join now**: Apply from club detail; applications store club id/name, interest, timestamp, and status.
- **My applications**: Dedicated view with empty state and withdraw.
- **Profile**: Editable name, email, course/year, bio with starred + application counts.

