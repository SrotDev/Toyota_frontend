
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Track } from '../../types';
import { ArrowRight, Activity, Trophy, MapPin } from 'lucide-react';

const HomePage = ({ navigate }: { navigate: (p: string) => void }) => {
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        api.tracks.list().then(setTracks);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HERO */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#2A2A2A] group">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
                <img src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=3270&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Racing" />
                
                <div className="relative z-20 h-full flex flex-col justify-center p-8 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Orbitron'] text-white mb-4">
                        MASTER EVERY <span className="text-[#00D9FF]">CORNER</span>
                    </h1>
                    <p className="text-zinc-400 text-lg mb-6">
                        AI-powered telemetry analysis comparing your performance against ideal racing lines and optimal behavior models.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/upload')} className="bg-[#00D9FF] text-black font-bold px-6 py-3 rounded-lg hover:bg-[#00b8d4] transition-colors flex items-center gap-2">
                            START ANALYSIS <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-6 rounded-xl hover:border-[#00D9FF]/50 transition-colors">
                    <div className="w-10 h-10 bg-purple-900/20 text-purple-400 rounded-lg flex items-center justify-center mb-4">
                        <Activity size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">1,240</h3>
                    <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider">Laps Analyzed</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-6 rounded-xl hover:border-[#00D9FF]/50 transition-colors">
                    <div className="w-10 h-10 bg-yellow-900/20 text-yellow-400 rounded-lg flex items-center justify-center mb-4">
                        <Trophy size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">Top 5%</h3>
                    <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider">Global Ranking</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-6 rounded-xl hover:border-[#00D9FF]/50 transition-colors">
                    <div className="w-10 h-10 bg-blue-900/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                        <MapPin size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{tracks.length}</h3>
                    <p className="text-sm text-zinc-500 uppercase font-bold tracking-wider">Tracks Available</p>
                </div>
            </div>

            {/* TRACKS PREVIEW */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white font-['Orbitron']">FEATURED TRACKS</h2>
                    <button onClick={() => navigate('/tracks')} className="text-sm text-[#00D9FF] font-bold hover:underline">VIEW ALL</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tracks.slice(0, 3).map(track => (
                        <div key={track.id} onClick={() => navigate(`/tracks/${track.id}`)} className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl overflow-hidden cursor-pointer group hover:border-[#00D9FF] transition-all">
                            <div className="h-40 bg-[#111] p-4 flex items-center justify-center relative">
                                <img src={track.map_image} className="h-full w-auto object-contain filter invert opacity-80 group-hover:scale-110 transition-transform duration-500" alt={track.name} />
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-white font-mono border border-zinc-800">
                                    {track.length_km} KM
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-1">{track.name}</h3>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                    <MapPin size={12} /> {track.location}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
