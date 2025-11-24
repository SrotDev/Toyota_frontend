import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, MapPin, Trophy } from 'lucide-react';
import { api } from '../../services/api';
import { LeaderboardEntry, Track } from '../../types';

const HomePage = ({ navigate }: { navigate: (p: string) => void }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.tracks.list().then(setTracks);
    api.leaderboard.lap().then(setLeaders);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative rounded-2xl overflow-hidden border border-[#1f2a44] bg-gradient-to-r from-[#0b1224] via-[#0b152c] to-[#112345]">
        <div className="p-8 md:p-12 space-y-4 max-w-3xl">
          <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Telemetry to training loop</p>
          <h1 className="text-4xl md:text-5xl font-bold font-['Orbitron'] leading-tight">Track n Race telemetry cockpit</h1>
          <p className="text-zinc-300 text-base md:text-lg">
            Frontend rebuilt around the Django model plan: tracks, laps, sectors, telemetry points, and ideal behaviors. Compare runs, review turn-by-turn data, and keep only the components required for Track n Race.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="bg-[#72E8FF] text-black font-bold px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-[#9ff0ff] transition-colors"
            >
              Upload telemetry <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/tracks')}
              className="border border-[#1f2a44] text-white px-5 py-3 rounded-lg hover:border-[#72E8FF] hover:text-[#72E8FF] transition-colors"
            >
              Browse tracks
            </button>
          </div>
        </div>
        <div className="absolute right-6 bottom-6 text-xs text-[#9fb7ff] bg-[#0b1224]/70 px-3 py-2 rounded border border-[#1f2a44] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Synced to REST endpoints spec
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
            <Activity size={14} /> Endpoints wired
          </div>
          <p className="text-3xl font-bold">{tracks.length}</p>
          <p className="text-sm text-zinc-400">Tracks ready for summaries, maps, laps, sectors, and telemetry</p>
        </div>
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
            <MapPin size={14} /> Ideal data
          </div>
          <p className="text-3xl font-bold">3 turns</p>
          <p className="text-sm text-zinc-400">Per-track ideal behaviors seeded for turns 4, 11, and 16</p>
        </div>
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
            <Trophy size={14} /> Leaderboard
          </div>
          <p className="text-3xl font-bold">Live mock</p>
          <p className="text-sm text-zinc-400">Lap leaderboard derived from stored laps per track</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold font-['Orbitron'] text-white">Tracks</h2>
            <button onClick={() => navigate('/tracks')} className="text-xs text-[#72E8FF] font-semibold hover:underline">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tracks.slice(0, 3).map((track) => (
              <div
                key={track.id}
                className="border border-[#1f2a44] rounded-xl overflow-hidden hover:border-[#72E8FF] transition-colors cursor-pointer"
                onClick={() => navigate(`/tracks/${track.id}`)}
              >
                <div className="h-36 bg-[#0f182f] flex items-center justify-center p-4">
                  <img src={track.mapImage} alt={track.name} className="h-full w-auto object-contain filter invert opacity-80" />
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-[#8fb5ff] uppercase font-semibold">{track.lengthKm} km • {track.turns} turns</p>
                  <h3 className="text-lg font-bold">{track.name}</h3>
                  <p className="text-sm text-zinc-400">{track.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold font-['Orbitron'] text-white">Leaderboard preview</h2>
          <div className="space-y-3">
            {leaders.map((entry) => (
              <div key={entry.trackId} className="flex items-center justify-between bg-[#0f182f] px-3 py-2 rounded-lg border border-[#1f2a44]">
                <div>
                  <p className="text-sm font-semibold">{tracks.find((t) => t.id === entry.trackId)?.name}</p>
                  <p className="text-xs text-zinc-400">{entry.driver} • {entry.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-bold text-[#72E8FF]">{entry.bestLap.toFixed(3)}s</p>
                  <p className="text-[11px] text-zinc-500">best lap</p>

  </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-['Orbitron']">Frontend map</h3>
          <ul className="text-sm text-zinc-300 list-disc ml-5 space-y-2">
            <li>Tracks: listing, detail map, laps, sectors, and telemetry navigation.</li>
            <li>Telemetry: ideal curves, comparison overlays, heatmap and racing line stubs.</li>
            <li>Uploads: file capture, async status, and result surfaces with coaching.</li>
            <li>Predictions: lap time calculator aligned to backend prediction endpoints.</li>
          </ul>
        </div>
        <div className="space-y-2 text-sm text-zinc-300">
          <h4 className="text-[#72E8FF] font-semibold uppercase text-xs">REST endpoints mirrored</h4>
          <div className="grid grid-cols-1 gap-2">
            {['/api/tracks/{id}/details', '/api/tracks/{id}/laps', '/api/tracks/{id}/sectors', '/api/tracks/{id}/telemetry/ideal', '/api/upload-telemetry/{session_id}/results'].map((endpoint) => (
              <div key={endpoint} className="bg-[#0f182f] border border-[#1f2a44] rounded-lg px-3 py-2 font-mono text-xs text-zinc-200">{endpoint}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
