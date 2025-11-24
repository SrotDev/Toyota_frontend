import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Track, UploadedSession, UploadResult } from '../../types';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

const UploadPage = ({ navigate }: { navigate: (p: string) => void }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [trackId, setTrackId] = useState('cota');
  const [file, setFile] = useState<File | null>(null);
  const [session, setSession] = useState<UploadedSession | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.tracks.list().then(setTracks);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const created = await api.uploads.create(file, trackId);
    setSession(created);
    localStorage.setItem('lastSessionId', created.id);
    const res = await api.uploads.result(created.id);
    if (res) setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-[#8fb5ff] uppercase font-semibold">Upload telemetry</p>
        <h1 className="text-3xl font-bold font-['Orbitron']">Upload & compare</h1>
        <p className="text-zinc-400 text-sm">Maps to /api/upload-telemetry and results/status endpoints.</p>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1 space-y-2 text-sm">
            <span className="text-zinc-400">Choose track</span>
            <select value={trackId} onChange={(e) => setTrackId(e.target.value)} className="w-full bg-[#0f182f] border border-[#1f2a44] rounded-lg px-3 py-2">
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1 space-y-2 text-sm">
            <span className="text-zinc-400">Telemetry file</span>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full bg-[#0f182f] border border-[#1f2a44] rounded-lg px-3 py-2" />
          </label>
          <div className="flex items-end">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="bg-[#72E8FF] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#9ff0ff] disabled:opacity-50"
            >
              <UploadCloud size={16} /> {loading ? 'Uploading…' : 'Start upload'}
            </button>
          </div>
        </div>
        {session && (
          <div className="text-sm text-zinc-300">Session {session.id} • Status {session.status}</div>
        )}
      </div>

      {result && (
        <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
            <CheckCircle2 size={14} /> Results ready
          </div>
          <p className="text-sm text-zinc-300">Leaderboard delta: {result.leaderboardDelta} positions</p>
          <ul className="list-disc ml-5 text-sm text-zinc-300 space-y-1">
            {result.coaching.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <button className="text-xs text-[#72E8FF]" onClick={() => navigate('/upload/result')}>
            Open result page
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;