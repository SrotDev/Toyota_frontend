import { api } from '../../../../utils/api';
// Dynamic import fallback not needed; charts are lightweight client components.
import { RadarChart } from '../../../../components/charts/RadarChart.tsx';
import LapStreamClient from '../../../../components/strategy/LapStreamClient';
import LiveLapSparkline from '../../../../components/strategy/LiveLapSparkline.tsx';
interface Props { params: { id: string } }
export default async function StrategyDashboardPage({ params }: Props) {
  const [pit, risk, next, feats, undercut, compStrat] = await Promise.all([
    api.pitWindow(params.id),
    api.risk(params.id),
    api.nextLaps(params.id, 5),
    api.features(params.id),
    api.undercut(params.id),
    api.competitorStrategy(params.id),
  ]);
  const weaknesses: number[] = feats?.features?.section_weaknesses || [];
  const radarData = weaknesses.map((v: number, i: number) => ({ metric: `S${i+1}`, value: v == null ? 0 : v }));
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Strategy Dashboard</h2>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
          <h3 className="text-sm font-semibold">Pit Window</h3>
          <p className="text-xs">{pit?.recommended_window ? `Lap ${pit.recommended_window.start_lap} - ${pit.recommended_window.end_lap}` : pit?.message}</p>
          <p className="text-[11px] text-neutral-400">Best Lap: {pit?.best_lap_time}</p>
        </div>
        <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
          <h3 className="text-sm font-semibold">Risk Metrics</h3>
          <ul className="text-[11px] space-y-1">
            {Object.entries(risk?.risk || {}).map(([k,v]) => <li key={k}>{k}: {v as any}</li>)}
          </ul>
        </div>
        <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
          <h3 className="text-sm font-semibold">Next Lap Predictions</h3>
          <ul className="text-[11px] space-y-1">
            {next?.predictions?.map((p:any) => <li key={p.lap_number}>Lap {p.lap_number}: {p.predicted_lap_time}s</li>)}
          </ul>
        </div>
        <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
          <h3 className="text-sm font-semibold">Undercut Threat</h3>
          <p className="text-xs">Pit Loss: {undercut?.undercut?.pit_time_loss}s</p>
          <p className="text-xs">Gain: {undercut?.undercut?.projected_gain_seconds}s</p>
          <p className="text-[11px] text-neutral-400">Fastest Competitor: {undercut?.undercut?.fastest_competitor}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
          <h3 className="text-sm font-semibold">Engineered Features</h3>
          <pre className="text-[10px] max-h-64 overflow-auto">{JSON.stringify(feats?.features, null, 2)}</pre>
        </div>
        <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
          <h3 className="text-sm font-semibold">Section Weakness Radar</h3>
          {radarData.length ? <RadarChart data={radarData} /> : <p className="text-[11px] text-neutral-400">No weakness data.</p>}
        </div>
      </div>
      <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
        <h3 className="text-sm font-semibold">Live Lap Stream</h3>
        <LapStreamClient trackId={params.id} />
        <div className="mt-2">
          <LiveLapSparkline trackId={params.id} />
        </div>
      </div>
      <div className="p-4 border border-neutral-800 rounded bg-neutral-900 space-y-2">
        <h3 className="text-sm font-semibold">Competitor Pit Strategy</h3>
        {compStrat?.competitors?.length ? (
          <table className="w-full text-[10px]">
            <thead>
              <tr className="text-neutral-400">
                <th className="text-left p-1">Driver</th>
                <th className="text-left p-1">Best</th>
                <th className="text-left p-1">DegIdx</th>
                <th className="text-left p-1">Window</th>
                <th className="text-left p-1">Penalty</th>
              </tr>
            </thead>
            <tbody>
              {compStrat.competitors.map((c:any) => (
                <tr key={c.driver_id} className="odd:bg-neutral-950 even:bg-neutral-900">
                  <td className="p-1">{c.driver_id || 'N/A'}</td>
                  <td className="p-1">{c.best_lap_time?.toFixed(2)}</td>
                  <td className="p-1">{c.current_degradation}</td>
                  <td className="p-1">{c.recommended_window ? `${c.recommended_window.start_lap}-${c.recommended_window.end_lap}` : '—'}</td>
                  <td className="p-1">{c.stay_out_penalty_estimate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-[11px] text-neutral-400">No competitor data.</p>}
      </div>
    </div>
  );
}
