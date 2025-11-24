
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Track } from '../../types';
import { MapPin, Flag, ChevronRight } from 'lucide-react';

const TrackList = ({ navigate }: { navigate: (p: string) => void }) => {
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        api.tracks.list().then(setTracks);
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-2">SELECT TRACK</h2>
                <p className="text-zinc-500">Choose a circuit to analyze lap data and telemetry.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {tracks.map(track => (
                    <div 
                        key={track.id} 
                        onClick={() => navigate(`/tracks/${track.id}`)}
                        className="bg-[#0A0A0A] border border-[#2A2A2A] p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 hover:border-[#00D9FF] hover:bg-[#00D9FF]/5 transition-all cursor-pointer group"
                    >
                        <div className="w-full md:w-48 h-32 bg-[#111] rounded-lg p-2 flex items-center justify-center border border-[#222]">
                            <img src={track.map_image} className="max-w-full max-h-full opacity-80 filter invert" alt={track.name} />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{track.name}</h3>
                            <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {track.location}</span>
                                <span className="flex items-center gap-1"><Flag size={14} /> {track.turns} Turns</span>
                                <span>{track.length_km} KM</span>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center group-hover:bg-[#00D9FF] group-hover:text-black group-hover:border-[#00D9FF] transition-all text-zinc-500">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackList;
