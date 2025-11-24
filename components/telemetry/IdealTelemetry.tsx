
import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { api } from '../../services/api';
import { IdealBehavior, TelemetryPoint, Track } from '../../types';
import { Target } from 'lucide-react';

const IdealTelemetry = ({ trackId }: { trackId: string }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [idealBehavior, setIdealBehavior] = useState<IdealBehavior[]>([]);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.telemetry.ideal(trackId).then(setTelemetry);
    api.idealBehavior.list(trackId).then(setIdealBehavior);
  }, [trackId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Ideal telemetry</p>
          <h1 className="text-3xl font-bold font-['Orbitron']">Ideal run • {track?.name}</h1>
          <p className="text-zinc-400 text-sm">Matches /api/tracks/{'{id}'}/telemetry/ideal endpoints with reduced rows.</p>
        </div>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Speed and inputs over time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={telemetry}>
              <XAxis dataKey="timestamp" stroke="#8fb5ff" tickFormatter={(v) => `${Math.round(v / 1000)}s`} />
              <YAxis stroke="#8fb5ff" />
              <Tooltip contentStyle={{ background: '#0f182f', border: '1px solid #1f2a44', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#72E8FF" dot={false} name="Speed" />
              <Line type="monotone" dataKey="throttle" stroke="#22c55e" dot={false} name="Throttle" />
              <Line type="monotone" dataKey="brake" stroke="#ef4444" dot={false} name="Brake" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {idealBehavior.map((behavior) => (
          <div key={behavior.id} className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
              <Target size={14} /> Turn {behavior.turnNumber}
            </div>
            <p className="text-sm text-zinc-300">Brake point: {behavior.optimalBrakePoint} m</p>
            <p className="text-xs text-zinc-400">Throttle curve: {behavior.optimalThrottleCurve.join(', ')}</p>
            <p className="text-xs text-zinc-400">Steering curve: {behavior.optimalSteeringCurve.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdealTelemetry;