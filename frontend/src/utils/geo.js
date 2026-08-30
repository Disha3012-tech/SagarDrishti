import { coastLat } from '../data/mockData';

export function edgeLat(lon, t) {
  const c = coastLat(lon);
  return c + 6.2
    + 2.4 * Math.sin(lon * 0.042 + 1.1)
    + 1.3 * Math.sin(lon * 0.11 - 0.4)
    + 0.9 * Math.sin(t * 0.075)
    - t * 0.012;
}

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

export function geo(el) {
  const w = el.clientWidth, h = el.clientHeight;
  return { w, h, cx: w * 0.5, cy: h * 0.52, R: Math.min(w, h) * 0.47 };
}

const MAX_COLAT = 40;
const RADIUS_EASE = 0.85;

export function proj(el, lon, lat) {
  const g = geo(el), a = (lon * Math.PI) / 180;
  const colat = Math.max(0, Math.min(MAX_COLAT, 90 + lat));
  const r = g.R * Math.pow(colat / MAX_COLAT, RADIUS_EASE);
  return [g.cx + r * Math.sin(a), g.cy + r * Math.cos(a)];
}

// Traces a smooth closed curve through `points` (each an [x, y] pair) onto
// an already-open canvas path, using Catmull-Rom-to-Bezier conversion.
//
// The underlying COAST data intentionally repeats its first coordinate as
// its last (needed elsewhere, by coastLat(), to correctly interpolate the
// longitude wraparound at ±180°). But feeding that duplicate straight into
// a closed spline creates a zero-length segment, which the curve reads as
// a sharp cusp — so we drop a trailing point here if it's essentially the
// same as the first, purely for the purposes of drawing.
export function traceSmoothClosedPath(ctx, points) {
  let pts = points;
  if (pts.length > 2) {
    const first = pts[0], last = pts[pts.length - 1];
    if (Math.abs(first[0] - last[0]) < 0.5 && Math.abs(first[1] - last[1]) < 0.5) {
      pts = pts.slice(0, -1);
    }
  }

  const n = pts.length;
  if (n < 3) {
    pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
    return;
  }
  const at = (i) => pts[(i + n) % n];
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
  }
}