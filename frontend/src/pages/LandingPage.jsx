import PolarCanvas from '../components/PolarCanvas';
import StatBand from '../components/StatBand';
import AuroraBackground from '../components/AuroraBackground';
import InteractiveHoverButton from '../components/InteractiveHoverButton';
import ConstellationGrid from '../components/ConstellationGrid';
import useRevealOnScroll from '../hooks/useRevealOnScroll';
import { stats, capabilities, sources } from '../data/mockData';

export default function LandingPage({ data, onGoOps, onGoForecast }) {
  const containerRef = useRevealOnScroll([]);

  return (
    <main className="sd-landing" ref={containerRef}>
      <AuroraBackground />

      <div className="sd-landing__content">
        <section className="sd-hero">
          <ConstellationGrid className="sd-hero__mesh" />
          <div className="sd-hero__grid">
            <div className="sd-hero__text-container">
              <div className="sd-hero__eyebrow">
                <span className="sd-hero__eyebrow-dot" />
                Antarctic ice decision support
              </div>
              <h1 className="sd-hero__title">
                Ice you can <span className="sd-hero__title-accent">plan against.</span>
              </h1>
              <p className="sd-hero__lede">
                Sea-ice concentration nowcasts and seasonal outlooks, iceberg drift trajectories with
                calibrated uncertainty, and ice-class-aware route optimisation — assimilated from AMSR2,
                Sentinel-1, INCOIS ocean state and ECMWF forcing into one operational picture for polar
                research vessels.
              </p>
              <div className="sd-hero__ctas">
                <InteractiveHoverButton text="Enter operations dashboard" onClick={onGoOps} />
              </div>
              <div className="sd-hero__specs">
                <span className="sd-spec-chip">3.125 km grid</span>
                <span className="sd-spec-chip">+72 h horizon</span>
                <span className="sd-spec-chip">PC1–PC7 ice classes</span>
                <span className="sd-spec-chip">GPX / KML export</span>
              </div>
            </div>

            <div 
              className="sd-hero__preview" 
              onClick={onGoOps} 
              role="button" 
              tabIndex={0} 
              onKeyDown={(e) => e.key === 'Enter' && onGoOps()}
              aria-label="Interactive live polar nowcast preview"
            >
              <PolarCanvas mode="preview" data={data} />
              <div className="sd-hero__previewOverlay" />
              <div className="sd-hero__previewLabel">South polar stereographic · live nowcast</div>
              <div className="sd-hero__previewBadge">
                <i className="sd-hero__previewDot" /> 18 icebergs · 3 vessels
              </div>
            </div>
          </div>
        </section>

        <StatBand stats={stats} />

        <section className="sd-section">
          <div data-reveal="1" className="sd-problem">
            <span className="sd-section__tag">Operational Paradigm</span>
            <h2>The problem is not the forecast.<br />It is the decision.</h2>
            <p>
              Passage planning in the Southern Ocean is done today by reading raw satellite ice charts
              against a paper route, hours after the pass. Sagar Drishti closes that loop: model output is
              fused, scored against the vessel&apos;s ice class, and returned as a ranked set of routes with
              the reasoning attached.
            </p>
          </div>

          <div className="sd-capabilities">
            {capabilities.map((c) => (
              <div key={c.kicker} data-reveal="1" className="sd-capability">
                <div className="sd-capability__glow" />
                <div className="card-kicker">{c.kicker}</div>
                <div className="card-title">{c.title}</div>
                <div className="card-body">{c.body}</div>
                <div className="card-meta">{c.meta}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="sd-section sd-section--sources">
          <div data-reveal="1" className="sd-sources__header">
            <span className="sd-sources__label">Assimilated Operational Sources</span>
            <span className="sd-sources__count">{sources.length} ACTIVE FEEDS</span>
          </div>

          <div className="sd-sources__list">
            {sources.map((src) => (
              <div key={src} data-reveal="1" className="sd-sources__tag">
                <span className="sd-sources__dot" />
                {src}
              </div>
            ))}
          </div>

          <div data-reveal="1" className="sd-takecon-wrapper">
            <div className="sd-takecon__backdrop-glow" />
            <div className="sd-takecon">
              <div className="sd-takecon__left">
                <div className="sd-takecon__badge">
                  <span className="sd-takecon__ping" />
                  READY FOR CON
                </div>
                <h3>Take the con.</h3>
                <p>Mock 2026/27 austral summer season · Bharati → Maitri coastal transit loaded.</p>
              </div>

              <div className="sd-takecon__right">
                <InteractiveHoverButton text="Enter dashboard" onClick={onGoOps} />
              </div>
            </div>
          </div>
        </section>

        <footer className="sd-footer">
          <div className="sd-footer__status">
            <span className="sd-footer__indicator" /> Prototype Operational System
          </div>
          <div>Synthetic datasets · typed interfaces map 1:1 to NCPOR / INCOIS / Bhuvan feed schemas.</div>
        </footer>
      </div>

      <style>{`
        .sd-landing {
          --bg-dark-base: #030206;
          --bg-dark-surface: #06040d;
          --bg-dark-card: rgba(8, 6, 18, 0.75);
          --border-subtle: rgba(255, 255, 255, 0.08);
          --border-accent: rgba(45, 212, 191, 0.25);
          --text-primary: #ecfdf5;
          --text-secondary: #94a3b8;
          --text-muted: #a0aec0;
          --accent-cyan: #2dd4bf;
          --accent-purple: #8b5cf6;

          flex: 1;
          min-height: 0;
          overflow-y: auto;
          position: relative;
          background-color: var(--bg-dark-base);
          color: var(--text-primary);
          animation: dcFade 400ms ease-out both;
        }

        .sd-landing__content {
          position: relative;
          z-index: 1;
        }

        /* Hero Section */
        .sd-hero {
          position: relative;
          overflow: hidden;
          padding: 120px var(--space-8, 32px) 96px;
          border-bottom: 1px solid var(--border-subtle);
          background: radial-gradient(circle at 50% 0%, rgba(15, 10, 30, 0.8) 0%, rgba(2, 10, 7, 0.6) 50%, transparent 80%);
        }
        
        .sd-hero__mesh {
          z-index: 0;
          opacity: 0.25;
        }

        .sd-hero__grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(320px, 1fr) minmax(320px, 500px);
          gap: 64px;
          align-items: center;
          max-width: 1380px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .sd-hero__grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .sd-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent-cyan);
          background: rgba(45, 212, 191, 0.08);
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid rgba(45, 212, 191, 0.25);
          animation: dcRise 620ms ease-out both;
        }

        .sd-hero__eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
        }

        .sd-hero__title {
          margin: 20px 0 24px;
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.03em;
          font-weight: 700;
          color: #ffffff;
          animation: dcRise 620ms ease-out 90ms both;
        }

        .sd-hero__title-accent {
          background: linear-gradient(135deg, #ffffff 20%, var(--accent-cyan) 60%, var(--accent-purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sd-hero__lede {
          max-width: 56ch;
          font-size: 16px;
          line-height: 1.65;
          color: var(--text-secondary);
          animation: dcRise 620ms ease-out 190ms both;
        }

        .sd-hero__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 32px;
          animation: dcRise 620ms ease-out 300ms both;
        }

        /* Spec Chips Fix */
        .sd-hero__specs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
          animation: dcRise 620ms ease-out 400ms both;
        }

        .sd-spec-chip {
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          font-weight: 500;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 14px;
          border-radius: 6px;
          transition: all 200ms ease;
        }

        .sd-spec-chip:hover {
          color: #ffffff;
          background: rgba(45, 212, 191, 0.1);
          border-color: rgba(45, 212, 191, 0.35);
          transform: translateY(-1px);
        }

        /* Hero Preview Window */
        .sd-hero__preview {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          overflow: hidden;
          background: var(--bg-dark-surface);
          border: 1px solid var(--border-subtle);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(139, 92, 246, 0.05);
          cursor: pointer;
          animation: dcZoom 900ms ease-out 180ms both;
          transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms ease, box-shadow 400ms ease;
        }

        .sd-hero__preview:hover, .sd-hero__preview:focus-visible {
          transform: translateY(-4px) scale(1.01);
          border-color: var(--border-accent);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(45, 212, 191, 0.15);
          outline: none;
        }

        .sd-hero__previewOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(3, 2, 6, 0.5) 0%, transparent 30%, transparent 70%, rgba(3, 2, 6, 0.7) 100%);
          pointer-events: none;
        }

        .sd-hero__previewLabel {
          position: absolute;
          left: 16px;
          top: 16px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
          background: rgba(3, 2, 6, 0.85);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
        }

        .sd-hero__previewBadge {
          position: absolute;
          right: 16px;
          bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(3, 2, 6, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-primary);
        }

        .sd-hero__previewDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: dcPulse 2s ease-in-out infinite;
        }

        /* Generic Section Styling */
        .sd-section {
          position: relative;
          padding: 100px var(--space-8, 32px);
          max-width: 1380px;
          margin: 0 auto;
        }

        .sd-section--sources {
          padding-top: 40px;
          padding-bottom: 100px;
        }

        .sd-section__tag {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-cyan);
          display: block;
          margin-bottom: 12px;
        }

        .sd-problem {
          max-width: 64ch;
        }

        .sd-problem h2 {
          font-size: clamp(28px, 3.5vw, 40px);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-weight: 600;
        }

        .sd-problem p {
          margin-top: 20px;
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 16px;
        }

        /* Capabilities Grid */
        .sd-capabilities {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-top: 56px;
        }

        .sd-capability {
          position: relative;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          overflow: hidden;
          background: var(--bg-dark-card);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease;
        }

        .sd-capability__glow {
          position: absolute;
          inset: -40%;
          opacity: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.12), transparent 70%);
          transition: opacity 380ms ease;
        }

        .sd-capability:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
          border-color: rgba(45, 212, 191, 0.25);
        }

        .sd-capability:hover .sd-capability__glow {
          opacity: 1;
        }

        .sd-capability .card-kicker {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent-cyan);
        }

        .sd-capability .card-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
        }

        .sd-capability .card-body {
          color: var(--text-secondary);
          font-size: 14.5px;
          line-height: 1.6;
          flex-grow: 1;
        }

        .sd-capability .card-meta {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.04);
        }

        /* Sources Section */
        .sd-sources__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sd-sources__label {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--accent-cyan);
        }

        .sd-sources__count {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.12em;
          color: var(--text-muted);
        }

        .sd-sources__list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sd-sources__tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          padding: 8px 16px;
          background: rgba(10, 8, 22, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          color: var(--text-secondary);
          transition: all 250ms ease;
        }

        .sd-sources__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--accent-cyan);
          opacity: 0.6;
        }

        .sd-sources__tag:hover {
          border-color: rgba(45, 212, 191, 0.4);
          color: var(--text-primary);
          background: rgba(45, 212, 191, 0.08);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .sd-sources__tag:hover .sd-sources__dot {
          opacity: 1;
          box-shadow: 0 0 6px var(--accent-cyan);
        }

        /* "Take the con" Section */
        .sd-takecon-wrapper {
          position: relative;
          margin-top: 72px;
        }

        .sd-takecon__backdrop-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), rgba(45, 212, 191, 0.08), transparent 70%);
          filter: blur(35px);
          pointer-events: none;
          z-index: 0;
        }

        .sd-takecon {
          position: relative;
          z-index: 1;
          padding: 44px 52px;
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          background: linear-gradient(135deg, rgba(12, 9, 26, 0.95) 0%, rgba(3, 8, 12, 0.98) 100%);
          backdrop-filter: blur(16px);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .sd-takecon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent-purple), var(--accent-cyan), transparent);
          opacity: 0.7;
        }

        .sd-takecon__left {
          max-width: 580px;
        }

        .sd-takecon__badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--accent-cyan);
          background: rgba(45, 212, 191, 0.08);
          padding: 3px 10px;
          border-radius: 4px;
          border: 1px solid rgba(45, 212, 191, 0.2);
          margin-bottom: 14px;
        }

        .sd-takecon__ping {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 8px var(--accent-cyan);
          animation: dcPulse 2s ease-in-out infinite;
        }

        .sd-takecon h3 {
          font-size: 32px;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .sd-takecon p {
          margin-top: 8px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.5;
        }

        /* Footer */
        .sd-footer {
          position: relative;
          padding: 32px var(--space-8, 32px);
          border-top: 1px solid var(--border-subtle);
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: #020104;
        }

        .sd-footer__status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
        }

        .sd-footer__indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
        }

        @keyframes dcPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>
    </main>
  );
}