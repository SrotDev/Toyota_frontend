
import React from 'react';
import { RACE_RESULTS, DRIVERS, getDriverStats } from '../data';
import { Zap, Target, Activity, BarChart2 } from 'lucide-react';

const LiveStandings: React.FC = () => {
  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col hover:border-[#00D9FF] transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={20} className="text-[#DC2626]" />
            <h3 className="text-lg font-bold font-['Orbitron'] text-white">LIVE STANDINGS</h3>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {RACE_RESULTS.map((result) => {
                const driver = DRIVERS[result.driverId];
                const stats = getDriverStats(result.driverId);
                
                const isFirst = result.position === 1;
                const isSecond = result.position === 2;
                const isThird = result.position === 3;
                
                const borderColor = isFirst ? 'border-[#F97316]' : isSecond ? 'border-[#9CA3AF]' : isThird ? 'border-[#B45309]' : 'border-transparent';
                const posColor = isFirst ? 'text-[#F97316]' : 'text-white';

                return (
                    <div key={driver.id} className={`bg-[#0F0F0F]/80 border-l-4 ${borderColor} rounded-r-xl p-5 hover:bg-[#151515] transition-all group`}>
                        <div className="flex items-center gap-4 mb-4">
                            <span className={`text-4xl font-bold font-mono ${posColor}`}>{result.position}</span>
                            <div className="flex-1">
                                <div className="font-bold text-white text-lg group-hover:text-[#00D9FF] transition-colors">{driver.name}</div>
                                <div className="text-xs text-[#6B7280] font-bold uppercase">{driver.vehicle}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-[#6B7280] font-bold tracking-wider mb-1">BEST LAP</div>
                                <div className="text-xl font-bold font-mono text-[#00D9FF]">{result.fastestLap}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-[#222]">
                             <div className="flex items-center gap-2">
                                <Zap size={14} className="text-white" />
                                <span className="text-[10px] text-[#9CA3AF] font-bold">SPEED</span>
                                <span className="text-xs font-mono text-white font-bold ml-auto">{stats.speed}/100</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Target size={14} className="text-[#10B981]" />
                                <span className="text-[10px] text-[#9CA3AF] font-bold">CONSISTENCY</span>
                                <span className="text-xs font-mono text-white font-bold ml-auto">{stats.consistency}/10</span>
                             </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Activity size={14} className="text-[#A855F7]" />
                            <span className="text-[10px] text-[#9CA3AF] font-bold">STRESS EST.</span>
                            <div className="flex-1 h-2 bg-[#222] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#F97316] to-[#DC2626]" style={{width: `${stats.stressEstimate}%`}}></div>
                            </div>
                            <span className="text-xs font-mono text-white font-bold">{stats.stressEstimate}%</span>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default LiveStandings;
