import ForecastChart from '../components/ForecastChart';
import { generateSeries } from '../utils/series';

const REGIONS = ['Prydz Bay', 'Weddell Sea', 'Ross Sea', 'Queen Maud Land'];
const MODELS = ['ensemble', 'lstm-v3', 'convlstm'];

export default function ForecastPage({ region, model, onSetRegion, onSetModel }) {
  const series = generateSeries(region, model);

  const forecastCards = [
    { k: 'Concentration +7 d', v: (series.fc[7] * 100).toFixed(0) + '%', note: 'spread ±' + ((series.hi[7] - series.lo[7]) * 50).toFixed(0) + ' pts · conf 0.71' },
    { k: 'Ice edge migration', v: '−0.42°/wk', note: 'northward retreat, ' + region },
    { k: 'Model agreement', v: '11 / 14', note: 'members within 1σ at +7 d' },
    { k: 'Last observation', v: '07:42Z', note: 'AMSR2 descending · 8 min old' }
  ];

  return (
    <main className="sd-forecast">
      <div className="sd-forecast__head">
        <div>
          <div className="sd-forecast__eyebrow">Sea-ice forecast</div>
          <h2 className="sd-forecast__title">{region} — concentration index, next 14 days</h2>
        </div>
        <div className="sd-forecast__group sd-forecast__group--push">
          {REGIONS.map((r) => (
            <button
              key={r} type="button" className="btn btn-secondary sd-forecast__btn"
              style={{ color: region === r ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 62%, transparent)', borderColor: region === r ? 'var(--color-accent)' : 'var(--color-divider)' }}
              onClick={() => onSetRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="sd-forecast__group">
          {MODELS.map((m) => (
            <button
              key={m} type="button" className="btn btn-secondary sd-forecast__btn sd-forecast__mono"
              style={{ color: model === m ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-text) 62%, transparent)', borderColor: model === m ? 'var(--color-accent)' : 'var(--color-divider)' }}
              onClick={() => onSetModel(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="sd-forecast__body">
        <ForecastChart series={series} modelLabel={model} />
        <div className="sd-forecast__cards">
          {forecastCards.map((c, i) => (
            <div key={c.k} className="card elev-sm sd-forecast__card" style={{ animation: `dcRise 420ms ${i * 90 + 200}ms ease-out both` }}>
              <div className="sd-forecast__ck">{c.k}</div>
              <div className="sd-forecast__cv">{c.v}</div>
              <div className="sd-forecast__cn">{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .sd-forecast {
          flex: 1; min-height: 0; overflow-y: auto; padding: var(--space-8) var(--space-8) 72px;
          animation: dcFade 380ms ease-out both;
        }
        .sd-forecast__head { display: flex; flex-wrap: wrap; align-items: end; gap: var(--space-8); max-width: 1500px; }
        .sd-forecast__eyebrow {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent);
        }
        .sd-forecast__title { margin-top: var(--space-2); font-size: 30px; }
        .sd-forecast__group { display: flex; gap: var(--space-3); }
        .sd-forecast__group--push { margin-left: auto; }
        .sd-forecast__btn { height: 32px; font-size: 12px; }
        .sd-forecast__mono { font-family: var(--font-mono); }
        .sd-forecast__body {
          display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: var(--space-8);
          margin-top: var(--space-8); max-width: 1500px;
        }
        .sd-forecast__cards { display: flex; flex-direction: column; gap: var(--space-4); }
        .sd-forecast__card { padding: var(--space-4); gap: var(--space-2); }
        .sd-forecast__ck {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 48%, transparent);
        }
        .sd-forecast__cv { font-family: var(--font-mono); font-size: 25px; letter-spacing: -0.02em; }
        .sd-forecast__cn { font-size: 12px; color: color-mix(in srgb, var(--color-text) 58%, transparent); }
      `}</style>
    </main>
  );
}
