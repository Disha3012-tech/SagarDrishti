import './Header.css';

const VIEWS = [
  ['landing', 'Overview'],
  ['ops', 'Operations'],
  ['routes', 'Route planning'],
  ['bergs', 'Icebergs'],
  ['forecast', 'Sea-ice forecast'],
  ['feeds', 'Feeds']
];

export default function Header({ view, onNavigate, syncAgo = 3, hideNav = false }) {
  // Hide navigation links when explicitly told to, or automatically on the landing view
  const shouldShowNav = !hideNav && view !== 'landing';

  return (
    <header className="sd-header">
      <div className="sd-header__brand">
        <span className="sd-header__title">Sagar Drishti</span>
        <span className="sd-header__tag">NCPOR · MoES · v0.9.4</span>
      </div>

      {shouldShowNav && (
        <nav className="sd-header__nav">
          {VIEWS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="sd-header__navBtn"
              data-active={view === key}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      <div className="sd-header__status">
        <span className="sd-header__live">
          <i className="sd-header__dot" />4 feeds live · 1 degraded
        </span>
        <span>synced {syncAgo} min ago · 07:42 UTC</span>
        <span className="sd-header__badge">EPSG:3031</span>
      </div>
    </header>
  );
}