// Chart-space geometry constants (a 900x380 viewBox with margins baked in).
export const X = (i) => 46 + (i / 20) * 844;
export const Y = (v) => 330 - Math.max(0, Math.min(1, v)) * 300;

const REGION_BASE = { 'Prydz Bay': 0.62, 'Weddell Sea': 0.78, 'Ross Sea': 0.7, 'Queen Maud Land': 0.55 };
const MODEL_BIAS = { ensemble: 0, 'lstm-v3': 0.035, convlstm: -0.04 };

// Generates a synthetic 20-day series: 7 "observed" points, 14 forecast
// points with a confidence band, and a climatology ghost line.
export function generateSeries(region, model) {
  const base = REGION_BASE[region] ?? 0.6;
  const bias = MODEL_BIAS[model] ?? 0;
  const obs = [], fc = [], lo = [], hi = [], clim = [];
  for (let i = 0; i <= 20; i++) {
    const v = base + 0.06 * Math.sin(i * 0.55) - i * 0.0135 + 0.012 * Math.sin(i * 2.1);
    if (i <= 6) obs.push(v);
    if (i >= 6) {
      const f = (i - 6) / 14;
      fc.push(v + bias * f * 3);
      lo.push(v + bias * f * 3 - 0.02 - f * 0.075);
      hi.push(v + bias * f * 3 + 0.02 + f * 0.075);
    }
    clim.push(base - 0.02 - i * 0.0102 + 0.03 * Math.sin(i * 0.7));
  }
  return { obs, fc, lo, hi, clim };
}

// Builds an SVG path `d` string from a value array, offset by `off` steps
// along the x-axis (used because forecast/climatology start at day 0 while
// forecast/confidence bands start at the "now" tick, day 6).
export function pathD(arr, off = 0) {
  return arr.map((v, i) => (i ? 'L' : 'M') + X(i + off).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
}

// Builds the closed confidence-band polygon between the hi and lo arrays.
export function bandD(hi, lo) {
  return hi.map((v, i) => (i ? 'L' : 'M') + X(i + 6).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ')
    + ' ' + lo.slice().reverse().map((v, i) => 'L' + X(20 - i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ') + ' Z';
}
