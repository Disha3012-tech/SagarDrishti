import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useAnimationLoop';

// Attach `ref={containerRef}` to a wrapper; every direct/descendant element
// inside it carrying `data-reveal` will fade + rise into place, staggered,
// the first time it scrolls into view. Mirrors the original `enhance()`
// IntersectionObserver pass, minus the counter animation (see StatBand).
export default function useRevealOnScroll(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const reduced = prefersReducedMotion();
    const items = root.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (reduced) {
      items.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.transition = 'opacity 620ms ease-out, transform 620ms cubic-bezier(0.2,0.8,0.2,1)';
        el.style.transitionDelay = (i * 95) + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'none';
        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      io.observe(el);
    });

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
