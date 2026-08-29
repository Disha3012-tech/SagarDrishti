import { useEffect, useRef } from 'react';

// Runs `callback(nowMs, clockSeconds)` on every animation frame until the
// component unmounts. `callback` is read from a ref each frame, so passing
// a fresh inline function every render never restarts or leaks the loop.
export default function useAnimationLoop(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    if (startRef.current === null) startRef.current = performance.now();

    function tick(now) {
      if (!mounted) return;
      const clock = (now - startRef.current) / 1000;
      callbackRef.current(now, clock);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
