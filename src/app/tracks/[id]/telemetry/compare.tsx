"use client";
import { useEffect, useState } from 'react';
import { api } from '../../../../utils/api';
import { LineChart } from '../../../../components/charts/LineChart';
import { RadarChart } from '../../../../components/charts/RadarChart';
interface Props { params: { id: string } }
export default async function CompareTelemetryPage({ params }: Props) {
  const data = await api.behaviorCompare(params.id, { user: 'uploaded', ideal: 'ideal' });
  const compared = data?.comparison || [];
  // Line series: turn vs delta_speed
  const lineSeries = compared.map((c: any) => ({ x: c.turn, y: c.delta_speed }));
  // Radar: Ideal vs User acceleration/brake scaled
  const radarData = compared.map((c: any) => ({ metric: `T${c.turn}`, value: c.delta_brake_force ?? 0 }));
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Driver Behavior Compare</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Speed Delta per Turn</h3>
          {lineSeries.length ? <LineChart data={lineSeries} /> : <p className="text-xs text-neutral-400">No speed delta data.</p>}
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Brake Force Delta Radar</h3>
          {radarData.length ? <RadarChart data={radarData} /> : <p className="text-xs text-neutral-400">No brake force delta data.</p>}
        </div>
      </div>
    </div>
  );
}
