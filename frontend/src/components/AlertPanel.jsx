export default function AlertPanel({ alerts }) {
  return (
    <div className="sd-alerts">
      <div className="sd-alerts__head">Hazard alerts<span>{alerts.length} active</span></div>
      {alerts.map((a, i) => (
        <div
          key={a.time + a.level}
          className="sd-alerts__card"
          style={{
            borderLeftColor: a.accent,
            animation: `dcSlideR 420ms ${i * 140}ms cubic-bezier(0.2, 0.8, 0.2, 1) both, dcFlash 1200ms ${i * 140}ms ease-out both`
          }}
        >
          <div className="sd-alerts__meta">
            <span className="sd-alerts__level" style={{ color: a.accent, borderColor: a.accent }}>
              {a.glyph} {a.level.toUpperCase()}
            </span>
            <span className="sd-alerts__time">{a.time}</span>
          </div>
          <div className="sd-alerts__text">{a.text}</div>
          <div className="sd-alerts__submeta">{a.meta}</div>
        </div>
      ))}
      <style>{`
        .sd-alerts {
          position: absolute; right: var(--space-6); top: var(--space-6); width: 356px;
          display: flex; flex-direction: column; gap: var(--space-3);
          animation: dcSlideR 460ms 80ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .sd-alerts__head {
          display: flex; align-items: center; justify-content: space-between;
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 55%, transparent);
        }
        .sd-alerts__card {
          padding: var(--space-4); border-radius: var(--radius-md); border-left: 2px solid;
          background: rgba(27,30,46,0.82); backdrop-filter: blur(14px); box-shadow: var(--shadow-sm);
        }
        .sd-alerts__meta {
          display: flex; align-items: center; gap: var(--space-3);
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .sd-alerts__level {
          display: flex; align-items: center; gap: 5px; padding: 2px 7px;
          border-radius: var(--radius-sm); border: 1px solid;
        }
        .sd-alerts__time { color: color-mix(in srgb, var(--color-text) 40%, transparent); }
        .sd-alerts__text { margin-top: var(--space-3); font-size: 13px; line-height: 1.5; }
        .sd-alerts__submeta {
          margin-top: var(--space-2); font-family: var(--font-mono); font-size: 10px;
          color: color-mix(in srgb, var(--color-text) 45%, transparent);
        }
      `}</style>
    </div>
  );
}
