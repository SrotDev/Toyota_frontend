
import React from 'react';
import { OVERTAKING_ZONES } from '../data';

const AttackZones: React.FC = () => {
  const getDifficultyColor = (diff: string) => {
      switch(diff.toLowerCase()) {
          case 'low': return 'text-[#10B981] bg-[#10B981]/20';
          case 'moderate': return 'text-[#FBBF24] bg-[#FBBF24]/20';
          case 'high': return 'text-[#DC2626] bg-[#DC2626]/20';
          default: return 'text-white';
      }
  };

  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00D9FF] transition-all duration-300 backdrop-blur-sm flex-1 flex flex-col h-full">
         <h3 className="text-lg font-bold font-['Orbitron'] text-white mb-4">ATTACK ZONES - KEY OPPORTUNITIES</h3>
         
         <div className="flex gap-2 mb-6">
             <span className="bg-[#222] text-white text-[10px] font-bold px-3 py-1 rounded-full border border-[#333]">ZONES: 5</span>
             <span className="bg-[#222] text-[#FBBF24] text-[10px] font-bold px-3 py-1 rounded-full border border-[#333]">SPEC SERIES</span>
         </div>

         <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
             {OVERTAKING_ZONES.map((zone) => (
                 <div key={zone.id} className="bg-[#0F0F0F] p-4 rounded-xl border border-[#2A2A2A] hover:border-[#10B981]/50 transition-colors">
                     <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center text-xs font-bold text-white border border-[#333]">{zone.positionNumber}</div>
                             <span className="text-sm font-bold text-white">{zone.name}</span>
                         </div>
                     </div>

                     <div className="flex items-center justify-between mb-2">
                         <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getDifficultyColor(zone.difficulty)}`}>
                             {zone.difficulty} DIFFICULTY
                         </span>
                     </div>

                     <p className="text-xs text-[#9CA3AF]">{zone.description}</p>
                 </div>
             ))}
         </div>
    </div>
  );
};

export default AttackZones;
