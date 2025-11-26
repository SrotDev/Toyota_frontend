"use client";
import React from 'react';
import { LineChart as RLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface LinePoint { x: string | number; y: number; }
interface Props { data: LinePoint[]; color?: string; height?: number; }
export const LineChart: React.FC<Props> = ({ data, color = '#0ea5e9', height = 240 }) => (
  <div className="w-full h-full">
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
        <XAxis dataKey="x" stroke="#999" />
        <YAxis stroke="#999" />
        <Tooltip contentStyle={{ background: '#0f0f0f', border: '1px solid #333' }} />
        <Line type="monotone" dataKey="y" stroke={color} strokeWidth={2} dot={false} />
      </RLineChart>
    </ResponsiveContainer>
  </div>
);
