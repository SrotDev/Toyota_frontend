
import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { api } from '../../services/api';
import { TelemetryPoint, Track } from '../../types';
import { CornerUpRight } from 'lucide-react';

const TurnTelemetry = ({ trackId, turnId }: { trackId: string; turnId: string }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [series, setSeries] = useState<TelemetryPoint[]>([]);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.telemetry.idealTurn(trackId, Number(turnId)).then(setSeries);
  }, [trackId, turnId]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Turn telemetry</p>
        <h1 className="text-3xl font-bold font-['Orbitron']">Turn {turnId} • {track?.name}</h1>
        <p className="text-zinc-400 text-sm">Single turn data from /telemetry/ideal/{'{turn_number}'}</p>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6">
        <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase mb-3">
          <CornerUpRight size={14} /> Apex profile
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <XAxis dataKey="timestamp" stroke="#8fb5ff" tickFormatter={(v) => `${Math.round(v / 1000)}s`} />
              <YAxis stroke="#8fb5ff" />
              <Tooltip contentStyle={{ background: '#0f182f', border: '1px solid #1f2a44', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#72E8FF" dot={false} name="Speed" />
              <Line type="monotone" dataKey="steering" stroke="#ff9f1c" dot={false} name="Steering" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TurnTelemetry;