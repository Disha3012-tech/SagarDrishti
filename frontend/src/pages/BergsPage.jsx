import { useState } from 'react';
import PolarCanvas from '../components/PolarCanvas';
import SelectionPanel from '../components/SelectionPanel';
import { fmtPos } from '../data/mockData';

function buildSelection(sel, data) {
  if (!sel || sel.type !== 'berg') return null;
  const b = data.bergs.find((x) => x.id === sel.id);
  if (!b) return null;
  return {
    kind: 'Iceberg', name: b.id,
    fields: [
      { k: 'Position', v: fmtPos(b.lon, b.lat) }, { k: 'Sector', v: b.sector },
      { k: 'Area', v: b.area.toLocaleString() + ' km²' }, { k: 'Draft', v: b.thick + ' m' },
      { k: 'Drift', v: b.spd.toFixed(2) + ' kt / ' + Math.round(b.brg) + '°' }, { k: 'Confidence', v: b.conf.toFixed(2) }
    ],
    provenance: 'Sentinel-1 EW GRDM, last fix ' + b.fix + ' min ago · drift model NCPOR-BD v2 (persistence + INCOIS surface current) · cone = 90% of 14-member spread'
  };
}

export default function BergsPage({ data, sel, onSelect }) {
  const [query, setQuery] = useState('');

  const bergsSorted = data.bergs.slice().sort((a, b) => b.area - a.area);
  const q = query.trim().toLowerCase();
  const rows = bergsSorted.filter((b) => !q || b.id.toLowerCase().includes(q) || b.sector.toLowerCase().includes(q));
  const hazardCount = data.bergs.filter((b) => b.state !== 'grounded').length >= 4 ? 4 : data.bergs.length;

  const selection = buildSelection(sel, data);

  return (
    <main className="sd-bergs">
      <section className="sd-bergs__table">
        <div className="sd-bergs__filterRow">
          <input
            className="input sd-bergs__filter" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by designator or sector"
          />
          <span className="sd-bergs__count">{data.bergs.length} tracked · {hazardCount} within 30 nm of an active track</span>
        </div>
        <div className="sd-bergs__scroll">
          <table className="table sd-bergs__tbl">
            <thead>
              <tr>
                <th>Designator</th><th>Position</th>
                <th style={{ textAlign: 'right' }}>Area km²</th>
                <th style={{ textAlign: 'right' }}>Drift</th>
                <th style={{ textAlign: 'right' }}>Conf</th>
                <th style={{ textAlign: 'right' }}>State</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const selected = sel && sel.type === 'berg' && sel.id === b.id;
                const stateColor = b.state === 'grounded' ? '#d9a24a' : (b.state === 'uncertain' ? '#d95a4f' : '#6fcf97');
                const glyph = b.state === 'grounded' ? '■' : (b.state === 'uncertain' ? '▲' : '●');
                return (
                  <tr
                    key={b.id} onClick={() => onSelect({ type: 'berg', id: b.id })}
                    style={{ cursor: 'pointer', background: selected ? 'color-mix(in srgb, var(--color-accent) 16%, transparent)' : 'transparent' }}
                  >
                    <td className="sd-bergs__mono">{b.id}</td>
                    <td className="sd-bergs__mono sd-bergs__pos">{fmtPos(b.lon, b.lat)}</td>
                    <td className="sd-bergs__mono" style={{ textAlign: 'right' }}>{b.area.toLocaleString()}</td>
                    <td className="sd-bergs__mono sd-bergs__small" style={{ textAlign: 'right' }}>{b.spd.toFixed(2)} kt {Math.round(b.brg)}°</td>
                    <td className="sd-bergs__mono sd-bergs__small" style={{ textAlign: 'right' }}>{b.conf.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="tag" style={{ color: stateColor, border: `1px solid ${stateColor}`, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {glyph} {b.state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="sd-bergs__map">
        <PolarCanvas mode="bergs" data={data} layers={{ bergs: true }} t={0} selected={sel} onSelect={onSelect} />
        <SelectionPanel sel={selection} position="bergs" />
      </section>

      <style>{`
        .sd-bergs {
          flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(420px, 1fr) minmax(420px, 46%);
          animation: dcFade 380ms ease-out both;
        }
        .sd-bergs__table { border-right: 1px solid var(--color-divider); display: flex; flex-direction: column; min-width: 0; }
        .sd-bergs__filterRow { display: flex; align-items: center; gap: var(--space-4); padding: var(--space-6) var(--space-6) var(--space-4); }
        .sd-bergs__filter { max-width: 280px; font-family: var(--font-mono); font-size: 12px; }
        .sd-bergs__count { font-family: var(--font-mono); font-size: 11px; color: color-mix(in srgb, var(--color-text) 45%, transparent); }
        .sd-bergs__scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 0 var(--space-6) var(--space-6); }
        .sd-bergs__tbl { width: 100%; font-size: 13px; }
        .sd-bergs__tbl th {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; text-align: left;
        }
        .sd-bergs__mono { font-family: var(--font-mono); }
        .sd-bergs__pos { font-size: 12px; color: color-mix(in srgb, var(--color-text) 66%, transparent); }
        .sd-bergs__small { font-size: 12px; }
        .sd-bergs__map { position: relative; min-width: 0; }
      `}</style>
    </main>
  );
}
