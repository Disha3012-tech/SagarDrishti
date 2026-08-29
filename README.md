# Sagar Drishti — Frontend

React + Vite conversion of the Claude Design prototype into a real, editable codebase.

## Run it

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To produce a production build:

```bash
npm run build   # outputs to frontend/dist
npm run preview # serve that build locally to sanity-check it
```

## What's real vs. mocked

Everything here is a fully working **frontend** — real React components, real state,
real canvas rendering — but all data is synthetic, generated client-side in
`src/data/mockData.js` from a seeded random generator (same seed every load, so it
looks consistent rather than random). There is no backend, no real satellite feed,
and no real map engine (Mapbox/deck.gl) — the "map" is hand-drawn on `<canvas>` using
a simplified polar-stereographic projection in `src/utils/geo.js`.

That's intentional for a hackathon prototype: the data shapes (`bergs`, `vessels`,
`routes`, `IceGrid`-style concentration values) are structured so swapping in real
NCPOR / INCOIS / ISRO Bhuvan feeds later means replacing the contents of
`src/data/mockData.js` and `src/utils/geo.js`, not rewriting the UI.

## Where to look

- `src/App.jsx` — all shared state (current view, forecast time, selected map
  feature, layer toggles, route-planning inputs) and which page renders
- `src/components/PolarCanvas.jsx` — the shared map renderer used by 4 of the 6 pages
- `src/pages/*.jsx` — one file per screen (Overview, Operations, Route planning,
  Icebergs, Sea-ice forecast, Feeds)
- `src/data/mockData.js` — swap this out first when connecting real data

## Known rough edges worth polishing next

- Route lines on the map (`PolarCanvas`, routes drawing) are thin and can get lost
  against the ice-concentration texture — worth a thicker stroke or stronger glow
  before a live demo.
- No routing library is used (view switching is plain React state in `App.jsx`), so
  there's no shareable URL per page yet. Adding `react-router-dom` is a small,
  optional upgrade if you want that.
- No backend/auth — this is frontend-only, matching the original build brief.
