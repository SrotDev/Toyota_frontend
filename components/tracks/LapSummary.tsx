
import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { Lap, LapPredictionRequest, PredictionResult, Track } from '../../types';
import { Calculator, TrendingDown } from 'lucide-react';

const LapSummary = ({ trackId }: { trackId: string }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [form, setForm] = useState<LapPredictionRequest>({ trackId, driverCategory: 'PRO', averageSpeed: 180, mistakes: 0 });

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.laps.list(trackId).then(setLaps);
  }, [trackId]);

  const summary = useMemo(() => {
    if (!laps.length) return null;
    const best = laps.reduce((acc, lap) => (lap.lapTime < acc.lapTime ? lap : acc), laps[0]);
    const average = laps.reduce((sum, lap) => sum + lap.lapTime, 0) / laps.length;
    return { best, average };
  }, [laps]);

  const handlePredict = async () => {
    const result = await api.predictions.lapTime(form);
    setPrediction(result);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Lap Table</p>
          <h1 className="text-3xl font-bold font-['Orbitron']">Laps for {track?.name}</h1>
          <p className="text-zinc-400 text-sm">Pulled from Lap model with reduced telemetry rows per lap.</p>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4">
            <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Best lap</p>
            <p className="text-3xl font-mono font-bold text-[#72E8FF]">{summary.best.lapTime.toFixed(3)}s</p>
            <p className="text-sm text-zinc-400">Category {summary.best.driverCategory}</p>
          </div>
          <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4">
            <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Average lap</p>
            <p className="text-3xl font-mono font-bold">{summary.average.toFixed(3)}s</p>
            <p className="text-sm text-zinc-400">Across {laps.length} laps</p>
          </div>
          <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4">
            <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Mistakes logged</p>
            <p className="text-3xl font-bold">{laps.reduce((sum, lap) => sum + lap.mistakes, 0)}</p>
            <p className="text-sm text-zinc-400">Flags per lap record</p>
          </div>
        </div>
      )}

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#0f182f] text-[#8fb5ff] uppercase text-[11px]">
            <tr>
              <th className="px-4 py-2 text-left">Lap</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Lap time</th>
              <th className="px-4 py-2 text-left">Avg speed</th>
              <th className="px-4 py-2 text-left">Max speed</th>
              <th className="px-4 py-2 text-left">Mistakes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2a44]">
            {laps.map((lap) => (
              <tr key={lap.id} className="hover:bg-[#0f182f]">
                <td className="px-4 py-2 font-mono">{lap.lapNumber}</td>
                <td className="px-4 py-2">{lap.driverCategory}</td>
                <td className="px-4 py-2 font-mono">{lap.lapTime.toFixed(3)}s</td>
                <td className="px-4 py-2 font-mono">{Math.round(lap.avgSpeed)} km/h</td>
                <td className="px-4 py-2 font-mono">{Math.round(lap.maxSpeed)} km/h</td>
                <td className="px-4 py-2">{lap.mistakes || 'Clean'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
          <Calculator size={14} /> Predict lap time
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <label className="space-y-1">
            <span className="text-zinc-400">Driver category</span>
            <select
              value={form.driverCategory}
              onChange={(e) => setForm({ ...form, driverCategory: e.target.value as LapPredictionRequest['driverCategory'] })}
              className="w-full bg-[#0f182f] border border-[#1f2a44] rounded-lg px-3 py-2"
            >
              <option value="PRO">PRO</option>
              <option value="AM">AM</option>
              <option value="ROOKIE">ROOKIE</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-zinc-400">Average speed (km/h)</span>
            <input
              type="number"
              value={form.averageSpeed}
              onChange={(e) => setForm({ ...form, averageSpeed: Number(e.target.value) })}
              className="w-full bg-[#0f182f] border border-[#1f2a44] rounded-lg px-3 py-2"
            />
          </label>
          <label className="space-y-1">
            <span className="text-zinc-400">Mistakes</span>
            <input
              type="number"
              value={form.mistakes}
              onChange={(e) => setForm({ ...form, mistakes: Number(e.target.value) })}
              className="w-full bg-[#0f182f] border border-[#1f2a44] rounded-lg px-3 py-2"
            />
          </label>
          <div className="flex items-end">
            <button
              onClick={handlePredict}
              className="w-full bg-[#72E8FF] text-black font-bold px-3 py-2 rounded-lg hover:bg-[#9ff0ff] transition-colors"
            >
              Predict
            </button>
          </div>
        </div>
        {prediction && (
          <div className="bg-[#0f182f] border border-[#1f2a44] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Predicted lap</p>
              <p className="text-3xl font-mono font-bold text-[#72E8FF]">{prediction.predictedLapTime.toFixed(3)}s</p>
              <p className="text-sm text-zinc-400">Confidence {Math.round(prediction.confidence * 100)}%</p>
            </div>
            <div className="text-right text-sm text-zinc-300">
              <p className="flex items-center gap-2 justify-end"><TrendingDown size={14} /> Limiter: {prediction.limitingFactor}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LapSummary;
