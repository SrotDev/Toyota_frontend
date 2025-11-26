import { api } from '../../../../utils/api';
interface Props { params: { id: string } }
export default async function RacingLinePage({ params }: Props) {
  const points = await api.idealRacingLine(params.id);
  if (!points?.length) {
    return <p className="text-sm">No racing line data available.</p>;
  }
  // Normalize coordinates to viewport
  const xs = points.map((p: any) => p.x ?? p.longitude ?? p[0]);
  const ys = points.map((p: any) => p.y ?? p.latitude ?? p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const norm = points.map((p: any) => {
    const x = p.x ?? p.longitude ?? p[0];
    const y = p.y ?? p.latitude ?? p[1];
    return {
      x: ((x - minX) / (maxX - minX)) * 100,
      y: ((y - minY) / (maxY - minY)) * 100,
      speed: p.speed ?? p.v ?? p.s ?? 0
    };
  });
  const d = norm.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Racing Line (Ideal)</h2>
      <div className="relative w-full max-w-3xl aspect-[3/2] bg-neutral-900 rounded border border-neutral-800">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="speedGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path d={d} fill="none" stroke="url(#speedGradient)" strokeWidth={0.6} strokeLinejoin="round" strokeLinecap="round" />
          {norm.map((p, i) => i % Math.ceil(norm.length / 12) === 0 && (
            <circle key={i} cx={p.x} cy={p.y} r={0.8} fill="#fff" />
          ))}
        </svg>
      </div>
      <p className="text-xs text-neutral-400">Line gradient indicates relative speed (green fast → red slow). Sample markers every ~{Math.ceil(norm.length / 12)} points.</p>
    </div>
  );
}
