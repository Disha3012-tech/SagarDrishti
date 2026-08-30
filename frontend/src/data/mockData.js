// Deterministic mock data for the Sagar Drishti prototype.
// Seeded so the same "random" fleet/iceberg field renders every load —
// swap this module's exports for real NCPOR/INCOIS/Bhuvan feed calls later.

// A rough Antarctic coastline as [lon, lat] pairs — enough to look
// geographically plausible, not survey-grade.
export const COAST = [
  [-180,-78.1],[-170,-78.0],[-160,-77.4],[-150,-76.0],[-140,-74.6],[-130,-74.0],
  [-120,-73.6],[-110,-74.0],[-100,-73.5],[-90,-72.9],[-80,-72.0],[-70,-70.1],
  [-65,-68.0],[-61,-64.6],[-59,-63.2],[-57,-69.5],[-55,-73.8],[-50,-76.8],
  [-40,-78.2],[-30,-76.0],[-20,-73.2],[-10,-71.0],[0,-70.1],[10,-70.2],
  [20,-70.4],[30,-69.6],[40,-68.4],[50,-67.1],[60,-67.0],[70,-68.4],
  [75,-69.6],[80,-66.6],[90,-66.5],[100,-66.1],[110,-66.5],[120,-66.6],
  [130,-66.5],[140,-66.9],[150,-68.6],[160,-70.6],[165,-73.0],[170,-75.6],
  [175,-77.6],[180,-78.1]
];

export function coastLat(lon) {
  let l = ((lon + 180) % 360 + 360) % 360 - 180;
  const C = COAST;
  for (let i = 0; i < C.length - 1; i++) {
    if (l >= C[i][0] && l <= C[i + 1][0]) {
      const f = (l - C[i][0]) / (C[i + 1][0] - C[i][0]);
      return C[i][1] + (C[i + 1][1] - C[i][1]) * f;
    }
  }
  return -70;
}

// Creates a seeded pseudo-random generator (LCG) — same seed, same sequence.
function makeRng(seed) {
  let s = seed;
  return function rnd() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const SECTORS = [
  { name: 'Prydz Bay', lon: [62, 92] },
  { name: 'Weddell Sea', lon: [-52, -18] },
  { name: 'Queen Maud Land', lon: [4, 38] },
  { name: 'Ross Sea', lon: [166, 196] },
  { name: 'Amundsen Sea', lon: [-130, -98] }
];
const PREFIX = ['A', 'B', 'C', 'D'];

// Builds one route's path. Only 'coastal' reads the coastline shape and
// gets clamped against it — 'direct' and 'north' are built from a formula
// that never touches that clamp, so they can't get pulled onto the exact
// same curve as R-01 (which is what was causing the two lines to sit
// perfectly on top of each other).
function buildRoutePath(A, B, kind, param) {
  const pts = []; const n = 34;
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const lon = A.lon + (B.lon - A.lon) * f;
    const straight = A.lat + (B.lat - A.lat) * f;
    const bow = Math.sin(f * Math.PI);

    let lat;
    if (kind === 'coastal') {
      const shelf = coastLat(lon) + 1.1;
      lat = straight + bow * (shelf - straight);
      lat = Math.max(coastLat(lon) + 0.4, lat); // only this kind ever touches the coast clamp
    } else {
      // 'direct' and 'north' — coastline-independent, just a bow of a
      // given size off the straight line. Different sign/size from the
      // coastal shelf above means these two families can't coincide.
      lat = straight + bow * param;
    }

    pts.push({ lon, lat: Math.min(-58, lat) });
  }
  return pts;
}

export function createMockData(seed = 20260829) {
  const rnd = makeRng(seed);

  const bergs = [];
  for (let i = 0; i < 18; i++) {
    const s = SECTORS[i % SECTORS.length];
    const lon = s.lon[0] + rnd() * (s.lon[1] - s.lon[0]);
    const coast = coastLat(lon);
    const lat = coast + 1.4 + rnd() * 6.2;
    const area = Math.round(18 + Math.pow(rnd(), 2.4) * 3100);
    const spd = 0.14 + rnd() * 0.62;
    const brg = rnd() * 360;
    const conf = 0.58 + rnd() * 0.38;
    const state = area > 900 ? 'grounded' : (conf < 0.7 ? 'uncertain' : 'drifting');
    bergs.push({
      id: PREFIX[i % 4] + '-' + (61 + i * 3) + String.fromCharCode(65 + (i % 5)),
      sector: s.name, lon, lat, area, spd, brg, conf, state,
      thick: Math.round(80 + rnd() * 220),
      fix: (7 + Math.floor(rnd() * 40))
    });
  }

  const vessels = [
    { name: 'ORV Sagar Kanya', lon: 74.1, lat: -66.4, hdg: 268, sog: 9.4, cls: 'PC5', crew: 42 },
    { name: 'MV Vasiliy Golovnin', lon: 38.6, lat: -66.9, hdg: 246, sog: 11.1, cls: 'PC4', crew: 58 },
    { name: 'ORV Sagar Nidhi', lon: -34.2, lat: -68.2, hdg: 92, sog: 7.8, cls: 'PC6', crew: 36 }
  ];

  const A = { lon: 76.19, lat: -69.41 }, B = { lon: 11.73, lat: -70.09 };

  const routes = [
    { id: 'R-01', name: 'Coastal lead transit', color: '#b5abfc', pts: buildRoutePath(A, B, 'coastal', 0), rec: true, dist: '1,412 nm', eta: '5 d 22 h', conc: '41%', fuel: '218 t', risk: '0.31' },
    { id: 'R-02', name: 'Northern open water', color: '#6fcf97', pts: buildRoutePath(A, B, 'north', 6.2), rec: false, dist: '1,596 nm', eta: '6 d 08 h', conc: '12%', fuel: '241 t', risk: '0.14' },
    { id: 'R-03', name: 'Direct great circle', color: '#d9a24a', pts: buildRoutePath(A, B, 'direct', 1.6), rec: false, dist: '1,338 nm', eta: '6 d 20 h', conc: '68%', fuel: '296 t', risk: '0.72' }
  ];

  return { bergs, vessels, routes, COAST };
}

const HULL_MAX_SPEED = { PC4: 15, PC5: 13, PC6: 10.5 };       // knots, hull-rated max transit speed
const HULL_LIMITS = { PC4: 0.85, PC5: 0.70, PC6: 0.55 };      // safe concentration ceiling per hull class
const HULL_RISK_FACTOR = { PC4: 0.72, PC5: 1.0, PC6: 1.35 };  // relative risk multiplier per hull class
const MIN_SPEED = 7.5;                                        // knots, fuel-economical cruise speed
const REF_SPEED = 11;                                         // knots, speed the base fuel figures were calibrated at
export const RISK_CEILING = 0.35;

// Recomputes the 3 candidate routes for the given ice class / fuel-speed
// priority / resolve attempt ("seed"). Drives the Route planning page.
//
// Speed model: the fuel/speed slider picks a transit speed between an
// economical minimum and the hull's rated max. ETA follows directly from
// that speed; fuel follows the standard naval-architecture rule of thumb
// that burn scales roughly with speed^2 * distance (power ~ speed^3, time
// ~ distance/speed) — so this is the thing that makes "speed-weighted"
// visibly cost more fuel and "fuel-weighted" visibly take longer.
export function computeRoutes({ iceClass = 'PC5', priority = 50, seed = 0 } = {}) {
  const rnd = makeRng(90000 + seed * 7919 + priority * 131);
  const A = { lon: 76.19, lat: -69.41 }, B = { lon: 11.73, lat: -70.09 };

  const base = [
    { id: 'R-01', name: 'Coastal lead transit', color: '#b5abfc', kind: 'coastal', param: 0, jitter: 0.4, baseDist: 1412, baseConc: 0.41, baseFuel: 218 },
    { id: 'R-02', name: 'Northern open water', color: '#6fcf97', kind: 'north', param: 6.2, jitter: 1.0, baseDist: 1596, baseConc: 0.12, baseFuel: 241 },
    { id: 'R-03', name: 'Direct great circle', color: '#d9a24a', kind: 'direct', param: 1.6, jitter: 0.5, baseDist: 1338, baseConc: 0.68, baseFuel: 296 }
  ];

  const speedWeight = priority / 100;      // 0 = fuel-weighted .. 1 = speed-weighted
  const fuelWeight = 1 - speedWeight;
  const hullMaxSpeed = HULL_MAX_SPEED[iceClass] ?? 13;
  const hullRisk = HULL_RISK_FACTOR[iceClass] ?? 1;
  const hullLimit = HULL_LIMITS[iceClass] ?? 0.70;

  const routes = base.map((r) => {
    // Each re-solve pulls a fresh ensemble sample of ice concentration and
    // path shape — not just a tiny nudge, or "Re-solve" doesn't feel like
    // it did anything.
    const concJitter = 1 + (rnd() - 0.5) * 0.30;
    const conc = Math.min(0.97, Math.max(0.04, r.baseConc * concJitter));
    const overLimit = conc > hullLimit;
    const overBy = Math.max(0, conc - hullLimit);

    // Throttle speed down further if the ice ahead exceeds what this hull
    // class is rated to push through safely.
    const iceThrottle = overLimit ? Math.max(0.45, 1 - overBy * 1.6) : 1;
    const speed = (MIN_SPEED + (hullMaxSpeed - MIN_SPEED) * speedWeight) * iceThrottle;

    const etaH = r.baseDist / speed;
    const fuel = (r.baseFuel / (REF_SPEED * REF_SPEED)) * speed * speed * (1 + (rnd() - 0.5) * 0.06);
    const risk = Math.min(0.95, conc * hullRisk * (overLimit ? 1 + speedWeight * 0.5 : 1));

    let days = Math.floor(etaH / 24);
    let hours = Math.round(etaH - days * 24);
    if (hours === 24) { hours = 0; days += 1; }

    return {
      id: r.id, name: r.name, color: r.color,
      pts: buildRoutePath(A, B, r.kind, r.param + (rnd() - 0.5) * r.jitter),
      dist: `${Math.round(r.baseDist * (1 + (rnd() - 0.5) * 0.01))} nm`,
      eta: `${days} d ${hours} h`,
      conc: `${Math.round(conc * 100)}%`,
      fuel: `${Math.round(fuel)} t`,
      risk: risk.toFixed(2),
      speedKn: speed.toFixed(1),
      _cost: fuelWeight * fuel + speedWeight * etaH * 10,
      _risk: risk
    };
  });

  const within = routes.filter((r) => r._risk <= RISK_CEILING);
  const pool = within.length ? within : routes;
  const best = pool.reduce((a, b) => (b._cost < a._cost ? b : a));
  routes.forEach((r) => {
    r.rec = r.id === best.id;
    delete r._cost; delete r._risk;
  });

  return routes;
}

export const feeds = [
  ['AMSR2 brightness temperature', 'JAXA via ISRO relay', '3.125 km / 12 h', '8 min', 'nominal', '#6fcf97'],
  ['Sentinel-1 EW GRDM', 'Copernicus', '40 m / pass', '42 min', 'nominal', '#6fcf97'],
  ['MODIS Terra reflectance', 'NASA', '250 m / 12 h', '3 h 10 m', 'stale', '#d9a24a'],
  ['Surface currents', 'INCOIS', '1/12° / 6 h', '26 min', 'nominal', '#6fcf97'],
  ['Argo profiles', 'INCOIS / Argo', 'point / 10 d', '6 h', 'nominal', '#6fcf97'],
  ['HRES atmospheric forcing', 'ECMWF', '9 km / 6 h', '1 h 14 m', 'nominal', '#6fcf97'],
  ['Synoptic observations', 'IMD', 'station / 3 h', '11 h 02 m', 'degraded', '#d95a4f']
].map(([name, provider, res, age, status, color], i) => ({
  name, provider, res, age, status, color, rate: (1.6 + i * 0.2).toFixed(1) + 's'
}));

export const alerts = [
  { level: 'critical', glyph: '▲', accent: '#d95a4f', time: '07:38Z', text: 'B-64C fragment 12 nm off R-01 at +18 h — closing at 0.4 kt.', meta: 'clearance 6 nm · P(intersect) 0.22 · S1 fix 07:11Z' },
  { level: 'warning', glyph: '■', accent: '#d9a24a', time: '07:21Z', text: 'Concentration ahead of ORV Sagar Kanya reaches 92% at +18 h.', meta: 'PC5 limit 85% · re-route advised · conf 0.74' },
  { level: 'info', glyph: '●', accent: '#6fcf97', time: '07:42Z', text: 'AMSR2 descending pass ingested — ice grid updated.', meta: '3.125 km · 8 min old · 0 gaps' }
];

export const stats = [
  { label: 'Sea-ice extent', value: 14.82, decimals: 2, unit: 'M km²', note: 'AMSR2 · 29 Aug 2026 · −3.1% vs 1991–2020' },
  { label: 'Icebergs tracked', value: 18, decimals: 0, unit: 'objects', note: '4 within 30 nm of an active track' },
  { label: 'Vessels on plan', value: 3, decimals: 0, unit: 'hulls', note: 'PC4 – PC6 · all reporting' },
  { label: 'Route solve', value: 1.8, decimals: 1, unit: 'seconds', note: 'A* over 3.125 km grid · 14 members' }
];

export const capabilities = [
  { kicker: '01 / nowcast', title: 'Concentration to +72 h', body: 'ConvLSTM over AMSR2 and Sentinel-1 with ECMWF forcing, verified against ship ice logs. Every cell carries a spread, not a single number.', meta: 'RMSE 8.4% at +24 h · 12.1% at +72 h' },
  { kicker: '02 / drift', title: 'Iceberg trajectories', body: 'Per-object drift from persistence plus assimilated surface current, emitted as a probability cone rather than a line.', meta: '18 objects · 90% cone · 6-hourly refresh' },
  { kicker: '03 / routing', title: 'Ice-class-aware passage', body: 'A* over the ice grid with hull-limited speed curves, current set and fuel model. Returns ranked routes with the reasoning attached.', meta: 'PC1–PC7 · GPX / KML export' }
];

export const sources = ['ISRO / Bhuvan', 'Sentinel-1 EW', 'AMSR2', 'MODIS Terra', 'INCOIS', 'Argo floats', 'IMD synoptic', 'ECMWF HRES'];

export const EXPLAIN_LINES = [
  'Objective: minimise fuel burn subject to PC5 hull limits and a 0.35 risk ceiling.',
  'R-01 exploits a persistent shear lead along the Prydz Bay coast, resolved in the +12 h AMSR2 nowcast at 3.125 km.',
  'INCOIS surface current contributes a 0.6 kt along-track set between 68°E and 54°E, worth 9 t of fuel.',
  'R-03 is 74 nm shorter but crosses a 68% concentration tongue; modelled speed loss raises burn by 36%.',
  'Iceberg D-28C drift cone intersects R-02 at +54 h with 18% probability; clearance stays above 6 nm.',
  'Skill degrades beyond +48 h — re-solve after the 19:20 UTC AMSR2 pass.'
];

export function fmtPos(lon, lat) {
  const la = Math.abs(lat).toFixed(2) + '°' + (lat < 0 ? 'S' : 'N');
  const lo = Math.abs(lon).toFixed(2) + '°' + (lon < 0 ? 'W' : 'E');
  return la + ' ' + lo;
}