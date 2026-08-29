import { X, Y, pathD, bandD } from '../utils/series';

const GRID_LEVELS = [0, 0.25, 0.5, 0.75, 1];
const X_TICKS = [0, 3, 6, 9, 12, 15, 18, 20];

export default function ForecastChart({ series, modelLabel }) {
  const { obs, fc, lo, hi, clim } = series;
  const linePath = pathD(fc, 6);
  const obsPath = pathD(obs, 0);
  const ghostPath = pathD(clim, 0);
  const bandPath = bandD(hi, lo);
  const nowX = X(6).toFixed(1);

  return (
    <div className="sd-forecastchart">
      <svg viewBox="0 0 900 380" className="sd-forecastchart__svg">
        {GRID_LEVELS.map((v) => (
          <g key={v}>
            <line x1="46" y1={Y(v)} x2="890" y2={Y(v)} stroke="#2f3242" strokeWidth="1" />
            <text x="0" y={Y(v) + 4} fill="#6c7080" fontFamily="JetBrains Mono, monospace" fontSize="11">
              {Math.round(v * 100)}%
            </text>
          </g>
        ))}
        <path d={bandPath} fill="rgba(145,132,217,0.16)" className="sd-forecastchart__band" />
        <path d={ghostPath} fill="none" stroke="#5c5783" strokeWidth="1.5" strokeDasharray="4 4" className="sd-forecastchart__ghost" />
        <path d={linePath} fill="none" stroke="#b5abfc" strokeWidth="2.4" strokeLinecap="round"
          pathLength="1" strokeDasharray="1" className="sd-forecastchart__line" />
        <path d={obsPath} fill="none" stroke="#e9e9ed" strokeWidth="2"
          pathLength="1" strokeDasharray="1" className="sd-forecastchart__obs" />
        <line x1={nowX} y1="14" x2={nowX} y2="330" stroke="#9184d9" strokeWidth="1" strokeDasharray="3 4" />
        <text x={nowX} y="8" fill="#9184d9" fontFamily="JetBrains Mono, monospace" fontSize="10" textAnchor="middle">now</text>
        {X_TICKS.map((i) => (
          <text key={i} x={X(i)} y="356" fill="#6c7080" fontFamily="JetBrains Mono, monospace" fontSize="11" textAnchor="middle">
            {i <= 6 ? `−${6 - i}d` : `+${i - 6}d`}
          </text>
        ))}
      </svg>
      <div className="sd-forecastchart__legend">
        <span><i className="sd-forecastchart__swatch" style={{ background: '#e9e9ed' }} />observed (AMSR2)</span>
        <span><i className="sd-forecastchart__swatch" style={{ background: '#b5abfc' }} />{modelLabel} forecast</span>
        <span><i className="sd-forecastchart__swatch sd-forecastchart__swatch--band" />90% ensemble spread</span>
        <span><i className="sd-forecastchart__swatch sd-forecastchart__swatch--dash" />climatology 1991–2020</span>
      </div>
      <style>{`
        .sd-forecastchart {
          position: relative; padding: var(--space-6); border: 1px solid var(--color-divider);
          border-radius: var(--radius-lg);
          background: radial-gradient(110% 140% at 8% 0%, rgba(145,132,217,0.10), transparent 62%);
        }
        .sd-forecastchart__svg { width: 100%; height: auto; display: block; overflow: visible; }
        .sd-forecastchart__band { opacity: 0; animation: dcFade 900ms 700ms ease-out forwards; }
        .sd-forecastchart__ghost { opacity: 0; animation: dcFade 700ms 900ms ease-out forwards; }
        .sd-forecastchart__line { animation: dcDraw 1500ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .sd-forecastchart__obs { animation: dcDraw 1100ms cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .sd-forecastchart__legend {
          display: flex; flex-wrap: wrap; gap: var(--space-6); margin-top: var(--space-4);
          font-family: var(--font-mono); font-size: 10px; color: color-mix(in srgb, var(--color-text) 52%, transparent);
        }
        .sd-forecastchart__legend span { display: flex; align-items: center; gap: 6px; }
        .sd-forecastchart__swatch { width: 14px; height: 2px; display: inline-block; }
        .sd-forecastchart__swatch--band { height: 8px; background: rgba(145,132,217,0.3) !important; }
        .sd-forecastchart__swatch--dash { height: 0; border-top: 1.5px dashed #5c5783; background: transparent !important; }
      `}</style>
    </div>
  );
}
