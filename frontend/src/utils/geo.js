import { coastLat } from '../data/mockData';

// Southern-Ocean sea-ice edge as a function of longitude and forecast hour —
// a plausible synthetic field, not a real model output.
export function edgeLat(lon, t) {
  const c = coastLat(lon);
  return c + 6.2
    + 2.4 * Math.sin(lon * 0.042 + 1.1)
    + 1.3 * Math.sin(lon * 0.11 - 0.4)
    + 0.9 * Math.sin(t * 0.075)
    - t * 0.012;
}

// Ice concentration in [0, 1] at a given lon/lat/forecast-hour.
export function conc(lon, lat, t) {
  const c = coastLat(lon), e = edgeLat(lon, t);
  if (lat < c - 0.2 || lat > e) return 0;
  const f = (e - lat) / Math.max(0.5, e - c);
  const n = 0.62
    + 0.20 * Math.sin(lon * 0.16 + lat * 0.9 + t * 0.05)
    + 0.13 * Math.sin(lon * 0.41 - lat * 1.7 - t * 0.031)
    + 0.10 * Math.sin(lon * 0.87 + lat * 3.1 + t * 0.017);
  return Math.max(0, Math.min(1, Math.pow(f, 0.72) * (0.55 + n * 0.78)));
}

// South-polar-stereographic-ish screen geometry for a canvas element.
export function geo(el) {
  const w = el.clientWidth, h = el.clientHeight;
  return { w, h, cx: w * 0.5, cy: h * 0.52, R: Math.min(w, h) * 0.47 };
}

// Projects a lon/lat pair onto screen coordinates for the given canvas element.
export function proj(el, lon, lat) {
  const g = geo(el), a = (lon * Math.PI) / 180;
  const r = g.R * Math.max(0, Math.min(1.25, (90 + lat) / 40));
  return [g.cx + r * Math.sin(a), g.cy + r * Math.cos(a)];
}
