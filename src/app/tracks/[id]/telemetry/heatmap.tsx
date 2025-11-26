"use client";
import React, { useEffect, useState } from 'react';
import { api } from '../../../../utils/api';
import { Heatmap } from '../../../../components/charts/Heatmap';

interface Props { params: { id: string } }
export default async function HeatmapTelemetryPage({ params }: Props) {
  const data = await api.sectorTelemetry(params.id);
  const sectors = data?.sectors || [];
  // Construct a simple square-ish matrix: chunk sectors into rows of ~10
  const size = Math.ceil(Math.sqrt(sectors.length));
  const matrix: number[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      const idx = r * size + c;
      const s = sectors[idx];
      return s ? (s.pace_loss || s.loss || s.degradation || 0) : 0;
    })
  );
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Heatmap (Loss Intensity)</h2>
      <Heatmap data={matrix} />
    </div>
  );
}
