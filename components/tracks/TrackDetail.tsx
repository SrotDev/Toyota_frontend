
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Track, Lap } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Zap, ArrowRight } from 'lucide-react';

const TrackDetail = ({ trackId, navigate }: { trackId: string, navigate: (p: string) => void }) => {
    const [track, setTrack] = useState<Track | null>(null);
    const [laps, setLaps] = useState<Lap[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.tracks.get(trackId),
            api.laps.list(trackId)
        ]).then(([t, l]) => {
            setTrack(t || null);
            setLaps(l);
            setLoading(false);
        });
    }, [trackId]);

    if (loading || !track) return <div className="text-white">Loading Track Data...</div>;

    const bestLap = laps.find(l => l.is_personal_best);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <button onClick={() => navigate('/tracks')} className="text-xs text-zinc-500 hover:text-white mb-2">← BACK TO LIST</button>
                    <h1 className="text-4xl font-bold text-white font-['Orbitron']">{track.name}</h1>
                    <p className="text-zinc-400 flex items-center gap-2 mt-1"><span className="text-[#00D9FF]">{track.turns} TURNS</span> • {track.length_km} KM</p>
                </div>
                <button 
                    onClick={() => navigate(`/tracks/${trackId}/telemetry`)}
                    className="bg-[#00D9FF] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#00b8d4]"
                >
                    OPEN TELEMETRY <Activity size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MAP CARD */}
                <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 min-h-[400px] flex items-center justify-center relative">
                    <img src={track.map_image} className="w-full h-full object-contain filter invert opacity-90 p-8" alt="Map" />
                    <div className="absolute top-4 left-4 bg-black/80 p-2 rounded border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase block">Personal Best</span>
                        <span className="text-xl font-bold text-[#00D9FF] font-mono">{bestLap?.lap_time || '--.--'}s</span>
                    </div>
                </div>

                {/* SECTOR RADAR */}
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">SECTOR PERFORMANCE</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                { subject: 'Entry Speed', A: 85, fullMark: 100 },
                                { subject: 'Exit Speed', A: 70, fullMark: 100 },
                                { subject: 'Braking', A: 90, fullMark: 100 },
                                { subject: 'Throttle', A: 65, fullMark: 100 },
                                { subject: 'Steering', A: 80, fullMark: 100 },
                            ]}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Performance" dataKey="A" stroke="#00D9FF" strokeWidth={2} fill="#00D9FF" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* LAPS TABLE */}
            <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[#2A2A2A] flex justify-between items-center bg-[#111]">
                    <h3 className="font-bold text-white">LAP HISTORY</h3>
                    <span className="text-xs text-zinc-500 font-mono">SESSION: {new Date().toLocaleDateString()}</span>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0A0A0A] text-zinc-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-3">Lap</th>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">S1</th>
                            <th className="px-6 py-3">S2</th>
                            <th className="px-6 py-3">S3</th>
                            <th className="px-6 py-3">Max Speed</th>
                            <th className="px-6 py-3">Analysis</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A1A1A]">
                        {laps.map(lap => (
                            <tr key={lap.id} className="hover:bg-[#111] transition-colors text-zinc-300">
                                <td className="px-6 py-3 font-mono font-bold text-white">
                                    {lap.lap_number}
                                    {lap.is_personal_best && <span className="ml-2 text-[9px] bg-[#00D9FF] text-black px-1 rounded">PB</span>}
                                </td>
                                <td className="px-6 py-3 font-mono">{lap.lap_time.toFixed(3)}</td>
                                <td className={`px-6 py-3 font-mono ${lap.sectors[0].status === 'PURPLE' ? 'text-purple-400' : ''}`}>{lap.sectors[0].sector_time.toFixed(3)}</td>
                                <td className={`px-6 py-3 font-mono ${lap.sectors[1].status === 'PURPLE' ? 'text-purple-400' : ''}`}>{lap.sectors[1].sector_time.toFixed(3)}</td>
                                <td className={`px-6 py-3 font-mono ${lap.sectors[2].status === 'PURPLE' ? 'text-purple-400' : ''}`}>{lap.sectors[2].sector_time.toFixed(3)}</td>
                                <td className="px-6 py-3 font-mono">{Math.round(lap.max_speed)} km/h</td>
                                <td className="px-6 py-3">
                                    {lap.mistakes > 0 ? (
                                        <span className="text-xs text-red-500 flex items-center gap-1"><Zap size={12}/> {lap.mistakes} Mistake</span>
                                    ) : (
                                        <span className="text-xs text-green-500 flex items-center gap-1"><Zap size={12}/> Clean</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrackDetail;
