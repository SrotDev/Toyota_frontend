import { api } from '../../../../../utils/api';
import { LineChart } from '../../../../../components/charts/LineChart';
import { RadarChart } from '../../../../../components/charts/RadarChart';
interface Props { params: { id: string } }
export default async function IdealTelemetryPage({ params }: Props) {
  // Get raw telemetry points + ideal behaviors for aggregated metrics
  const [points, behaviors] = await Promise.all([
    api.idealTelemetry(params.id),
    api.idealBehaviors(params.id)
  ]);
  // For brake point trend use optimal_brake_point from behaviors
  const lineSeries = behaviors
    .filter((b: any) => b.optimal_brake_point != null)
    .map((b: any) => ({ x: b.turn_number, y: b.optimal_brake_point }));
  // Radar uses speed_mean from optimal_racing_line_json
  const radarData = behaviors.map((b: any) => ({ metric: `T${b.turn_number}`, value: b.optimal_racing_line_json?.speed_mean ?? 0 }));
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
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Sample Ideal Telemetry Points</h3>
        <pre className="text-[10px] max-h-48 overflow-auto bg-neutral-900 p-2 rounded border border-neutral-800">{JSON.stringify(points.slice(0,25), null, 1)}</pre>
      </div>
    </div>
  );
}
