"use client";
import React, { useEffect, useState } from 'react';

interface Props { trackId: string; height?: number; width?: number }
export default function LiveLapSparkline({ trackId, height=40, width=300 }: Props) {
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
  if (!laps.length) return <p className="text-[11px] text-neutral-500">Waiting for laps...</p>;
  const times = laps.map(l => l.lap_time);
  const minT = Math.min(...times);
  const maxT = Math.max(...times);
  const points = laps.map((l,i) => {
    const x = (i/(laps.length-1))*width;
    const y = height - ((l.lap_time - minT)/(maxT - minT + 0.0001))*height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke="#10b981" strokeWidth={1.2} />
      <circle cx={width} cy={height - ((times[times.length-1]-minT)/(maxT-minT+0.0001))*height} r={3} fill="#10b981" />
    </svg>
  );
}
