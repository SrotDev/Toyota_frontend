
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { getDriverStats, DRIVERS } from '../data';

const DriverAnalysis: React.FC = () => {
  const stats = getDriverStats('d01'); 
  const driver = DRIVERS['d01'];

  if (!driver) return null;
  
  const radarData = [
    { subject: 'SPEED', A: 92, fullMark: 100 },
    { subject: 'CONSISTENCY', A: 88, fullMark: 100 },
    { subject: 'RACE CRAFT', A: 85, fullMark: 100 },
    { subject: 'TYRE MGMT', A: 90, fullMark: 100 },
    { subject: 'STRESS', A: 45, fullMark: 100 }, 
    { subject: 'AGGRESSION', A: 90, fullMark: 100 },
  ];

  const bars = [
      { label: 'SPEED', val: 92 },
      { label: 'CONSISTENCY', val: 88 },
      { label: 'RACE CRAFT', val: 85 },
      { label: 'TYRE MGMT', val: 90 },
  ];

  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col hover:border-[#00D9FF] transition-all duration-300">
        <div className="mb-4">
            <h3 className="text-lg font-bold font-['Orbitron'] text-white">DRIVER ANALYSIS</h3>
            <p className="text-xs text-[#6B7280] font-bold tracking-wider mt-1">{driver.name.toUpperCase()}</p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
            {/* Radar Chart */}
            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#FFFFFF', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name={driver.name}
                            dataKey="A"
                            stroke="#00D9FF"
                            strokeWidth={2}
                            fill="#00D9FF"
                            fillOpacity={0.2}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Performance Bars */}
            <div className="space-y-4 mt-4">
                {bars.map((bar) => (
                    <div key={bar.label} className="flex items-center gap-4">
                        <span className="w-24 text-[10px] text-[#9CA3AF] font-bold tracking-wider">{bar.label}</span>
                        <div className="flex-1 h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
                            <div className="h-full bg-[#00D9FF]" style={{ width: `${bar.val}%` }}></div>
                        </div>
                        <span className="text-sm font-bold font-mono text-white w-8 text-right">{bar.val}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default DriverAnalysis;
