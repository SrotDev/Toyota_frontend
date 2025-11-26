import { api } from '../../../../utils/api';
interface Props { params: { id: string } }
export default async function SectorsPage({ params }: Props) {
  const sectors = await api.sectors(params.id);
  // Group sectors by lap
  const grouped: Record<string, any[]> = {};
  sectors.forEach((s: any) => {
    const lap = s.lap || s.lap_id || 'unknown';
    grouped[lap] = grouped[lap] || [];
    grouped[lap].push(s);
  });
  const rows = Object.entries(grouped);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sectors</h2>
      <table className="w-full text-xs border border-neutral-800 rounded overflow-hidden">
        <thead className="bg-neutral-900">
          <tr>
            <th className="p-2 text-left">Lap</th>
            <th className="p-2 text-left">Sector</th>
            <th className="p-2 text-left">Time (s)</th>
            <th className="p-2 text-left">Relative</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([lap, secs]) => secs.map((s: any) => (
            <tr key={s.id} className="odd:bg-neutral-950 even:bg-neutral-900">
              <td className="p-2">{lap}</td>
              <td className="p-2">{s.sector_number}</td>
              <td className="p-2">{s.sector_time?.toFixed(3)}</td>
              <td className="p-2">{(s.sector_time / (secs[0]?.sector_time || 1) - 1).toFixed(2)}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}
