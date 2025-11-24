
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LAP_HISTORY, DRIVERS, RACE_RESULTS } from '../data';
import { Timer, TrendingDown } from 'lucide-react';
import StrategyWindows from './StrategyWindows';

const StrategyView: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'top5'>('top5');
  
  const top5Ids = RACE_RESULTS.slice(0, 5).map(r => r.driverId);
  const activeDriverIds = filter === 'all' ? Object.keys(DRIVERS) : top5Ids;

  // Transform Data for Gap Chart
  const gapData = [];
  const leaderId = RACE_RESULTS[0].driverId;
  const cumulativeTimes: Record<string, Record<number, number>> = {};
  
  Object.keys(DRIVERS).forEach(dId => {
      cumulativeTimes[dId] = {};
      let total = 0;
      LAP_HISTORY.filter(l => l.driverId === dId).sort((a,b) => a.lap - b.lap).forEach(lap => {
          total += lap.time;
          cumulativeTimes[dId][lap.lap] = total;
      });
  });

  for(let i=1; i<=15; i++) {
      const gapPoint: any = { lap: i };
      const leaderTime = cumulativeTimes[leaderId][i] || 0;

      LAP_HISTORY.filter(l => l.lap === i).forEach(l => {
          if (activeDriverIds.includes(l.driverId)) {
              if (cumulativeTimes[l.driverId][i]) {
                  const gap = cumulativeTimes[l.driverId][i] - leaderTime;
                  gapPoint[DRIVERS[l.driverId].code] = parseFloat(gap.toFixed(2));
              }
          }
      });
      gapData.push(gapPoint);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Timer className="text-indigo-500" />
                    Pace & Strategy Analysis
                </h2>
                <p className="text-zinc-400 mt-1">Visualizing lap time evolution and pace management strategies.</p>
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                {[
                    { id: 'top5', label: 'Leaders' },
                    { id: 'all', label: 'All Drivers' },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${
                            filter === f.id 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Strategy Matrix Table */}
        <StrategyWindows />

        {/* Gap Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[400px]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <TrendingDown size={16} className="text-indigo-400" />
                Gap to Leader (Race Trace)
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gapData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                        dataKey="lap" 
                        stroke="#52525b" 
                        tickLine={false}
                        label={{ value: 'Lap', position: 'insideBottom', dy: 10, fill: '#52525b' }}
                    />
                    <YAxis 
                        stroke="#52525b" 
                        tickLine={false}
                        tick={{fill: '#71717a'}}
                        label={{ value: 'Gap (s)', angle: -90, position: 'insideLeft', fill: '#71717a' }}
                        reversed={true} 
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number, name: string) => [`+${value}s`, name]}
                    />
                    {activeDriverIds.map(id => (
                        <Line 
                            key={id}
                            type="monotone" 
                            dataKey={DRIVERS[id].code} 
                            stroke={DRIVERS[id].teamColor} 
                            dot={false} 
                            strokeWidth={id === leaderId ? 4 : 2} 
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default StrategyView;
