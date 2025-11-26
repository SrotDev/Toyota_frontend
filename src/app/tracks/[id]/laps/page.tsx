import { api } from '../../../../utils/api';
interface Props { params: { id: string } }
export default async function LapsPage({ params }: Props) {
  const data = await api.laps(params.id);
  const best = Math.min(...data.map((l: any) => l.lap_time || Infinity));
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Laps</h2>
      <table className="w-full text-xs border border-neutral-800 rounded overflow-hidden">
        <thead className="bg-neutral-900">
          <tr>
            <th className="p-2 text-left">Lap</th>
            <th className="p-2 text-left">Time (ms)</th>
            <th className="p-2 text-left">Delta Best</th>
          </tr>
        </thead>
        <tbody>
          {data.map((l: any) => (
            <tr key={l.id} className="odd:bg-neutral-950 even:bg-neutral-900">
              <td className="p-2">{l.lap_number}</td>
              <td className="p-2">{l.lap_time}</td>
              <td className="p-2">{((l.lap_time || best) - best).toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
