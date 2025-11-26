"use client";
import React from 'react';

interface Cell { label: string; value: number; }
interface Props { data: Cell[]; max?: number; columns?: number; }
export const Heatmap: React.FC<Props> = ({ data, max, columns = 8 }) => {
  const maxVal = max ?? Math.max(...data.map(d => d.value), 1);
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {data.map((c, idx) => (
        <div key={idx} className="rounded p-2 text-center text-[10px]" style={{ backgroundColor: `rgba(239,68,68,${c.value / maxVal})` }}>
          {c.label}<br />{c.value.toFixed(0)}
        </div>
      ))}
    </div>
  );
};
