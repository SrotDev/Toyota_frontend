"use client";
import React, { useEffect, useState } from 'react';

interface Props { trackId: string }
export default function LapStreamClient({ trackId }: Props) {
  const [laps, setLaps] = useState<{lap_number:number; lap_time:number}[]>([]);
  useEffect(() => {
    const es = new EventSource(`${process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api'}/strategy/track/${trackId}/stream/laps/`);
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setLaps(prev => [...prev.slice(-49), data]);
      } catch {}
    };
    es.onerror = () => { es.close(); };
    return () => es.close();
  }, [trackId]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 text-[10px]">
        {laps.map(l => <span key={l.lap_number} className="px-1 py-0.5 bg-neutral-800 rounded">L{l.lap_number}:{l.lap_time.toFixed(0)}</span>)}
      </div>
    </div>
  );
}
