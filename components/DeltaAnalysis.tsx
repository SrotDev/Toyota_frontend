
import React from 'react';
import { DRIVERS } from '../data';

const DeltaAnalysis: React.FC = () => {
  // Hardcoded IDs to match example or dynamic
  const d1 = DRIVERS['d01'];
  const d2 = DRIVERS['d03'];

  if (!d1 || !d2) return <div>Data Loading...</div>;

  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00D9FF] transition-all duration-300 backdrop-blur-sm h-full">
        <h3 className="text-lg font-bold font-['Orbitron'] mb-6 text-white">DELTA ANALYSIS - TOP DRIVERS</h3>
        
        <div className="flex justify-between mb-6">
            <div>
                <div className="text-[10px] text-[#6B7280] font-bold uppercase">DRIVER 1</div>
                <div className="text-sm font-bold text-white">#{d1.number} - {d1.vehicle}</div>
            </div>
             <div className="text-right">
                <div className="text-[10px] text-[#6B7280] font-bold uppercase">DRIVER 2</div>
                <div className="text-sm font-bold text-white">#{d2.number} - {d2.vehicle}</div>
            </div>
        </div>

        <div className="mb-6">
            <div className="text-[10px] text-[#6B7280] font-bold uppercase mb-1">TOTAL DELTA</div>
            <div className="text-3xl font-bold font-mono text-[#00D9FF]">-2.082s</div>
            <div className="text-[10px] text-[#6B7280] font-bold mt-1">#{d1.number} is faster</div>
        </div>

        <div>
             <div className="text-[10px] text-[#6B7280] font-bold uppercase mb-4">SECTOR BREAKDOWN</div>
             <div className="space-y-4">
                 <div>
                     <div className="flex justify-between text-xs mb-1 font-bold">
                         <span className="text-white">S1</span>
                         <span className="text-[#00D9FF] font-mono">-0.694s</span>
                     </div>
                     <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
                         <div className="bg-[#00D9FF] h-full w-[70%]"></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-xs mb-1 font-bold">
                         <span className="text-white">S2</span>
                         <span className="text-[#00D9FF] font-mono">-0.833s</span>
                     </div>
                     <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
                         <div className="bg-[#00D9FF] h-full w-[85%]"></div>
                     </div>
                 </div>
                 <div>
                     <div className="flex justify-between text-xs mb-1 font-bold">
                         <span className="text-white">S3</span>
                         <span className="text-[#00D9FF] font-mono">-0.555s</span>
                     </div>
                     <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
                         <div className="bg-[#00D9FF] h-full w-[55%]"></div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default DeltaAnalysis;
