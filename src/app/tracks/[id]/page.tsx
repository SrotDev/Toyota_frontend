import { api } from '../../../utils/api.ts';

// Ensure the 'next/link' module is installed and properly typed.
import Link from 'next/link';

interface Props { params: { id: string } }

export default async function TrackOverview({ params }: Props) {
  const { id } = params;
  const [laps, sectors, pit, risk, nextLaps, liveState, advancedPrediction] = await Promise.all([
    api.laps(id),
    api.sectors(id),
    api.pitWindow(id),
    api.risk(id),
    api.nextLaps(id),
    api.liveState(id),
    api.advancedMLPrediction('xgboost', { track_id: id })
  ]);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Track Overview</h2>
        <div className="flex gap-3 text-sm">
          <Link href={`/tracks/${id}/laps`}>Laps</Link>
          <Link href={`/tracks/${id}/sectors`}>Sectors</Link>
          <Link href={`/tracks/${id}/telemetry/ideal`}>Ideal</Link>
          <Link href={`/tracks/${id}/telemetry/compare`}>Compare</Link>
          <Link href={`/tracks/${id}/telemetry/racing-line`}>Racing Line</Link>
        </div>
      </div>
      <section>
        <h3 className="font-semibold mb-2">Pit Window Recommendation</h3>
        <div className="text-xs bg-neutral-900 p-3 rounded border border-neutral-800 space-y-2">
          <div>Recommended: Lap {pit?.recommended_window?.start_lap}–{pit?.recommended_window?.end_lap}</div>
          <div>Urgency: <span className={pit.urgency==='high'?'text-red-400':pit.urgency==='medium'?'text-yellow-400':'text-green-400'}>{pit.urgency}</span></div>
          {pit.reasons?.length && (
            <ul className="list-disc ml-4">
              {pit.reasons.map((r:string)=> <li key={r}>{r}</li>)}
            </ul>
          )}
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-2">Risk Metrics</h3>
        <div className="text-xs bg-neutral-900 p-3 rounded border border-neutral-800 grid grid-cols-2 gap-2">
          {Object.entries(risk.risk||{}).map(([k,v])=> (
            <div key={k} className="flex justify-between"><span>{k}</span><span>{v as any}</span></div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-2">Next Lap Predictions (with 95% CI)</h3>
        <ul className="text-xs space-y-1">
          {nextLaps.predictions.map((p: any) => (
            <li key={p.lap_number}>Lap {p.lap_number}: {p.predicted_lap_time}s (CI {p.lower_ci}–{p.upper_ci})</li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="font-semibold mb-2">Live Race State</h3>
        <div className="text-xs bg-neutral-900 p-3 rounded border border-neutral-800 space-y-2">
          <div className="grid grid-cols-5 font-semibold">
            <span>P</span><span>Driver</span><span>Lap</span><span>Deg</span><span>Traffic</span>
          </div>
          {liveState.drivers?.map((d:any)=>(
            <div key={d.driver_id} className="grid grid-cols-5">
              <span>{d.position}</span>
              <span className="truncate" title={d.driver_id}>{d.driver_id.slice(0,6)}</span>
              <span>{d.lap_number}</span>
              <span>{d.degradation_index}</span>
              <span>{d.traffic_nearby}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="font-semibold mb-2">Advanced ML Prediction</h3>
        <div className="text-xs bg-neutral-900 p-3 rounded border border-neutral-800">
          <div>Model: {advancedPrediction.model}</div>
          <div>Prediction: {advancedPrediction.prediction}</div>
        </div>
      </section>
    </div>
  );
}
