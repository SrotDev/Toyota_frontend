"use client";
import React from 'react';
import { Radar, RadarChart as RRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface RadarDatum { metric: string; value: number; }
interface Props { data: RadarDatum[]; color?: string; height?: number; }
export const RadarChart: React.FC<Props> = ({ data, color = '#f59e0b', height = 300 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <RRadarChart data={data} outerRadius={110}>
      <PolarGrid stroke="#2e2e2e" />
      <PolarAngleAxis dataKey="metric" stroke="#999" />
      <PolarRadiusAxis stroke="#666" />
      <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid #333' }} />
      <Radar dataKey="value" stroke={color} fill={color} fillOpacity={0.35} />
    </RRadarChart>
  </ResponsiveContainer>
);
