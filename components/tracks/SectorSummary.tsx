import React, { useEffect, useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RadarTooltip } from 'recharts';
import { api } from '../../services/api';
import { Sector, Track } from '../../types';
import { Compass } from 'lucide-react';

const SectorSummary = ({ trackId }: { trackId: string }) => {
  const [track, setTrack] = useState<Track | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);

  useEffect(() => {
    api.tracks.details(trackId).then((t) => setTrack(t || null));
    api.sectors.list(trackId).then(setSectors);
  }, [trackId]);

  const aggregated = useMemo(() => {
    const bySector = sectors.reduce<Record<number, Sector[]>>((acc, sector) => {
      acc[sector.sectorNumber] = acc[sector.sectorNumber] || [];
      acc[sector.sectorNumber].push(sector);
      return acc;
    }, {});
    return Object.keys(bySector).map((key) => {
      const list = bySector[Number(key)];
      const averageTime = list.reduce((sum, s) => sum + s.sectorTime, 0) / list.length;
      const entry = list.reduce((sum, s) => sum + s.entrySpeed, 0) / list.length;
      const exit = list.reduce((sum, s) => sum + s.exitSpeed, 0) / list.length;
      return { sector: `S${key}`, averageTime, entry, exit, steering: list.reduce((sum, s) => sum + s.avgSteeringAngle, 0) / list.length };
    });
  }, [sectors]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Sector Radar</p>
          <h1 className="text-3xl font-bold font-['Orbitron']">Sectors for {track?.name}</h1>
          <p className="text-zinc-400 text-sm">Aggregated Sector model rows visualized against speed and steering.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Compass size={16} className="text-[#72E8FF]" /> Entry vs Exit speeds</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={aggregated} outerRadius="70%">
                <PolarGrid stroke="#1f2a44" />
                <PolarAngleAxis dataKey="sector" stroke="#8fb5ff" tick={{ fill: '#8fb5ff', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} stroke="#1f2a44" tick={{ fill: '#8fb5ff', fontSize: 10 }} />
                <Radar name="Entry" dataKey="entry" stroke="#72E8FF" fill="#72E8FF" fillOpacity={0.4} />
                <Radar name="Exit" dataKey="exit" stroke="#ff9f1c" fill="#ff9f1c" fillOpacity={0.2} />
                <RadarTooltip contentStyle={{ background: '#0f182f', border: '1px solid #1f2a44', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Sector table</h3>
          <table className="w-full text-sm">
            <thead className="bg-[#0f182f] text-[#8fb5ff] uppercase text-[11px]">
              <tr>
                <th className="px-3 py-2 text-left">Sector</th>
                <th className="px-3 py-2 text-left">Avg time</th>
                <th className="px-3 py-2 text-left">Entry</th>
                <th className="px-3 py-2 text-left">Exit</th>
                <th className="px-3 py-2 text-left">Steering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2a44]">
              {aggregated.map((row) => (
                <tr key={row.sector} className="hover:bg-[#0f182f]">
                  <td className="px-3 py-2 font-mono">{row.sector}</td>
                  <td className="px-3 py-2 font-mono">{row.averageTime.toFixed(3)}s</td>
                  <td className="px-3 py-2 font-mono">{Math.round(row.entry)} km/h</td>
                  <td className="px-3 py-2 font-mono">{Math.round(row.exit)} km/h</td>
                  <td className="px-3 py-2 font-mono">{row.steering.toFixed(1)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectorSummary;