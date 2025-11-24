import React, { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { api } from '../../services/api';
import { TelemetryComparison, Track } from '../../types';
import { ArrowLeftRight } from 'lucide-react';

const CompareTelemetry = ({ trackId }: { trackId: string }) => {
  const [comparison, setComparison] = useState<TelemetryComparison | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.telemetry.compare(trackId).then(setComparison);
  }, [trackId]);

  const merged = comparison?.ideal.map((point, idx) => ({
    timestamp: point.timestamp,
    idealSpeed: point.speed,
    userSpeed: comparison.user?.[idx]?.speed ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Compare telemetry</p>
          <h1 className="text-3xl font-bold font-['Orbitron']">User vs ideal • {track?.name}</h1>
          <p className="text-zinc-400 text-sm">Overlayed series built from /api/predict/telemetry-behavior and user uploads.</p>
        </div>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6">
        <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase mb-3">
          <ArrowLeftRight size={14} /> Speed overlay
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged}>
              <XAxis dataKey="timestamp" stroke="#8fb5ff" tickFormatter={(v) => `${Math.round(v / 1000)}s`} />
              <YAxis stroke="#8fb5ff" />
              <Tooltip contentStyle={{ background: '#0f182f', border: '1px solid #1f2a44', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="idealSpeed" stroke="#72E8FF" dot={false} name="Ideal" />
              <Line type="monotone" dataKey="userSpeed" stroke="#ff9f1c" dot={false} name="User" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-zinc-300 mt-3">{comparison?.summary}</p>
      </div>
    </div>
  );
};

export default CompareTelemetry;