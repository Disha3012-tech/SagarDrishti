import { feeds } from '../data/mockData';

export default function FeedsPage() {
  return (
    <main className="sd-feeds">
      <div className="sd-feeds__eyebrow">Ingestion</div>
      <h2 className="sd-feeds__title">Feed status</h2>
      <table className="table sd-feeds__table">
        <thead>
          <tr>
            <th>Feed</th><th>Provider</th><th>Resolution</th>
            <th style={{ textAlign: 'right' }}>Age</th>
            <th style={{ textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {feeds.map((f, i) => {
            const degraded = f.status === 'degraded';
            return (
              <tr
                key={f.name}
                className={`sd-feeds__row${degraded ? ' sd-feeds__row--degraded' : ''}`}
                style={{ animation: `dcRise 340ms ${i * 45}ms ease-out both` }}
              >
                <td>{f.name}</td>
                <td style={{ color: 'color-mix(in srgb, var(--color-text) 62%, transparent)' }}>{f.provider}</td>
                <td className="sd-feeds__mono sd-feeds__resCol">{f.res}</td>
                <td className="sd-feeds__mono" style={{ textAlign: 'right' }}>{f.age}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="sd-feeds__status" style={{ color: f.color }}>
                    <i
                      className={`sd-feeds__dot${degraded ? ' sd-feeds__dot--degraded' : ''}`}
                      style={{ background: f.color, animationDuration: f.rate }}
                    />
                    {f.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="sd-feeds__note">
        All feeds are mocked against the production schema. Swap the fetch layer only: grid payloads are
        typed as IceGrid {'{ epsg: 3031, cellKm, origin, values: Float32Array }'}; drift payloads as
        BergTrack {'{ designator, fixes: Fix[], cone: ConeSample[] }'}.
      </div>

      <style>{`
        .sd-feeds { flex: 1; min-height: 0; overflow-y: auto; padding: var(--space-8); animation: dcFade 380ms ease-out both; }
        .sd-feeds__eyebrow {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-accent);
        }
        .sd-feeds__title { margin-top: var(--space-2); font-size: 30px; }
        .sd-feeds__table { width: 100%; max-width: 1200px; margin-top: var(--space-6); font-size: 13px; }
        .sd-feeds__table th {
          text-align: left; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .sd-feeds__mono { font-family: var(--font-mono); font-size: 12px; color: color-mix(in srgb, var(--color-text) 62%, transparent); }
        .sd-feeds__resCol { }
        .sd-feeds__status { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; }
        .sd-feeds__dot { width: 6px; height: 6px; border-radius: 50%; animation: dcPulse 1.8s ease-in-out infinite; }

        .sd-feeds__row { transition: background 160ms ease; }
        .sd-feeds__row:hover { background: color-mix(in srgb, var(--color-text) 5%, transparent); }

        /* Degraded is the one row an operator actually needs to notice —
           previously distinguished by text color alone. A persistent inset
           accent (survives reduced-motion) plus the same hazard-ring pulse
           used for CRITICAL alerts elsewhere gives it real visual weight. */
        .sd-feeds__row--degraded td:first-child { box-shadow: inset 3px 0 0 0 #d95a4f; }
        .sd-feeds__dot--degraded { animation: dcPulse 1.8s ease-in-out infinite, dcHazard 2.2s ease-in-out infinite; }

        .sd-feeds__note {
          margin-top: var(--space-8); font-family: var(--font-mono); font-size: 10px; line-height: 1.7;
          color: color-mix(in srgb, var(--color-text) 45%, transparent); max-width: 70ch;
        }
      `}</style>
    </main>
  );
}