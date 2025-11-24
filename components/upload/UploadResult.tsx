import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { UploadResult } from '../../types';
import { CheckCircle2 } from 'lucide-react';

const UploadResultPage = () => {
  const [result, setResult] = useState<UploadResult | null>(null);

  useEffect(() => {
    const sessionId = localStorage.getItem('lastSessionId');
    if (!sessionId) return;
    api.uploads.result(sessionId).then((res) => res && setResult(res));
  }, []);

  if (!result) return <div className="text-zinc-300">No upload session found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[#8fb5ff] text-xs font-semibold uppercase">
        <CheckCircle2 size={14} /> Upload result
      </div>
      <div className="bg-[#0b0f1a] border border-[#1f2a44] rounded-2xl p-6 space-y-2">
        <p className="text-sm text-zinc-300">Session {result.session.id} • Track {result.session.trackId}</p>
        <p className="text-sm text-zinc-300">Leaderboard delta: {result.leaderboardDelta}</p>
        <ul className="list-disc ml-5 text-sm text-zinc-300 space-y-1">
          {result.coaching.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadResultPage;