import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { IdealBehavior, Track } from '../../types';
import { Flame } from 'lucide-react';

const TelemetryHeatmap = ({ trackId }: { trackId: string }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [behaviors, setBehaviors] = useState<IdealBehavior[]>([]);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    (api as any).idealBehavior.list(trackId).then(setBehaviors);
  }, [trackId]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Heatmap</p>
        <h1 className="text-3xl font-bold font-['Orbitron']">Mistake intensity • {track?.name}</h1>
        <p className="text-zinc-400 text-sm">Stub for /telemetry/heatmap using ideal behavior intensities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {behaviors.map((behavior) => (
          <div key={behavior.id} className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
              <Flame size={14} /> Turn {behavior.turnNumber}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {behavior.optimalRacingLineJson.map((point, idx) => (
                <div
                  key={idx}
                  className="h-2 rounded"
                  style={{ backgroundColor: `rgba(255, 99, 132, ${point.intensity})` }}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-400">Higher opacity = more deviation risk.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TelemetryHeatmap;