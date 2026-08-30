function timeAgo(hhmmz) {
  // Alerts carry a "HH:MMZ" stamp against the scenario's fixed "now" of
  // 07:42Z — this converts that into a relative label like "4m ago" so
  // the panel reads at a glance instead of requiring UTC math.
  const [hh, mm] = hhmmz.replace('Z', '').split(':').map(Number);
  const mins = (7 * 60 + 42) - (hh * 60 + mm);
  if (mins <= 0) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

const LEVEL_ORDER = { critical: 0, warning: 1, info: 2 };

export default function AlertPanel({ alerts }) {
  const sorted = [...alerts].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  const critCount = alerts.filter((a) => a.level === 'critical').length;
  const warnCount = alerts.filter((a) => a.level === 'warning').length;

  return (
    <div className="sd-alerts">
      <div className="sd-alerts__head">
        <span>Hazard alerts</span>
        <div className="sd-alerts__counts">
          {critCount > 0 && <span className="sd-alerts__countPill sd-alerts__countPill--crit">{critCount} critical</span>}
          {warnCount > 0 && <span className="sd-alerts__countPill sd-alerts__countPill--warn">{warnCount} warning</span>}
          <span className="sd-alerts__countTotal">{alerts.length} active</span>
        </div>
      </div>

      <div className="sd-alerts__scroll">
        {sorted.map((a, i) => (
          <div
            key={a.time + a.level}
            className="sd-alerts__card"
            data-level={a.level}
            style={{
              animation: `dcSlideR 420ms ${i * 140}ms cubic-bezier(0.2, 0.8, 0.2, 1) both, dcFlash 1200ms ${i * 140}ms ease-out both`
            }}
          >
            {a.level === 'critical' && <i className="sd-alerts__pulse" style={{ background: a.accent }} />}
            <div className="sd-alerts__cardInner">
              <div className="sd-alerts__meta">
                <span className="sd-alerts__level" style={{ color: a.accent, borderColor: a.accent }}>
                  {a.glyph} {a.level.toUpperCase()}
                </span>
                <span className="sd-alerts__time" title={a.time}>{timeAgo(a.time)}</span>
              </div>
              <div className="sd-alerts__text">{a.text}</div>
              <div className="sd-alerts__submeta">
                {a.meta.split(' · ').map((chunk) => (
                  <span key={chunk} className="sd-alerts__chip">{chunk}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .sd-alerts {
          position: absolute; right: var(--space-6); top: var(--space-6); bottom: 104px; width: 356px;
          display: flex; flex-direction: column;
          animation: dcSlideR 460ms 80ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .sd-alerts__head {
          flex: none; display: flex; flex-direction: column; gap: 7px; margin-bottom: var(--space-3);
        }
        .sd-alerts__head > span:first-child {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 55%, transparent);
        }
        .sd-alerts__counts { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .sd-alerts__countPill {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.06em; font-weight: 600;
          padding: 2px 7px; border-radius: 999px;
        }
        .sd-alerts__countPill--crit { background: rgba(217,90,79,0.16); color: #e08178; }
        .sd-alerts__countPill--warn { background: rgba(217,162,74,0.16); color: #e0b578; }
        .sd-alerts__countTotal {
          font-family: var(--font-mono); font-size: 9px;
          color: color-mix(in srgb, var(--color-text) 42%, transparent);
        }
        .sd-alerts__scroll {
          flex: 1; min-height: 0; overflow-y: auto;
          display: flex; flex-direction: column; gap: var(--space-3);
          scrollbar-width: thin; scrollbar-color: rgba(233,233,237,0.2) transparent;
        }
        .sd-alerts__scroll::-webkit-scrollbar { width: 5px; }
        .sd-alerts__scroll::-webkit-scrollbar-thumb { background: rgba(233,233,237,0.18); border-radius: 3px; }
        .sd-alerts__scroll::-webkit-scrollbar-track { background: transparent; }
        .sd-alerts__card {
          position: relative; flex: none; overflow: hidden;
          border-radius: var(--radius-md);
          background: rgba(27,30,46,0.82); backdrop-filter: blur(14px); box-shadow: var(--shadow-sm);
          border: 1px solid transparent;
          transition: border-color 160ms ease, transform 160ms ease;
        }
        .sd-alerts__card:hover { transform: translateX(-2px); }
        .sd-alerts__card[data-level="critical"] { border-color: rgba(217,90,79,0.35); }
        .sd-alerts__card[data-level="warning"] { border-color: rgba(217,162,74,0.22); }
        .sd-alerts__card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
        }
        .sd-alerts__card[data-level="critical"]::before { background: #d95a4f; }
        .sd-alerts__card[data-level="warning"]::before { background: #d9a24a; }
        .sd-alerts__card[data-level="info"]::before { background: #6fcf97; }
        .sd-alerts__pulse {
          position: absolute; right: var(--space-4); top: var(--space-3);
          width: 6px; height: 6px; border-radius: 50%;
          animation: dcHazard 1800ms ease-out infinite;
        }
        .sd-alerts__cardInner { padding: var(--space-3) var(--space-4); }
        .sd-alerts__meta {
          display: flex; align-items: center; gap: var(--space-3);
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .sd-alerts__level {
          display: flex; align-items: center; gap: 5px; padding: 2px 7px;
          border-radius: var(--radius-sm); border: 1px solid;
        }
        .sd-alerts__time { color: color-mix(in srgb, var(--color-text) 40%, transparent); cursor: default; }
        .sd-alerts__text { margin-top: 6px; font-size: 13px; line-height: 1.45; }
        .sd-alerts__submeta { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .sd-alerts__chip {
          font-family: var(--font-mono); font-size: 9px; padding: 2px 6px; border-radius: var(--radius-sm);
          background: color-mix(in srgb, var(--color-text) 8%, transparent);
          color: color-mix(in srgb, var(--color-text) 55%, transparent);
        }
      `}</style>
    </div>
  );
}