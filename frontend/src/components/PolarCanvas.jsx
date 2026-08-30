import { useRef, useEffect, useCallback } from 'react';
import { proj, geo, conc } from '../utils/geo';
import { COAST } from '../data/mockData';
import useAnimationLoop, { prefersReducedMotion } from '../hooks/useAnimationLoop';

/**
 * Renders the polar-stereographic ice/ocean map onto a full-bleed canvas.
 *
 * mode: 'preview' | 'ops' | 'routes' | 'bergs'
 *  - preview: small looping thumbnail (landing hero) — ice + bergs + vessels only
 *  - ops: full operational picture, all toggleable layers
 *  - routes: same picture plus animated route draw-in (all 3 candidates)
 *  - bergs: ice + iceberg field only, click-to-select
 */
export default function PolarCanvas({
  mode = 'ops',
  layers = {},
  t = 0,
  data,
  selected = null,
  onSelect,
  routeGenTick = 0
}) {
  const canvasRef = useRef(null);
  const iceCacheRef = useRef({ canvas: null, key: null });
  const coneT0Ref = useRef(performance.now());
  const routeT0Ref = useRef(performance.now());
  const hitsRef = useRef([]);
  const reducedRef = useRef(prefersReducedMotion());
  const mountClockRef = useRef(performance.now());

  const propsRef = useRef({});
  propsRef.current = { mode, layers, t, data, selected };

  useEffect(() => {
    routeT0Ref.current = performance.now();
  }, [routeGenTick]);

  useEffect(() => {
    coneT0Ref.current = performance.now();
    mountClockRef.current = performance.now();
  }, [mode]);

  const iceLayer = useCallback((el, tVal) => {
    const w = el.clientWidth, h = el.clientHeight;
    const rec = iceCacheRef.current;
    const key = w + 'x' + h + ':' + tVal.toFixed(1);
    if (rec.key === key && rec.canvas) return rec.canvas;
    if (!rec.canvas) rec.canvas = document.createElement('canvas');
    rec.key = key;
    const c = rec.canvas;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.max(1, w * dpr);
    c.height = Math.max(1, h * dpr);
    const x = c.getContext('2d');
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.clearRect(0, 0, w, h);
    const dLon = 2.2, dLat = 0.55;
    const stops = [
      [0.14, [43, 39, 65]], [0.4, [93, 82, 148]], [0.65, [150, 138, 224]],
      [0.85, [210, 206, 253]], [1, [245, 244, 255]]
    ];
    for (let lon = -180; lon < 180; lon += dLon) {
      for (let lat = -84; lat < -54; lat += dLat) {
        const v = conc(lon + dLon / 2, lat + dLat / 2, tVal);
        if (v < 0.14) continue;
        const p1 = proj(el, lon, lat), p2 = proj(el, lon + dLon, lat),
              p3 = proj(el, lon + dLon, lat + dLat), p4 = proj(el, lon, lat + dLat);
        let col = stops[stops.length - 1][1];
        for (let i = 0; i < stops.length - 1; i++) {
          if (v <= stops[i + 1][0]) {
            const f = (v - stops[i][0]) / (stops[i + 1][0] - stops[i][0]);
            col = stops[i][1].map((cc, j) => Math.round(cc + (stops[i + 1][1][j] - cc) * f));
            break;
          }
        }
        x.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.30 + v * 0.62})`;
        x.beginPath();
        x.moveTo(p1[0], p1[1]); x.lineTo(p2[0], p2[1]); x.lineTo(p3[0], p3[1]); x.lineTo(p4[0], p4[1]);
        x.closePath(); x.fill();
      }
    }
    return c;
  }, []);

  const draw = useCallback((now, clock) => {
    const el = canvasRef.current;
    if (!el || !el.clientWidth) return;
    const { mode, layers: L, t: stateT, data, selected } = propsRef.current;
    if (!data) return;
    const reduced = reducedRef.current;
    const preview = mode === 'preview';

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = el.clientWidth, h = el.clientHeight;
    if (el.width !== Math.round(w * dpr)) { el.width = Math.round(w * dpr); el.height = Math.round(h * dpr); }
    const c = el.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);

    const g = geo(el);
    const t = preview ? (clock * 1.6) % 72 : stateT;

    const og = c.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, g.R * 1.7);
    og.addColorStop(0, '#1a1d31'); og.addColorStop(0.55, '#14172a'); og.addColorStop(1, '#101324');
    c.fillStyle = og; c.fillRect(0, 0, w, h);

    c.strokeStyle = 'rgba(233,233,237,0.07)'; c.lineWidth = 1;
    [60, 70, 80].forEach((la) => {
      c.beginPath();
      const r = g.R * (90 - la) / 40;
      c.arc(g.cx, g.cy, r, 0, Math.PI * 2); c.stroke();
    });
    for (let lo = 0; lo < 360; lo += 30) {
      const p = proj(el, lo, -52);
      c.beginPath(); c.moveTo(g.cx, g.cy); c.lineTo(p[0], p[1]); c.stroke();
    }

    if (L.ice || preview) c.drawImage(iceLayer(el, t), 0, 0, w, h);

    if (L.currents && !preview) {
      c.lineWidth = 1;
      for (let lo = -180; lo < 180; lo += 9) {
        for (let la = -78; la < -56; la += 2.6) {
          const p = proj(el, lo, la);
          const ang = (lo * Math.PI) / 180 + Math.PI / 2 + 0.35 * Math.sin(la * 0.6 + lo * 0.05);
          const ph = (clock * 0.5 + lo * 0.02 + la * 0.1) % 1;
          const len = 9 + 5 * Math.sin(la * 0.9 + lo * 0.04);
          c.strokeStyle = `rgba(111,207,151,${0.10 + 0.16 * Math.sin(ph * Math.PI)})`;
          c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len); c.stroke();
        }
      }
    }
    if (L.wind && !preview) {
      c.strokeStyle = 'rgba(210,206,253,0.16)'; c.lineWidth = 1;
      for (let lo = -180; lo < 180; lo += 14) {
        for (let la = -76; la < -54; la += 3.6) {
          const p = proj(el, lo, la);
          const ang = (lo * Math.PI) / 180 - 0.9;
          c.beginPath(); c.moveTo(p[0], p[1]);
          c.lineTo(p[0] + Math.cos(ang) * 14, p[1] + Math.sin(ang) * 14);
          c.moveTo(p[0] + Math.cos(ang) * 14, p[1] + Math.sin(ang) * 14);
          c.lineTo(p[0] + Math.cos(ang + 2.4) * 5 + Math.cos(ang) * 9, p[1] + Math.sin(ang + 2.4) * 5 + Math.sin(ang) * 9);
          c.stroke();
        }
      }
    }
    if (L.bathy && !preview) {
      c.strokeStyle = 'rgba(145,132,217,0.10)';
      [-58.5, -62.5, -65.5].forEach((la) => {
        c.beginPath();
        for (let lo = -180; lo <= 180; lo += 4) {
          const p = proj(el, lo, la + 0.7 * Math.sin(lo * 0.09));
          if (lo === -180) c.moveTo(p[0], p[1]); else c.lineTo(p[0], p[1]);
        }
        c.stroke();
      });
    }

    c.beginPath();
    for (let i = 0; i < COAST.length; i++) {
      const p = proj(el, COAST[i][0], COAST[i][1]);
      if (i === 0) c.moveTo(p[0], p[1]); else c.lineTo(p[0], p[1]);
    }
    c.closePath();
    const lg = c.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, g.R);
    lg.addColorStop(0, '#33364a'); lg.addColorStop(1, '#262937');
    c.fillStyle = lg; c.fill();
    c.strokeStyle = 'rgba(233,233,237,0.30)'; c.lineWidth = 1; c.stroke();
    if (L.thickness && !preview) {
      c.save(); c.clip();
      c.strokeStyle = 'rgba(210,206,253,0.14)'; c.lineWidth = 1;
      for (let i = -h; i < w; i += 7) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h, h); c.stroke(); }
      c.restore();
    }

    const routeP = Math.min(1, (now - routeT0Ref.current) / 900);
    if ((L.route || mode === 'routes') && !preview) {
      // Draw the recommended route last so it's never hidden underneath
      // an alternate where two tracks run close together.
      const drawList = data.routes
        .map((r, i) => ({ r, i }))
        .sort((a, b) => (a.r.rec === b.r.rec ? 0 : a.r.rec ? 1 : -1));

      drawList.forEach(({ r, i }) => {
        const show = mode === 'routes'
          ? Math.max(0, Math.min(1, (routeP * 3.1) - i * 0.85))
          : (r.rec ? 1 : 0);
        if (show <= 0) return;
        const n = Math.max(2, Math.floor(r.pts.length * show));
        const pathPoints = [];
        for (let k = 0; k < n; k++) pathPoints.push(proj(el, r.pts[k].lon, r.pts[k].lat));

        c.lineCap = 'round';
        c.lineJoin = 'round';

        // Dark halo pass first — keeps two close-together tracks visually
        // separated instead of one color simply overwriting the other.
        c.strokeStyle = 'rgba(10,11,22,0.55)';
        c.lineWidth = (r.rec ? 3 : 1.8) + 2.5;
        c.beginPath();
        pathPoints.forEach((p, k) => { if (k === 0) c.moveTo(p[0], p[1]); else c.lineTo(p[0], p[1]); });
        c.stroke();

        // Colored pass on top, at full strength for every route.
        c.lineWidth = r.rec ? 3 : 1.8;
        c.strokeStyle = r.color;
        c.globalAlpha = r.rec ? 1 : 0.92;
        c.shadowColor = r.rec ? 'rgba(181,171,252,0.6)' : 'transparent';
        c.shadowBlur = r.rec ? 14 : 0;
        c.beginPath();
        pathPoints.forEach((p, k) => { if (k === 0) c.moveTo(p[0], p[1]); else c.lineTo(p[0], p[1]); });
        c.stroke();
        c.shadowBlur = 0;
        c.globalAlpha = 1;

        if (show >= 1 && mode === 'routes') {
          [r.pts[0], r.pts[r.pts.length - 1]].forEach((wp) => {
            const p = proj(el, wp.lon, wp.lat);
            c.fillStyle = '#e9e9ed'; c.beginPath(); c.arc(p[0], p[1], 3, 0, Math.PI * 2); c.fill();
          });

          // Each route's id tag sits at a different fraction of its own
          // path (0.30 / 0.52 / 0.74) so three converging tracks don't
          // stack their labels on top of one another near the coast.
          const tagFrac = 0.3 + i * 0.22;
          const tagIdx = Math.min(r.pts.length - 1, Math.floor(r.pts.length * tagFrac));
          const mp = proj(el, r.pts[tagIdx].lon, r.pts[tagIdx].lat);
          c.font = '600 10px "JetBrains Mono", monospace';
          const label = r.id;
          const tw = c.measureText(label).width;
          const padX = 5, tagH = 15, tagY = mp[1] - 22;
          c.fillStyle = 'rgba(16,17,32,0.82)';
          c.beginPath();
          if (c.roundRect) c.roundRect(mp[0] - tw / 2 - padX, tagY, tw + padX * 2, tagH, 4);
          else c.rect(mp[0] - tw / 2 - padX, tagY, tw + padX * 2, tagH);
          c.fill();
          c.fillStyle = r.color;
          c.textBaseline = 'middle';
          c.fillText(label, mp[0] - tw / 2, tagY + tagH / 2 + 1);
          c.textBaseline = 'alphabetic';
        }
      });
    }

    const hits = [];
    const coneP = reduced ? 1 : Math.min(1, (now - coneT0Ref.current) / 1100);
    if (L.bergs || preview || mode === 'bergs') {
      data.bergs.forEach((b) => {
        const lat = b.lat + Math.sin((b.brg * Math.PI) / 180) * b.spd * t * 0.004;
        const lon = b.lon + Math.cos((b.brg * Math.PI) / 180) * b.spd * t * 0.010;
        const p = proj(el, lon, lat);
        const spread = (1 - b.conf) * 1.5 + 0.5;
        const drift = b.spd * 0.09;
        const tipLat = lat + Math.sin((b.brg * Math.PI) / 180) * drift * 9;
        const tipLon = lon + Math.cos((b.brg * Math.PI) / 180) * drift * 22;
        const tip = proj(el, tipLon, tipLat);
        const ang = Math.atan2(tip[1] - p[1], tip[0] - p[0]);
        const len = Math.hypot(tip[0] - p[0], tip[1] - p[1]) * (preview ? 0.8 : 1) * coneP;
        const half = 0.20 + spread * 0.16;
        if (!preview) {
          const cg = c.createLinearGradient(p[0], p[1], p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len);
          cg.addColorStop(0, 'rgba(217,162,74,0.30)'); cg.addColorStop(1, 'rgba(217,162,74,0.02)');
          c.fillStyle = cg;
          c.beginPath(); c.moveTo(p[0], p[1]);
          c.arc(p[0], p[1], len, ang - half, ang + half); c.closePath(); c.fill();
          c.strokeStyle = 'rgba(217,162,74,0.42)'; c.lineWidth = 1;
          c.beginPath(); c.arc(p[0], p[1], len, ang - half, ang + half); c.stroke();
        }
        const sel = selected && selected.type === 'berg' && selected.id === b.id;
        if (sel) {
          // Reduced-motion: draw a static ring at its mean radius/opacity
          // instead of pulsing via Math.sin(clock*3).
          const pulse = reduced ? 0 : Math.sin(clock * 3);
          c.strokeStyle = `rgba(217,90,79,${0.35 + 0.35 * pulse})`;
          c.lineWidth = 2;
          c.beginPath(); c.arc(p[0], p[1], 13 + (reduced ? 0 : 4 * pulse), 0, Math.PI * 2); c.stroke();
          c.strokeStyle = 'rgba(233,233,237,0.5)'; c.setLineDash([3, 3]);
          c.beginPath();
          for (let k = 20; k >= 0; k--) {
            const bp = proj(
              el,
              lon - Math.cos((b.brg * Math.PI) / 180) * b.spd * k * 0.30,
              lat - Math.sin((b.brg * Math.PI) / 180) * b.spd * k * 0.13
            );
            if (k === 20) c.moveTo(bp[0], bp[1]); else c.lineTo(bp[0], bp[1]);
          }
          c.stroke(); c.setLineDash([]);
        }
        const s = preview ? 3 : 4 + Math.min(4, Math.sqrt(b.area) / 14);
        c.save(); c.translate(p[0], p[1]); c.rotate(Math.PI / 4);
        c.fillStyle = b.state === 'grounded' ? '#d9a24a' : '#f5f4ff';
        c.fillRect(-s / 2, -s / 2, s, s);
        c.restore();
        hits.push({ type: 'berg', id: b.id, x: p[0], y: p[1] });
      });
    }
    if (L.vessels || preview) {
      data.vessels.forEach((v) => {
        const lon = v.lon - t * 0.062, lat = v.lat - t * 0.004;
        const p = proj(el, lon, lat);
        const bob = reduced ? 1 : 1 + 0.10 * Math.sin(clock * 2.1 + v.sog);
        c.fillStyle = 'rgba(111,207,151,0.16)';
        c.beginPath(); c.arc(p[0], p[1], (preview ? 7 : 11) * bob, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#6fcf97';
        c.beginPath(); c.arc(p[0], p[1], preview ? 2.6 : 4, 0, Math.PI * 2); c.fill();
        if (!preview) {
          c.font = '500 10px "JetBrains Mono", monospace';
          c.fillStyle = 'rgba(233,233,237,0.62)';
          c.fillText(v.name, p[0] + 11, p[1] + 3.5);
        }
        hits.push({ type: 'vessel', id: v.name, x: p[0], y: p[1] });
      });
    }
    hitsRef.current = hits;

    // Radar-style reveal sweep on first mount of this view — already
    // guarded by !reduced so it's skipped under reduced-motion settings.
    const sinceMount = (now - mountClockRef.current) / 1000;
    if (!preview && !reduced && sinceMount < 1.6) {
      const a = 1 - sinceMount / 1.6;
      const sw = sinceMount * 5;
      if (c.createConicGradient) {
        const sg = c.createConicGradient(sw, g.cx, g.cy);
        sg.addColorStop(0, `rgba(145,132,217,${0.30 * a})`);
        sg.addColorStop(0.12, 'rgba(145,132,217,0)');
        sg.addColorStop(1, 'rgba(145,132,217,0)');
        c.fillStyle = sg; c.beginPath(); c.arc(g.cx, g.cy, g.R * 1.3, 0, Math.PI * 2); c.fill();
      }
    }
  }, [iceLayer]);

  useAnimationLoop((now, clock) => draw(now, clock));

  const handleClick = (e) => {
    if (mode === 'preview' || !onSelect) return;
    const el = canvasRef.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let best = null, bd = 18;
    hitsRef.current.forEach((hh) => {
      const d = Math.hypot(hh.x - x, hh.y - y);
      if (d < bd) { bd = d; best = hh; }
    });
    onSelect(best ? { type: best.type, id: best.id } : null);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        display: 'block', cursor: mode === 'preview' ? 'default' : 'crosshair'
      }}
    />
  );
}