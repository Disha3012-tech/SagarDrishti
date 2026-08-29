import { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import OpsPage from './pages/OpsPage';
import RoutesPage from './pages/RoutesPage';
import BergsPage from './pages/BergsPage';
import ForecastPage from './pages/ForecastPage';
import FeedsPage from './pages/FeedsPage';
import { createMockData } from './data/mockData';

const DEFAULT_LAYERS = {
  ice: true, thickness: false, bergs: true, vessels: true,
  currents: true, wind: false, bathy: false, route: true
};

export default function App() {
  const data = useMemo(() => createMockData(20260829), []);

  const [view, setView] = useState('landing');
  const [sel, setSel] = useState(null);
  const [layers, setLayers] = useState(DEFAULT_LAYERS);

  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [iceClass, setIceClass] = useState('PC5');
  const [priority, setPriority] = useState(50);
  const [routeGen, setRouteGen] = useState(0);

  const [region, setRegion] = useState('Prydz Bay');
  const [model, setModel] = useState('ensemble');

  const navigate = (key) => { setView(key); setSel(null); };
  const toggleLayer = (key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const setTManual = (value) => { setT(value); setPlaying(false); };
  const togglePlay = () => setPlaying((p) => {
    if (!p && t >= 72) setT(0);
    return !p;
  });

  // Drives the playhead forward (~4.2 simulated hours per real second)
  // while `playing` is true; replaces the original tick()/rAF loop.
  const lastFrameRef = useRef(null);
  useEffect(() => {
    if (!playing) { lastFrameRef.current = null; return undefined; }
    let raf;
    const step = (now) => {
      if (lastFrameRef.current == null) lastFrameRef.current = now;
      const dt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      setT((prev) => {
        const next = prev + dt * 4.2;
        if (next >= 72) { setPlaying(false); return 72; }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  return (
    <div className="sd-app">
      <Header view={view} onNavigate={navigate} syncAgo={3} />

      {view === 'landing' && (
        <LandingPage data={data} onGoOps={() => navigate('ops')} onGoForecast={() => navigate('forecast')} />
      )}
      {view === 'ops' && (
        <OpsPage
          data={data} t={t} playing={playing} layers={layers} sel={sel}
          onSetT={setTManual} onTogglePlay={togglePlay} onToggleLayer={toggleLayer} onSelect={setSel}
        />
      )}
      {view === 'routes' && (
        <RoutesPage
          data={data} iceClass={iceClass} priority={priority} routeGen={routeGen}
          onSetIceClass={setIceClass} onSetPriority={setPriority}
          onResolve={() => setRouteGen((g) => g + 1)}
        />
      )}
      {view === 'bergs' && <BergsPage data={data} sel={sel} onSelect={setSel} />}
      {view === 'forecast' && (
        <ForecastPage region={region} model={model} onSetRegion={setRegion} onSetModel={setModel} />
      )}
      {view === 'feeds' && <FeedsPage />}

      <style>{`
        .sd-app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
      `}</style>
    </div>
  );
}
