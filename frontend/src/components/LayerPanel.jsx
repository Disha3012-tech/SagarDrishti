const LAYER_DEFS = [
  ['ice', 'Ice concentration', 'AMSR2'],
  ['thickness', 'Ice thickness', 'CS2/SMOS'],
  ['bergs', 'Icebergs + cones', 'S1 EW'],
  ['vessels', 'Vessel positions', 'AIS'],
  ['currents', 'Ocean currents', 'INCOIS'],
  ['wind', 'Surface wind', 'HRES'],
  ['bathy', 'Bathymetry', 'GEBCO'],
  ['route', 'Route overlay', 'solver']
];

export default function LayerPanel({ layers, onToggle }) {
  const layersOn = Object.values(layers).filter(Boolean).length;
  return (
    <div className="sd-layerpanel">
      <div className="sd-layerpanel__head">Layers<span>{layersOn}/8</span></div>
      <div className="sd-layerpanel__list">
        {LAYER_DEFS.map(([key, label, src]) => {
          const on = !!layers[key];
          return (
            <button
              key={key}
              type="button"
              className="sd-layerpanel__item"
              data-on={on}
              onClick={() => onToggle(key)}
            >
              <i className="sd-layerpanel__track"><em className="sd-layerpanel__knob" /></i>
              <span className="sd-layerpanel__label">{label}</span>
              <span className="sd-layerpanel__src">{src}</span>
            </button>
          );
        })}
      </div>
      <style>{`
        .sd-layerpanel {
          flex: none; width: 246px;
          border-radius: var(--radius-md); background: rgba(27,30,46,0.78);
          backdrop-filter: blur(14px); box-shadow: var(--shadow-md); overflow: hidden;
        }
        .sd-layerpanel__head {
          display: flex; align-items: center; justify-content: space-between;
          padding: var(--space-4) var(--space-4) var(--space-3);
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase; color: color-mix(in srgb, var(--color-text) 55%, transparent);
        }
        .sd-layerpanel__list { display: flex; flex-direction: column; padding: 0 var(--space-3) var(--space-3); }
        .sd-layerpanel__item {
          display: flex; align-items: center; gap: var(--space-3); width: 100%;
          padding: 7px var(--space-3); background: transparent; border: 0;
          border-radius: var(--radius-sm); cursor: pointer; text-align: left;
          color: color-mix(in srgb, var(--color-text) 48%, transparent);
          transition: background 150ms ease;
        }
        .sd-layerpanel__item:hover { background: color-mix(in srgb, var(--color-text) 7%, transparent); }
        .sd-layerpanel__item[data-on="true"] { color: var(--color-text); }
        .sd-layerpanel__track {
          flex: 0 0 26px; height: 14px; border-radius: 8px; position: relative;
          background: rgba(233,233,237,0.13); transition: background 220ms ease;
        }
        .sd-layerpanel__item[data-on="true"] .sd-layerpanel__track {
          background: color-mix(in srgb, var(--color-accent) 42%, transparent);
        }
        .sd-layerpanel__knob {
          position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border-radius: 50%;
          background: rgba(233,233,237,0.45);
          transform: translateX(0px);
          transition: transform 300ms cubic-bezier(0.2, 1.5, 0.4, 1), background 220ms ease;
        }
        .sd-layerpanel__item[data-on="true"] .sd-layerpanel__knob {
          background: var(--color-accent-200); transform: translateX(12px);
        }
        .sd-layerpanel__label { flex: 1; font-size: 13px; }
        .sd-layerpanel__src {
          font-family: var(--font-mono); font-size: 9px;
          color: color-mix(in srgb, var(--color-text) 38%, transparent);
        }
      `}</style>
    </div>
  );
}