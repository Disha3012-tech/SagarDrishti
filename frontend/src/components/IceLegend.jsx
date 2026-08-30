export default function IceLegend() {
  return (
    <div className="sd-legend">
      <div className="sd-legend__title">Ice concentration</div>
      <div className="sd-legend__ramp" />
      <div className="sd-legend__scale"><span>15%</span><span>50%</span><span>100%</span></div>
      <div className="sd-legend__symbols">
        <span><i className="sd-legend__berg" />Iceberg + drift cone</span>
        <span><i className="sd-legend__vessel" />Tracked vessel</span>
        <span><i className="sd-legend__route" />Recommended route</span>
      </div>
      <style>{`
        .sd-legend {
          flex: none; width: 246px; padding: var(--space-4);
          border-radius: var(--radius-md); background: rgba(27,30,46,0.78);
          backdrop-filter: blur(14px); box-shadow: var(--shadow-md);
        }
        .sd-legend__title {
          font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 50%, transparent);
        }
        .sd-legend__ramp {
          width: 100%; height: 8px; margin: var(--space-3) 0 5px; border-radius: 4px;
          background: linear-gradient(90deg, #2b2741, #5d5294, #968ae0, #d2cefd, #f5f4ff);
        }
        .sd-legend__scale {
          display: flex; justify-content: space-between; font-family: var(--font-mono);
          font-size: 9px; color: color-mix(in srgb, var(--color-text) 45%, transparent);
        }
        .sd-legend__symbols {
          display: flex; flex-direction: column; gap: 5px; margin-top: var(--space-4);
          font-family: var(--font-mono); font-size: 10px; color: color-mix(in srgb, var(--color-text) 62%, transparent);
        }
        .sd-legend__symbols span { display: flex; align-items: center; gap: 7px; }
        .sd-legend__berg {
          width: 9px; height: 9px; border: 1px solid #d9a24a; border-radius: 2px; transform: rotate(45deg);
        }
        .sd-legend__vessel { width: 9px; height: 9px; border-radius: 50%; background: #6fcf97; }
        .sd-legend__route { width: 9px; height: 2px; background: var(--color-accent); }
      `}</style>
    </div>
  );
}