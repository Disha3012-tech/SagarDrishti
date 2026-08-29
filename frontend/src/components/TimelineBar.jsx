const TICKS = ['now', '+12', '+24', '+36', '+48', '+60', '+72'];

export default function TimelineBar({ t, playing, onSetT, onTogglePlay, stamp, confidence }) {
  const label = t < 0.25 ? 'NOW' : '+' + t.toFixed(1) + ' h';
  return (
    <div className="sd-timeline">
      <div className="sd-timeline__row">
        <button type="button" className="btn btn-primary btn-icon sd-timeline__play" onClick={onTogglePlay}>
          {playing ? '❙❙' : '▶'}
        </button>
        <div className="sd-timeline__track">
          <input
            type="range" min="0" max="72" step="0.5" value={t}
            onInput={(e) => onSetT(parseFloat(e.target.value))}
            aria-label="Forecast horizon in hours"
            className="sd-timeline__range"
          />
          <div className="sd-timeline__ticks">
            {TICKS.map((tk) => <span key={tk}>{tk}</span>)}
          </div>
        </div>
        <div className="sd-timeline__readout">
          <span className="sd-timeline__label">{label}</span>
          <span className="sd-timeline__stamp">{stamp}</span>
          <span className="sd-timeline__stamp">conf {confidence}</span>
        </div>
      </div>
      <style>{`
        .sd-timeline {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: var(--space-4) var(--space-6) var(--space-6);
          background: linear-gradient(180deg, transparent, rgba(22,24,38,0.92) 45%);
        }
        .sd-timeline__row { display: flex; align-items: center; gap: var(--space-6); }
        .sd-timeline__play { flex: 0 0 34px; width: 34px; height: 34px; }
        .sd-timeline__play:active { transform: scale(0.94); }
        .sd-timeline__track { flex: 1; position: relative; }
        .sd-timeline__range { width: 100%; accent-color: var(--color-accent); background: transparent; cursor: pointer; }
        .sd-timeline__ticks {
          display: flex; justify-content: space-between; margin-top: 2px;
          font-family: var(--font-mono); font-size: 9px; color: color-mix(in srgb, var(--color-text) 38%, transparent);
        }
        .sd-timeline__readout {
          flex: 0 0 auto; display: flex; align-items: center; gap: var(--space-6);
          padding: 7px var(--space-4); border-radius: var(--radius-md);
          background: rgba(27,30,46,0.8); backdrop-filter: blur(12px);
          font-family: var(--font-mono); font-size: 12px;
        }
        .sd-timeline__label { color: var(--color-accent-300); }
        .sd-timeline__stamp { color: color-mix(in srgb, var(--color-text) 55%, transparent); }
      `}</style>
    </div>
  );
}
