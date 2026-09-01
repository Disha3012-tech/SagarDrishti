import { useMemo } from 'react';

const STAR_COUNT = 70;

// Small seeded LCG so the star field is stable across re-renders instead
// of jumping around every time React re-renders this component.
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// Full-page drifting aurora + twinkling star field, sitting fixed behind
// all page content. Built in plain CSS (no framer-motion) so it costs
// nothing extra to load and is automatically covered by the project's
// existing global prefers-reduced-motion rule in animations.css.
export default function AuroraBackground() {
  const stars = useMemo(() => {
    const rnd = seededRandom(42);
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      id: i,
      left: (rnd() * 100).toFixed(2) + '%',
      top: (rnd() * 100).toFixed(2) + '%',
      size: (rnd() * 1.6 + 0.6).toFixed(2),
      duration: (rnd() * 3 + 2.5).toFixed(2),
      delay: (rnd() * 6).toFixed(2)
    }));
  }, []);

  return (
    <div className="sd-aurora" aria-hidden="true">
      <div className="sd-aurora__pulse" />
      <div className="sd-aurora__blob sd-aurora__blob--a" />
      <div className="sd-aurora__blob sd-aurora__blob--b" />
      <div className="sd-aurora__blob sd-aurora__blob--c" />
      <div className="sd-aurora__stars">
        {stars.map((s) => (
          <span
            key={s.id}
            className="sd-aurora__star"
            style={{
              left: s.left, top: s.top, width: s.size + 'px', height: s.size + 'px',
              animationDuration: s.duration + 's', animationDelay: s.delay + 's'
            }}
          />
        ))}
      </div>
      <style>{`
        .sd-aurora { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
        .sd-aurora__pulse {
          position: absolute; inset: 0; opacity: 0.55;
          background:
            radial-gradient(circle at 30% 20%, rgba(145, 132, 217, 0.22), transparent 60%),
            radial-gradient(circle at 75% 65%, rgba(4, 28, 18, 0.4), transparent 65%);
          animation: sdAuroraPulse 10s ease-in-out infinite;
        }
        .sd-aurora__blob { position: absolute; border-radius: 50%; filter: blur(95px); mix-blend-mode: screen; will-change: transform; }
        .sd-aurora__blob--a {
          top: -15%; left: -12%; width: 52vw; height: 52vw; max-width: 640px; max-height: 640px;
          background: rgba(145, 132, 217, 0.28); animation: sdAuroraDriftA 32s ease-in-out infinite;
        }
        .sd-aurora__blob--b {
          bottom: -20%; right: -12%; width: 48vw; height: 48vw; max-width: 600px; max-height: 600px;
          background: rgba(6, 38, 24, 0.35); animation: sdAuroraDriftB 40s ease-in-out infinite;
        }
        .sd-aurora__blob--c {
          top: 32%; left: 38%; width: 34vw; height: 34vw; max-width: 460px; max-height: 460px;
          background: rgba(76, 83, 151, 0.26); animation: sdAuroraDriftC 46s ease-in-out infinite;
        }
        .sd-aurora__stars { position: absolute; inset: 0; }
        .sd-aurora__star {
          position: absolute; border-radius: 50%; background: #e9e9ed;
          animation-name: sdAuroraTwinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite;
        }
        @keyframes sdAuroraPulse { 0%, 100% { opacity: 0.45; transform: scale(1); } 50% { opacity: 0.65; transform: scale(1.04); } }
        @keyframes sdAuroraDriftA { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(6vw, 4vh) scale(1.15); } }
        @keyframes sdAuroraDriftB { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-5vw, -6vh) scale(1.2); } }
        @keyframes sdAuroraDriftC { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-4vw, 5vh) rotate(180deg); } }
        @keyframes sdAuroraTwinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.85; } }
      `}</style>
    </div>
  );
}