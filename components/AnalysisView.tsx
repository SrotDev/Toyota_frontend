
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DRIVERS, getDriverStats } from '../data';
import { Brain, Zap, Activity } from 'lucide-react';

const AnalysisView: React.FC = () => {
  const [driver1Id, setDriver1Id] = useState('d01');
  const [driver2Id, setDriver2Id] = useState('d02');

  const driver1 = DRIVERS[driver1Id];
  const driver2 = DRIVERS[driver2Id];
  const stats1 = getDriverStats(driver1Id);
  const stats2 = getDriverStats(driver2Id);

  const radarData = [
    { subject: 'Speed', A: stats1.speed, B: stats2.speed, fullMark: 100 },
    { subject: 'Consistency', A: stats1.consistency, B: stats2.consistency, fullMark: 100 },
    { subject: 'Race Craft', A: stats1.raceCraft, B: stats2.raceCraft, fullMark: 100 },
    { subject: 'Tyre Mgmt', A: stats1.tyreMgmt, B: stats2.tyreMgmt, fullMark: 100 },
    { subject: 'Stress Est.', A: stats1.stressEstimate, B: stats2.stressEstimate, fullMark: 100 },
    { subject: 'Aggression', A: stats1.aggression, B: stats2.aggression, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Brain className="text-indigo-500" />
                  Driver Performance Analysis
              </h2>
              <p className="text-zinc-400 mt-1">Multi-dimensional performance analysis and stress estimation.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
             <select 
                 value={driver1Id} 
                 onChange={(e) => setDriver1Id(e.target.value)}
                 className="bg-zinc-950 text-white px-3 py-2 rounded-lg border border-zinc-700 text-sm font-bold"
             >
                 {Object.values(DRIVERS).map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
             </select>
             <span className="text-zinc-500 text-xs font-bold">VS</span>
             <select 
                 value={driver2Id} 
                 onChange={(e) => setDriver2Id(e.target.value)}
                 className="bg-zinc-950 text-white px-3 py-2 rounded-lg border border-zinc-700 text-sm font-bold"
             >
                 {Object.values(DRIVERS).map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
             </select>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
             <h3 className="w-full text-left font-bold text-lg text-white mb-4">Performance Profile</h3>
             <div className="w-full h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                         <PolarGrid stroke="#3f3f46" />
                         <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                         <Radar
                             name={driver1.name}
                             dataKey="A"
                             stroke={driver1.teamColor}
                             fill={driver1.teamColor}
                             fillOpacity={0.3}
                         />
                         <Radar
                             name={driver2.name}
                             dataKey="B"
                             stroke={driver2.teamColor}
                             fill={driver2.teamColor}
                             fillOpacity={0.3}
                         />
                         <Tooltip 
                             contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                             itemStyle={{ fontSize: 12 }}
                         />
                     </RadarChart>
                 </ResponsiveContainer>
             </div>
             <div className="flex gap-4 mt-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                     <div className="w-3 h-3 rounded-full" style={{background: driver1.teamColor}}></div>
                     {driver1.name}
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                     <div className="w-3 h-3 rounded-full" style={{background: driver2.teamColor}}></div>
                     {driver2.name}
                 </div>
             </div>
         </div>

         <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <CognitiveCard driver={driver1} stats={stats1} />
             <CognitiveCard driver={driver2} stats={stats2} />
         </div>
      </div>
    </div>
  );
};

const CognitiveCard = ({ driver, stats }: { driver: any, stats: any }) => {
    const stressColor = stats.stressEstimate > 80 ? 'text-red-500' : stats.stressEstimate > 60 ? 'text-yellow-500' : 'text-green-500';
    const barColor = stats.stressEstimate > 80 ? 'bg-red-500' : stats.stressEstimate > 60 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700 bg-zinc-800">
                    <img src={driver.headshotUrl} className="w-full h-full object-cover object-top transform scale-125 translate-y-1" alt=""/>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{driver.name}</h3>
                    <p className="text-sm text-zinc-400">{driver.teamName}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 z-10">
                 <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                     <div className="text-xs text-zinc-500 uppercase mb-1 flex items-center gap-2">
                         <Activity size={14} /> Stress Est.
                     </div>
                     <div className={`text-2xl font-bold ${stressColor}`}>{stats.stressEstimate}%</div>
                     <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                         <div className={`h-full ${barColor} transition-all duration-1000`} style={{width: `${stats.stressEstimate}%`}}></div>
                     </div>
                 </div>
                 <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                     <div className="text-xs text-zinc-500 uppercase mb-1 flex items-center gap-2">
                         <Zap size={14} /> Aggression
                     </div>
                     <div className="text-2xl font-bold text-indigo-400">{stats.aggression > 80 ? 'High' : 'Med'}</div>
                     <div className="text-xs text-zinc-500 mt-1">Driving Style</div>
                 </div>
            </div>

            <div className="space-y-3 z-10">
                <h4 className="text-xs font-bold text-zinc-500 uppercase">Key Metrics</h4>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-300">Tyre Management</span>
                    <span className="font-mono font-bold text-white">{stats.tyreMgmt}/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full">
                    <div className="h-full bg-indigo-500" style={{width: `${stats.tyreMgmt}%`}}></div>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-300">Consistency</span>
                    <span className="font-mono font-bold text-white">{stats.consistency}/100</span>
                </div>
                <div className="w-full h-1 bg-zinc-800 rounded-full">
                    <div className="h-full bg-teal-500" style={{width: `${stats.consistency}%`}}></div>
                </div>
            </div>
        </div>
    )
}

export default AnalysisView;
