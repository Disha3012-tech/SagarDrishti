export default function RouteCard({ route, delay = 0 }) {
  const isRec = route.rec;
  const risk = parseFloat(route.risk);
  const badge = isRec ? 'recommended' : (risk > 0.5 ? 'exceeds ceiling' : 'alternate');
  const badgeColor = isRec ? 'var(--color-accent)' : (risk > 0.35 ? '#d95a4f' : 'color-mix(in srgb, var(--color-text) 45%, transparent)');
  const metrics = [
    { k: 'Distance', v: route.dist },
    { k: 'Speed', v: route.speedKn ? `${route.speedKn} kn` : '—' },
    { k: 'Transit', v: route.eta },
    { k: 'Mean conc', v: route.conc },
    { k: 'Fuel', v: route.fuel },
    { k: 'Risk', v: route.risk, danger: risk > 0.35 }
  ];

  return (
    <div
      className="sd-routecard"
      style={{
        background: isRec ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'var(--color-surface)',
        boxShadow: isRec ? '0 0 0 1px var(--color-accent-600), 0 0 22px rgba(145,132,217,0.16)' : 'var(--shadow-sm)',
        animation: `dcRise 420ms ${delay}ms ease-out both`
      }}
    >
      <div className="sd-routecard__head">
        <i className="sd-routecard__swatch" style={{ background: route.color }} />
        <span className="sd-routecard__id" style={{ color: route.color }}>{route.id}</span>
        <span className="sd-routecard__name">{route.name}</span>
        <span className="sd-routecard__badge" style={{ color: badgeColor }}>{badge}</span>
      </div>
      <div className="sd-routecard__metrics">
        {metrics.map((m) => (
          <div key={m.k}>
            <div className="sd-routecard__mk">{m.k}</div>
            <div className="sd-routecard__mv" style={{ color: m.danger ? '#d95a4f' : 'var(--color-text)' }}>{m.v}</div>
          </div>
        ))}
      </div>
      <style>{`
        .sd-routecard { padding: var(--space-4); border-radius: var(--radius-md); }
        .sd-routecard__head { display: flex; align-items: center; gap: var(--space-3); }
        .sd-routecard__swatch { width: 16px; height: 2px; }
        .sd-routecard__id { font-family: var(--font-mono); font-size: 12px; }
        .sd-routecard__name { font-size: 13px; }
        .sd-routecard__badge {
          margin-left: auto; font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .sd-routecard__metrics {
          display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--space-3); margin-top: var(--space-4);
        }
        .sd-routecard__mk {
          font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.08em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 42%, transparent);
        }
        .sd-routecard__mv { font-family: var(--font-mono); font-size: 13px; margin-top: 2px; }
      `}</style>
    </div>
  );
}