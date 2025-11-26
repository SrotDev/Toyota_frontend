import { api } from '../../../../utils/api';
import { LineChart } from '../../../../components/charts/LineChart';
import { RadarChart } from '../../../../components/charts/RadarChart';

interface Props { params: { id: string } }
export default async function IdealTelemetryPage({ params }: Props) {
  const data = await api.idealTelemetry(params.id);
  const sectors = data?.ideal_behaviors || data?.sectors || [];
  // Build line series (turn vs optimal_brake_point as proxy) & radar (speed mean if present)
  const lineSeries = sectors
    .filter((s: any) => s.optimal_brake_point != null)
    .map((s: any) => ({ x: s.turn_number || s.sector_number, y: s.optimal_brake_point }));
  const radarData = sectors
    .map((s: any) => ({ metric: `T${s.turn_number || s.sector_number}`, value: (s.optimal_racing_line_json?.speed_mean ?? s.speed_mean ?? 0) }));
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Ideal Telemetry Curves</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Brake Point Trend</h3>
          {lineSeries.length ? <LineChart data={lineSeries} /> : <p className="text-xs text-neutral-400">No brake point data.</p>}
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Speed Mean Radar</h3>
          {radarData.length ? <RadarChart data={radarData} /> : <p className="text-xs text-neutral-400">No speed mean data.</p>}
        </div>
      </div>
    </div>
  );
}
