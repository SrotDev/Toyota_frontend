"use client";
import React, { useEffect, useState, ChangeEvent } from 'react';
import { api } from '../../../utils/api';

export default function UploadResultPage() {
  const [parsed, setParsed] = useState<any>(null);
  const [compare, setCompare] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string>('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('uploadedTelemetry');
      if (!raw) return;
      let data: any[] = [];
      if (raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
        data = JSON.parse(raw);
      } else {
        const lines = raw.split(/\r?\n/).filter(l => l.trim());
        const header = lines.shift()?.split(',') || [];
        data = lines.map(line => {
          const parts = line.split(',');
            const obj: any = {};
            header.forEach((h, i) => obj[h] = parts[i]);
            return obj;
        });
      }
      setParsed(data.slice(0, 50));
    } catch (e:any) { setError('Failed parsing uploaded telemetry: ' + e.message); }
  }, []);

  const handleCompare = async () => {
    if (!trackId) { setError('Select track id (UUID).'); return; }
    setError(null);
    try {
      const curves: any = {};
      parsed?.forEach((row: any) => {
        const sec = row.sector || row.sector_id || 1;
        const speed = parseFloat(row.speed || row.speed_mean || '0');
        if (!curves[sec]) curves[sec] = { speed_accum: 0, count: 0 };
        curves[sec].speed_accum += speed; curves[sec].count += 1;
      });
      Object.keys(curves).forEach(sec => {
        const { speed_accum, count } = curves[sec];
        curves[sec] = { speed_mean: count ? speed_accum / count : 0 };
      });
      const cmp = await api.behaviorCompare(trackId, curves);
      setCompare(cmp);
    } catch (e:any) { setError(e.message); }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Result</h2>
      <div className="space-y-2">
        <input type="text" placeholder="Track UUID" value={trackId} onChange={(e: ChangeEvent<HTMLInputElement>) => setTrackId(e.target.value)} className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm w-full" />
        <button onClick={handleCompare} className="px-3 py-1 rounded bg-accent text-sm">Run Behavior Compare</button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {parsed && <details className="text-xs">
        <summary className="cursor-pointer">Parsed Preview ({parsed.length} rows)</summary>
        <pre className="bg-neutral-900 p-3 mt-2 rounded border border-neutral-800 overflow-x-auto">{JSON.stringify(parsed, null, 2)}</pre>
      </details>}
      {compare && <pre className="text-xs bg-neutral-900 p-3 rounded border border-neutral-800 overflow-x-auto">{JSON.stringify(compare.comparisons, null, 2)}</pre>}
    </div>
  );
}
