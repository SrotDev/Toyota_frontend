import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { Lap, Track } from '../../types';
import { Activity, MapPin, Timer, Database } from 'lucide-react';

const TrackDetail = ({ trackId, navigate }: { trackId: string; navigate: (p: string) => void }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.laps.list(trackId).then(setLaps);
  }, [trackId]);

  const bestLap = useMemo(
    () => (laps.length ? laps.reduce((best, lap) => (lap.lapTime < best.lapTime ? lap : best), laps[0]) : undefined),
    [laps],
  );
  const avgLap = useMemo(() => (laps.length ? laps.reduce((sum, lap) => sum + lap.lapTime, 0) / laps.length : 0), [laps]);

  if (!track) return <div className="text-zinc-300">Loading track…</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button className="text-xs text-[#72E8FF] hover:underline" onClick={() => navigate('/tracks')}>
            ← Back to tracks
          </button>
          <h1 className="text-4xl font-bold font-['Orbitron']">{track.name}</h1>
          <p className="text-zinc-400 flex items-center gap-2">
            <MapPin size={14} /> {track.location} • {track.lengthKm} km • {track.turns} turns
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-[#72E8FF] text-black font-bold"
            onClick={() => navigate(`/tracks/${trackId}/telemetry/ideal`)}
          >
            Telemetry
          </button>
          <button
            className="px-4 py-2 rounded-lg border border-[#1f2a44] text-white hover:border-[#72E8FF]"
            onClick={() => navigate(`/tracks/${trackId}/laps`)}
          >
            Lap summary
          </button>
          <button
            className="px-4 py-2 rounded-lg border border-[#1f2a44] text-white hover:border-[#72E8FF]"
            onClick={() => navigate(`/tracks/${trackId}/sectors`)}
          >
            Sector radar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 relative">
          <img src={track.mapImage} alt={track.name} className="w-full h-72 object-contain filter invert opacity-80" />
          <div className="absolute top-4 left-4 bg-[#0f182f]/80 border border-[#1f2a44] rounded-lg px-3 py-2 text-xs text-[#8fb5ff]">
            Track map from Track model
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4">
            <p className="text-xs text-[#8fb5ff] uppercase font-semibold flex items-center gap-2"><Timer size={14} /> Best lap</p>
            <p className="text-3xl font-mono font-bold text-[#72E8FF]">{bestLap?.lapTime.toFixed(3)}s</p>
            <p className="text-sm text-zinc-400">Driver category: {bestLap?.driverCategory}</p>
          </div>
          <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4">
            <p className="text-xs text-[#8fb5ff] uppercase font-semibold flex items-center gap-2"><Activity size={14} /> Avg lap</p>
            <p className="text-3xl font-mono font-bold">{avgLap.toFixed(3)}s</p>
            <p className="text-sm text-zinc-400">Computed from Lap table</p>
          </div>
          <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4">
            <p className="text-xs text-[#8fb5ff] uppercase font-semibold flex items-center gap-2"><Database size={14} /> Laps stored</p>
            <p className="text-3xl font-bold">{laps.length}</p>
            <p className="text-sm text-zinc-400">Reduced telemetry rows downstream</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1f2a44] flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent laps</h3>
          <button className="text-xs text-[#72E8FF]" onClick={() => navigate(`/tracks/${trackId}/laps`)}>
            View lap table
          </button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#0f182f] text-[#8fb5ff] uppercase text-[11px]">
            <tr>
              <th className="px-4 py-2 text-left">Lap</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Lap time</th>
              <th className="px-4 py-2 text-left">Avg speed</th>
              <th className="px-4 py-2 text-left">Mistakes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2a44]">
            {laps.slice(0, 6).map((lap) => (
              <tr key={lap.id} className="hover:bg-[#0f182f]">
                <td className="px-4 py-2 font-mono">{lap.lapNumber}</td>
                <td className="px-4 py-2">{lap.driverCategory}</td>
                <td className="px-4 py-2 font-mono">{lap.lapTime.toFixed(3)}s</td>
                <td className="px-4 py-2 font-mono">{Math.round(lap.avgSpeed)} km/h</td>
                <td className="px-4 py-2">{lap.mistakes || 'Clean'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackDetail;