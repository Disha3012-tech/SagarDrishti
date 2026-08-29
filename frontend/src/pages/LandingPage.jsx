import { useRef } from 'react';
import PolarCanvas from '../components/PolarCanvas';
import StatBand from '../components/StatBand';
import useRevealOnScroll from '../hooks/useRevealOnScroll';
import { stats, capabilities, sources } from '../data/mockData';

export default function LandingPage({ data, onGoOps, onGoForecast }) {
  const containerRef = useRevealOnScroll([]);
  const heroBtnRef = useRef(null);

  const handleMagnetMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform =
      `translate(${((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.18).toFixed(1)}px)`;
  };
  const handleMagnetLeave = (e) => { e.currentTarget.style.transform = 'none'; };

  return (
    <main className="sd-landing" ref={containerRef}>
      <section className="sd-hero">
        <div className="sd-hero__aurora" />
        <div className="sd-hero__snow" />
        <div className="sd-hero__grid">
          <div>
            <div className="sd-hero__eyebrow">Antarctic ice decision support</div>
            <h1 className="sd-hero__title">Ice you can plan against.</h1>
            <p className="sd-hero__lede">
              Sea-ice concentration nowcasts and seasonal outlooks, iceberg drift trajectories with
              calibrated uncertainty, and ice-class-aware route optimisation — assimilated from AMSR2,
              Sentinel-1, INCOIS ocean state and ECMWF forcing into one operational picture for polar
              research vessels.
            </p>
            <div className="sd-hero__ctas">
              <button
                type="button" ref={heroBtnRef} className="btn btn-primary sd-hero__cta"
                onClick={onGoOps} onMouseMove={handleMagnetMove} onMouseLeave={handleMagnetLeave}
              >
                Open operations dashboard
              </button>
              <button type="button" className="btn btn-secondary sd-hero__cta" onClick={onGoForecast}>
                Sea-ice forecast module
              </button>
            </div>
            <div className="sd-hero__specs">
              <span>3.125 km grid</span><span>+72 h horizon</span><span>PC1–PC7 ice classes</span><span>GPX / KML export</span>
            </div>
          </div>
          <div className="sd-hero__preview" onClick={onGoOps}>
            <PolarCanvas mode="preview" data={data} />
            <div className="sd-hero__previewLabel">South polar stereographic · live nowcast</div>
            <div className="sd-hero__previewBadge">
              <i className="sd-hero__previewDot" />18 icebergs · 3 vessels
            </div>
          </div>
        </div>
      </section>

      <StatBand stats={stats} />

      <section className="sd-section">
        <div data-reveal="1" className="sd-problem">
          <h2>The problem is not the forecast. It is the decision.</h2>
          <p>
            Passage planning in the Southern Ocean is done today by reading raw satellite ice charts
            against a paper route, hours after the pass. Sagar Drishti closes that loop: model output is
            fused, scored against the vessel&apos;s ice class, and returned as a ranked set of routes with
            the reasoning attached.
          </p>
        </div>
        <div className="sd-capabilities">
          {capabilities.map((c) => (
            <div key={c.kicker} data-reveal="1" className="card elev-sm sd-capability">
              <div className="card-kicker">{c.kicker}</div>
              <div className="card-title">{c.title}</div>
              <div className="card-body">{c.body}</div>
              <div className="card-meta">{c.meta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="sd-section sd-section--sources">
        <div data-reveal="1" className="sd-sources__label">Assimilated sources</div>
        <div className="sd-sources__list">
          {sources.map((src) => (
            <span key={src} data-reveal="1" className="tag tag-outline sd-sources__tag">{src}</span>
          ))}
        </div>
        <div data-reveal="1" className="sd-takecon">
          <div>
            <h3>Take the con.</h3>
            <p>Mock 2026/27 austral summer season · Bharati → Maitri coastal transit loaded.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onGoOps}>Enter dashboard</button>
        </div>
      </section>

      <footer className="sd-footer">Prototype · synthetic datasets · typed interfaces map 1:1 to NCPOR / INCOIS / Bhuvan feed schemas.</footer>

      <style>{`
        .sd-landing { flex: 1; min-height: 0; overflow-y: auto; animation: dcFade 400ms ease-out both; }

        .sd-hero {
          position: relative; overflow: hidden; padding: 120px var(--space-8) 96px;
          border-bottom: 1px solid var(--color-divider);
        }
        .sd-hero__aurora {
          position: absolute; inset: -30%; pointer-events: none; opacity: 0.5;
          background: conic-gradient(from 210deg at 62% 38%, transparent 0deg, rgba(145,132,217,0.30) 70deg,
            rgba(76,83,151,0.34) 150deg, transparent 250deg, rgba(111,207,151,0.13) 320deg, transparent 360deg);
          filter: blur(66px); animation: dcAurora 34s ease-in-out infinite; will-change: transform;
        }
        .sd-hero__snow {
          position: absolute; inset: -20% -10%; pointer-events: none; opacity: 0.5;
          background-image: radial-gradient(#e9e9ed 0.7px, transparent 0.8px), radial-gradient(#d2cefd 0.6px, transparent 0.7px);
          background-size: 130px 130px, 190px 190px; background-position: 0 0, 60px 40px;
          animation: dcDrift 40s linear infinite;
        }
        .sd-hero__grid {
          position: relative; display: grid; grid-template-columns: minmax(360px, 1fr) minmax(320px, 520px);
          gap: 72px; align-items: center; max-width: 1440px;
        }
        .sd-hero__eyebrow {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--color-accent); animation: dcRise 620ms ease-out both;
        }
        .sd-hero__title {
          margin: var(--space-4) 0 var(--space-6); font-size: 60px; line-height: 1.04; letter-spacing: -0.025em;
          max-width: 15ch; text-wrap: pretty; animation: dcRise 620ms ease-out 90ms both;
        }
        .sd-hero__lede {
          max-width: 54ch; font-size: 17px; line-height: 1.6;
          color: color-mix(in srgb, var(--color-text) 76%, transparent);
          animation: dcRise 620ms ease-out 190ms both;
        }
        .sd-hero__ctas {
          display: flex; flex-wrap: wrap; gap: var(--space-4); margin-top: var(--space-8);
          animation: dcRise 620ms ease-out 300ms both;
        }
        .sd-hero__cta { height: 42px; padding: 0 var(--space-6); font-size: 14px; }
        .sd-hero__specs {
          display: flex; flex-wrap: wrap; gap: var(--space-6); margin-top: var(--space-8);
          font-family: var(--font-mono); font-size: 11px; color: color-mix(in srgb, var(--color-text) 45%, transparent);
          animation: dcRise 620ms ease-out 400ms both;
        }
        .sd-hero__preview {
          position: relative; aspect-ratio: 1 / 1; border-radius: var(--radius-lg); overflow: hidden;
          box-shadow: var(--shadow-md); cursor: pointer; animation: dcZoom 900ms ease-out 180ms both;
          transition: transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 400ms ease;
        }
        .sd-hero__preview:hover { transform: scale(1.015); box-shadow: var(--shadow-lg); }
        .sd-hero__previewLabel {
          position: absolute; left: var(--space-4); top: var(--space-4); font-family: var(--font-mono);
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 60%, transparent);
        }
        .sd-hero__previewBadge {
          position: absolute; right: var(--space-4); bottom: var(--space-4); display: flex; align-items: center;
          gap: 6px; padding: 4px 9px; border-radius: var(--radius-sm); background: rgba(22,24,38,0.7);
          backdrop-filter: blur(8px); font-family: var(--font-mono); font-size: 10px;
        }
        .sd-hero__previewDot {
          width: 5px; height: 5px; border-radius: 50%; background: #6fcf97; animation: dcPulse 2s ease-in-out infinite;
        }

        .sd-section { padding: 96px var(--space-8); max-width: 1440px; }
        .sd-section--sources { padding: 0 var(--space-8) 96px; }
        .sd-problem { max-width: 62ch; }
        .sd-problem h2 { font-size: 34px; letter-spacing: -0.02em; }
        .sd-problem p {
          margin-top: var(--space-4); color: color-mix(in srgb, var(--color-text) 72%, transparent); line-height: 1.65;
        }
        .sd-capabilities {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-6); margin-top: var(--space-8);
        }
        .sd-capability {
          padding: var(--space-6); gap: var(--space-3);
          transition: transform 260ms ease, box-shadow 260ms ease;
        }
        .sd-capability:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .sd-capability .card-kicker { font-family: var(--font-mono); }
        .sd-capability .card-title { font-size: 19px; }
        .sd-capability .card-body { color: color-mix(in srgb, var(--color-text) 70%, transparent); font-size: 14px; }
        .sd-capability .card-meta { font-family: var(--font-mono); margin-top: var(--space-2); }

        .sd-sources__label {
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: color-mix(in srgb, var(--color-text) 45%, transparent);
        }
        .sd-sources__list { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-4); }
        .sd-sources__tag { font-family: var(--font-mono); font-size: 11px; padding: 5px 10px; }
        .sd-takecon {
          margin-top: 72px; padding: var(--space-8); border: 1px solid var(--color-divider);
          border-radius: var(--radius-lg); display: flex; flex-wrap: wrap; align-items: center;
          justify-content: space-between; gap: var(--space-6);
          background: radial-gradient(120% 160% at 12% 0%, rgba(145,132,217,0.14), transparent 60%);
        }
        .sd-takecon h3 { font-size: 26px; }
        .sd-takecon p { margin: var(--space-2) 0 0; color: color-mix(in srgb, var(--color-text) 68%, transparent); font-size: 14px; }

        .sd-footer {
          padding: var(--space-8); border-top: 1px solid var(--color-divider);
          font-family: var(--font-mono); font-size: 11px; color: color-mix(in srgb, var(--color-text) 42%, transparent);
        }
      `}</style>
    </main>
  );
}
