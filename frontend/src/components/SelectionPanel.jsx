export default function SelectionPanel({ sel, onClear, position = 'ops' }) {
  if (!sel) return null;
  return (
    <aside className={`sd-selection sd-selection--${position}`}>
      <div className="sd-selection__head">
        <div>
          <span className="sd-selection__kind">{sel.kind}</span>
          <span className="sd-selection__name">{sel.name}</span>
        </div>
        {onClear && (
          <button type="button" className="btn btn-ghost sd-selection__close" onClick={onClear}>✕</button>
        )}
      </div>
      <div className="sd-selection__fields">
        {sel.fields.map((f, i) => (
          <div key={f.k} style={{ animation: `dcRise 340ms ${i * 45}ms ease-out both` }}>
            <div className="sd-selection__fk">{f.k}</div>
            <div className="sd-selection__fv">{f.v}</div>
          </div>
        ))}
      </div>
      <div className="sd-selection__prov">{sel.provenance}</div>
      <style>{`
        .sd-selection {
          padding: var(--space-6); border-radius: var(--radius-md);
          background: rgba(27,30,46,0.86); backdrop-filter: blur(16px); box-shadow: var(--shadow-md);
        }
        .sd-selection--ops {
          position: absolute; right: var(--space-6); bottom: 104px; width: 356px;
          animation: dcSlideR 380ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .sd-selection--bergs {
          position: absolute; left: var(--space-6); right: var(--space-6); bottom: var(--space-6);
          animation: dcRise 380ms ease-out both;
        }
        .sd-selection__head { display: flex; align-items: start; justify-content: space-between; gap: var(--space-4); }
        .sd-selection__kind {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 50%, transparent); margin-right: var(--space-3);
        }
        .sd-selection__name { font-family: var(--font-heading); font-size: 22px; }
        .sd-selection__close { margin-left: auto; min-height: 26px; }
        .sd-selection__fields {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
          gap: var(--space-4); margin-top: var(--space-4);
        }
        .sd-selection__fk {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 45%, transparent);
        }
        .sd-selection__fv { font-family: var(--font-mono); font-size: 14px; margin-top: 2px; }
        .sd-selection__prov {
          margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-divider);
          font-family: var(--font-mono); font-size: 10px; line-height: 1.6;
          color: color-mix(in srgb, var(--color-text) 50%, transparent);
        }
        .sd-selection--bergs .sd-selection__prov { margin-top: var(--space-4); padding-top: 0; border-top: 0; }
      `}</style>
    </aside>
  );
}
