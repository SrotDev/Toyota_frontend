import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IdealBehavior, Track } from '../../types';
import { Route } from 'lucide-react';

const RacingLineOverlay = ({ trackId }: { trackId: string }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [behaviors, setBehaviors] = useState<IdealBehavior[]>([]);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.idealBehavior.list(trackId).then(setBehaviors);
  }, [trackId]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Racing line</p>
        <h1 className="text-3xl font-bold font-['Orbitron']">Overlay • {track?.name}</h1>
        <p className="text-zinc-400 text-sm">Placeholder for /telemetry/racing-line route using ideal racing line JSON.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 flex flex-col items-center">
          {track && <img src={track.mapImage} alt={track.name} className="w-full h-72 object-contain filter invert opacity-80" />}
          <p className="text-xs text-zinc-400 mt-2">{`Map image fetched from /api/tracks/${track?.id}/map`}</p>
        </div>
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Route size={16} className="text-[#72E8FF]" /> Ideal line coords</h3>
          <div className="space-y-2">
            {behaviors.map((behavior) => (
              <div key={behavior.id} className="border border-[#1f2a44] rounded-lg p-3">
                <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Turn {behavior.turnNumber}</p>
                <p className="text-[11px] text-zinc-400">{behavior.optimalRacingLineJson.length} points</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacingLineOverlay;
