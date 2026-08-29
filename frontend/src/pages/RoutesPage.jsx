import PolarCanvas from '../components/PolarCanvas';
import RouteCard from '../components/RouteCard';
import { EXPLAIN_LINES } from '../data/mockData';

const ICE_CLASSES = ['PC4', 'PC5', 'PC6'];

export default function RoutesPage({ data, iceClass, priority, routeGen, onSetIceClass, onSetPriority, onResolve }) {
  const priorityLabel = priority < 40 ? 'fuel-weighted' : (priority > 60 ? 'speed-weighted' : 'balanced');
  const routeStatus = `3 solutions · ${iceClass} · ${priorityLabel}`;

  return (
    <main className="sd-routes">
      <section className="sd-routes__plan">
        <div className="sd-routes__label">Passage plan</div>

        <div className="field" style={{ marginTop: 'var(--space-6)' }}>
          <label>Departure</label>
          <input className="input sd-routes__mono" value="Bharati Station — 69.41°S 076.19°E" readOnly />
        </div>
        <div className="field" style={{ marginTop: 'var(--space-4)' }}>
          <label>Destination</label>
          <input className="input sd-routes__mono" value="Maitri / Ice shelf edge — 70.09°S 011.73°E" readOnly />
        </div>

        <div className="field" style={{ marginTop: 'var(--space-4)' }}>
          <label>Vessel ice class</label>
          <div className="seg" style={{ display: 'flex', width: '100%' }}>
            {ICE_CLASSES.map((ic) => (
              <label
                key={ic}
                className={`seg-opt sd-routes__segopt ${iceClass === ic ? 'is-checked' : ''}`}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <input
                  type="radio" name="iceclass" checked={iceClass === ic}
                  onChange={() => onSetIceClass(ic)}
                />
                {ic}
              </label>
            ))}
          </div>
        </div>

        <div className="field" style={{ marginTop: 'var(--space-6)' }}>
          <label>Objective weighting — fuel vs. speed</label>
          <input
            type="range" min="0" max="100" step="1" value={priority}
            onInput={(e) => onSetPriority(parseInt(e.target.value, 10))}
            aria-label="Fuel versus speed priority"
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
          <div className="sd-routes__scale"><span>fuel</span><span>{priorityLabel}</span><span>speed</span></div>
        </div>

        <div className="field" style={{ marginTop: 'var(--space-4)' }}>
          <label>Risk ceiling</label>
          <input className="input sd-routes__mono" value="0.35" readOnly />
        </div>

        <button type="button" className="btn btn-primary btn-block" style={{ height: 40, marginTop: 'var(--space-8)' }} onClick={onResolve}>
          {`Re-solve (${routeGen + 1})`}
        </button>
        <button type="button" className="btn btn-secondary btn-block" style={{ height: 36, marginTop: 'var(--space-3)' }}>
          Export GPX / KML
        </button>

        <div className="sd-routes__solverNote">
          Solver: A* over 3.125 km ice grid, cost = f(concentration, thickness, current set, wind, hull class). Last solve 1.8 s · 14-member ensemble.
        </div>
      </section>

      <section className="sd-routes__map">
        <PolarCanvas mode="routes" data={data} layers={{ route: true }} t={0} routeGenTick={routeGen} />
        <div className="sd-routes__mapLabel">Candidate tracks · {routeStatus}</div>
      </section>

      <section className="sd-routes__compare">
        <div className="sd-routes__label">Comparison</div>
        <div className="sd-routes__cards">
          {data.routes.map((r, i) => (
            <RouteCard key={r.id} route={r} delay={i * 110 + 120} />
          ))}
        </div>

        <div className="sd-routes__label" style={{ marginTop: 'var(--space-8)' }}>Why R-01</div>
        <div className="sd-routes__explain">
          {EXPLAIN_LINES.map((text, i) => (
            <div key={text} className="sd-routes__explainLine" style={{ animation: `dcRise 460ms ${i * 130 + 260}ms ease-out both` }}>
              <i className="sd-routes__explainDot" /><span>{text}</span>
            </div>
          ))}
        </div>
        <div className="sd-routes__confidence">
          Confidence 0.78 · ensemble 11/14 agree · ice field AMSR2 07:42 UTC (+2 h) · currents INCOIS 06:00 UTC · wind ECMWF HRES 00Z
        </div>
      </section>

      <style>{`
        .sd-routes {
          flex: 1; min-height: 0; display: grid; grid-template-columns: 286px 1fr 400px;
          animation: dcFade 380ms ease-out both;
        }
        .sd-routes__plan {
          border-right: 1px solid var(--color-divider); padding: var(--space-6); overflow-y: auto;
          animation: dcSlideL 420ms ease-out both;
        }
        .sd-routes__label {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 55%, transparent);
        }
        .sd-routes__mono { font-family: var(--font-mono); font-size: 12px; }
        .sd-routes__segopt { font-family: var(--font-mono); font-size: 12px; }
        .sd-routes__scale {
          display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 10px;
          color: color-mix(in srgb, var(--color-text) 45%, transparent);
        }
        .sd-routes__solverNote {
          margin-top: var(--space-8); font-family: var(--font-mono); font-size: 10px; line-height: 1.7;
          color: color-mix(in srgb, var(--color-text) 42%, transparent);
        }
        .sd-routes__map { position: relative; min-width: 0; }
        .sd-routes__mapLabel {
          position: absolute; left: var(--space-6); top: var(--space-6); font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 52%, transparent);
        }
        .sd-routes__compare {
          border-left: 1px solid var(--color-divider); padding: var(--space-6); overflow-y: auto;
          animation: dcSlideR 420ms ease-out both;
        }
        .sd-routes__cards { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4); }
        .sd-routes__explain { display: flex; flex-direction: column; gap: var(--space-4); margin-top: var(--space-4); }
        .sd-routes__explainLine {
          display: flex; gap: var(--space-3); font-size: 13px; line-height: 1.55;
          color: color-mix(in srgb, var(--color-text) 76%, transparent);
        }
        .sd-routes__explainDot { flex: 0 0 4px; height: 4px; margin-top: 8px; border-radius: 50%; background: var(--color-accent); }
        .sd-routes__confidence {
          margin-top: var(--space-8); padding: var(--space-4); border: 1px solid var(--color-divider);
          border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 10px; line-height: 1.7;
          color: color-mix(in srgb, var(--color-text) 50%, transparent);
        }
      `}</style>
    </main>
  );
}
