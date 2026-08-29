import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useAnimationLoop';

function Counter({ target, decimals }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) { setValue(target); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now(), dur = 1500;
        const step = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(target * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return <span ref={ref} className="sd-stat__value">{value.toFixed(decimals)}</span>;
}

export default function StatBand({ stats }) {
  return (
    <section className="sd-statband">
      {stats.map((s) => (
        <div key={s.label} className="sd-statband__cell">
          <div className="sd-statband__label"><i className="sd-statband__dot" />{s.label}</div>
          <div className="sd-statband__row">
            <Counter target={s.value} decimals={s.decimals} />
            <span className="sd-statband__unit">{s.unit}</span>
          </div>
          <div className="sd-statband__note">{s.note}</div>
        </div>
      ))}
      <style>{`
        .sd-statband {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          border-bottom: 1px solid var(--color-divider);
          background: linear-gradient(180deg, #1e2242, #262a60);
        }
        .sd-statband__cell {
          padding: var(--space-8) var(--space-6);
          border-right: 1px solid rgba(233,233,237,0.10);
        }
        .sd-statband__label {
          display: flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.13em;
          text-transform: uppercase; color: rgba(233,233,237,0.62);
        }
        .sd-statband__dot {
          width: 5px; height: 5px; border-radius: 50%; background: #6fcf97;
          animation: dcPulse 2.2s ease-in-out infinite;
        }
        .sd-statband__row { margin-top: var(--space-3); display: flex; align-items: baseline; gap: 6px; }
        .sd-stat__value {
          font-family: var(--font-mono); font-size: 38px; font-weight: 500;
          letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
        }
        .sd-statband__unit { font-size: 13px; color: rgba(233,233,237,0.6); }
        .sd-statband__note { margin-top: 4px; font-size: 12px; color: rgba(233,233,237,0.52); }
      `}</style>
    </section>
  );
}
