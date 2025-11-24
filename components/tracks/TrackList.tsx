import React, { useEffect, useState } from 'react';
import { MapPin, Route } from 'lucide-react';
import { api } from '../../services/api';
import { Track } from '../../types';

const TrackList = ({ navigate }: { navigate: (p: string) => void }) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    api.tracks.list().then(setTracks);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Tracks</p>
          <h1 className="text-3xl font-bold font-['Orbitron']">All Circuits</h1>
          <p className="text-zinc-400 text-sm">Direct map of the Track model with laps and sectors attached.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl overflow-hidden hover:border-[#72E8FF] transition-colors cursor-pointer"
            onClick={() => navigate(`/tracks/${track.id}`)}
          >
            <div className="h-44 bg-[#0f182f] flex items-center justify-center p-5">
              <img src={track.mapImage} alt={track.name} className="h-full w-auto object-contain filter invert opacity-80" />
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#8fb5ff] uppercase font-semibold">
                <Route size={14} /> {track.lengthKm} km • {track.turns} turns • {track.totalLaps} laps
              </div>
              <h3 className="text-xl font-bold">{track.name}</h3>
              <p className="text-sm text-zinc-400 flex items-center gap-2">
                <MapPin size={14} /> {track.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
