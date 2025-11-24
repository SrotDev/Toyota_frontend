
import React from 'react';
import { STRATEGY_OPTIONS } from '../data';
import { Flag, ShieldCheck, AlertTriangle, Flame, Zap } from 'lucide-react';

const StrategyWindows: React.FC = () => {
  
  // Stints now represent Pace Phases in a Sprint Race
  const calculatePhases = (phases: string[]) => {
      const totalPhases = phases.length;
      const pct = 100 / totalPhases;

      return phases.map((phase) => ({
          type: phase,
          pct: pct
      }));
  };

  const getPhaseColor = (p: string) => {
      if (p === 'PUSH') return 'bg-[#EF4444] shadow-[0_0_10px_#EF4444]'; 
      if (p === 'BALANCED') return 'bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]'; 
      if (p === 'SAVE') return 'bg-[#10B981] shadow-[0_0_10px_#10B981]'; 
      return 'bg-zinc-600';
  };

  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-0 overflow-hidden hover:border-[#00D9FF] transition-all duration-300 backdrop-blur-sm h-full flex flex-col shadow-lg group">
         
         <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#151515]/80">
             <div>
                <h3 className="text-lg font-bold font-['Orbitron'] text-white flex items-center gap-2">
                    <Flag size={18} className="text-[#00D9FF]" />
                    PACE STRATEGY
                </h3>
                <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono uppercase tracking-wider">Race Pace & Energy Management</p>
             </div>
             
             <div className="hidden xl:flex gap-3">
                 <div className="flex items-center gap-1.5 bg-[#0F0F0F] px-2 py-1 rounded border border-[#333]">
                     <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                     <span className="text-[9px] text-zinc-400 font-bold">PUSH</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-[#0F0F0F] px-2 py-1 rounded border border-[#333]">
                     <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                     <span className="text-[9px] text-zinc-400 font-bold">BALANCE</span>
                 </div>
                 <div className="flex items-center gap-1.5 bg-[#0F0F0F] px-2 py-1 rounded border border-[#333]">
                     <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                     <span className="text-[9px] text-zinc-400 font-bold">SAVE</span>
                 </div>
             </div>
         </div>

         <div className="flex-1 overflow-x-auto custom-scrollbar">
             <table className="w-full text-left border-collapse min-w-[600px]">
                 <thead>
                     <tr className="bg-[#0A0A0A] text-[9px] uppercase text-[#6B7280] font-bold tracking-widest border-b border-[#2A2A2A]">
                         <th className="px-5 py-4 font-mono">Option</th>
                         <th className="px-5 py-4 font-mono w-[50%]">Pace Phase Visualization</th>
                         <th className="px-5 py-4 font-mono">Risk Profile</th>
                         <th className="px-5 py-4 font-mono text-right">Advantage</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-[#222]">
                     {STRATEGY_OPTIONS.map((opt, idx) => {
                         const phases = calculatePhases(opt.phases);
                         
                         return (
                             <tr key={opt.id} className="hover:bg-[#1A1A1A] transition-colors duration-200 group/row">
                                 <td className="px-5 py-4">
                                     <div className="flex gap-3">
                                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm font-mono shadow-lg transition-transform group-hover/row:scale-110
                                             ${idx === 0 ? 'bg-[#00D9FF] text-black shadow-[#00D9FF]/20' : 'bg-[#222] text-[#666] border border-[#333]'}
                                         `}>
                                             {String.fromCharCode(65 + idx)}
                                         </div>
                                         <div className="flex flex-col justify-center">
                                             <span className={`text-xs font-bold ${idx === 0 ? 'text-white' : 'text-zinc-400'}`}>{opt.name}</span>
                                         </div>
                                     </div>
                                 </td>

                                 <td className="px-5 py-4">
                                     <div className="flex flex-col gap-2">
                                         <div className="flex w-full h-2.5 rounded-full bg-[#111] border border-[#333] relative overflow-hidden">
                                             {phases.map((phase, sIdx) => (
                                                 <React.Fragment key={sIdx}>
                                                     <div 
                                                         className={`${getPhaseColor(phase.type)} h-full relative group/stint transition-all hover:brightness-125 cursor-help`} 
                                                         style={{ width: `${phase.pct}%` }}
                                                     >
                                                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/stint:flex flex-col items-center bg-black/90 text-white text-[9px] px-2 py-1 rounded border border-[#333] z-20 whitespace-nowrap shadow-xl">
                                                             <span className="font-bold text-[10px]">{phase.type}</span>
                                                         </div>
                                                     </div>
                                                 </React.Fragment>
                                             ))}
                                         </div>
                                         <div className="flex justify-between text-[8px] text-[#444] font-mono px-0.5 uppercase tracking-wider">
                                             <span>Start</span>
                                             <span className="group-hover/row:text-[#00D9FF] transition-colors">Finish</span>
                                         </div>
                                     </div>
                                 </td>

                                 <td className="px-5 py-4">
                                     {opt.risk === 'Low' && (
                                         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
                                             <ShieldCheck size={12} />
                                             <span className="text-[9px] font-bold uppercase tracking-wider">Low</span>
                                         </div>
                                     )}
                                     {opt.risk === 'Medium' && (
                                         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#EAB308]">
                                             <AlertTriangle size={12} />
                                             <span className="text-[9px] font-bold uppercase tracking-wider">Medium</span>
                                         </div>
                                     )}
                                     {opt.risk === 'High' && (
                                         <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]">
                                             <Flame size={12} />
                                             <span className="text-[9px] font-bold uppercase tracking-wider">High</span>
                                         </div>
                                     )}
                                 </td>

                                 <td className="px-5 py-4 text-right">
                                     <span className="text-[10px] text-white font-bold">{opt.advantage}</span>
                                 </td>
                             </tr>
                         )
                     })}
                 </tbody>
             </table>
         </div>

         <div className="p-3 bg-[#0F0F0F] border-t border-[#2A2A2A] flex items-center gap-2">
             <Zap size={14} className="text-[#EAB308]" />
             <span className="text-[10px] text-zinc-400">
                 <strong className="text-white">INSIGHT:</strong> Managing thermal degradation in S2 is key to late race pace.
             </span>
         </div>
    </div>
  );
};

export default StrategyWindows;
