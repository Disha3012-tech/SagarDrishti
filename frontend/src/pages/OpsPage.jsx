import PolarCanvas from '../components/PolarCanvas';
import LayerPanel from '../components/LayerPanel';
import IceLegend from '../components/IceLegend';
import AlertPanel from '../components/AlertPanel';
import SelectionPanel from '../components/SelectionPanel';
import TimelineBar from '../components/TimelineBar';
import { alerts, fmtPos } from '../data/mockData';

function buildSelection(sel, data) {
  if (!sel) return null;
  if (sel.type === 'berg') {
    const b = data.bergs.find((x) => x.id === sel.id);
    if (!b) return null;
    return {
      kind: 'Iceberg', name: b.id,
      fields: [
        { k: 'Position', v: fmtPos(b.lon, b.lat) }, { k: 'Sector', v: b.sector },
        { k: 'Area', v: b.area.toLocaleString() + ' km²' }, { k: 'Draft', v: b.thick + ' m' },
        { k: 'Drift', v: b.spd.toFixed(2) + ' kt / ' + Math.round(b.brg) + '°' }, { k: 'Confidence', v: b.conf.toFixed(2) }
      ],
      provenance: 'Sentinel-1 EW GRDM, last fix ' + b.fix + ' min ago · drift model NCPOR-BD v2 (persistence + INCOIS surface current) · cone = 90% of 14-member spread'
    };
  }
  const v = data.vessels.find((x) => x.name === sel.id);
  if (!v) return null;
  return {
    kind: 'Vessel', name: v.name,
    fields: [
      { k: 'Position', v: fmtPos(v.lon, v.lat) }, { k: 'Ice class', v: v.cls },
      { k: 'SOG', v: v.sog.toFixed(1) + ' kt' }, { k: 'Heading', v: v.hdg + '°' },
      { k: 'Complement', v: String(v.crew) }, { k: 'Ice ahead', v: Math.round(38 + v.sog * 3) + '%' }
    ],
    provenance: 'AIS via Inmarsat-C, last report 4 min ago · route R-01 loaded, next waypoint in 3 h 12 m'
  };
}

export default function OpsPage({ data, t, playing, layers, sel, onSetT, onTogglePlay, onToggleLayer, onSelect }) {
  const stamp = new Date(Date.UTC(2026, 7, 29, 7, 42) + t * 3600 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  const tStamp = pad(stamp.getUTCDate()) + ' ' + pad(stamp.getUTCHours()) + ':' + pad(stamp.getUTCMinutes()) + 'Z';
  const tConfidence = (0.92 - t * 0.0035).toFixed(2);
  const selection = buildSelection(sel, data);

  return (
    <main className="sd-ops">
      <PolarCanvas mode="ops" data={data} layers={layers} t={t} selected={sel} onSelect={onSelect} />
      <LayerPanel layers={layers} onToggle={onToggleLayer} />
      <IceLegend />
      <AlertPanel alerts={alerts} />
      <SelectionPanel sel={selection} onClear={() => onSelect(null)} position="ops" />
      <TimelineBar t={t} playing={playing} onSetT={onSetT} onTogglePlay={onTogglePlay} stamp={tStamp} confidence={tConfidence} />
      <style>{`
        .sd-ops {
          flex: 1; min-height: 0; position: relative;
          animation: dcZoom 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
      `}</style>
    </main>
  );
}
