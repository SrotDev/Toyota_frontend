
import React from 'react';
import { Flag, Clock, Activity } from 'lucide-react';

const Header: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });

  return (
    <header className="h-20 border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand Identity */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white text-black rounded-sm">
           <Flag size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-['Orbitron'] tracking-tighter leading-none text-white">
            RACEMIND <span className="text-[#00D9FF]">3D</span>
          </h1>
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-[0.2em] font-medium">Advanced Cognitive Telemetry System</p>
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
           <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DC2626]"></span>
           </span>
           <span className="text-xs font-bold tracking-wider text-white">LIVE</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg">
           <Activity size={16} className="text-[#00D9FF]" />
           <span className="text-xs font-bold tracking-wider text-white">REAL-TIME TELEMETRY</span>
        </div>
         <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg min-w-[140px]">
           <Clock size={16} className="text-[#9CA3AF]" />
           <span className="text-xs font-bold tracking-wider text-white font-mono">{currentTime}</span>
        </div>
      </div>

      {/* Session Info Card */}
      <div className="hidden xl:block bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 min-w-[200px]">
          <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-[#6B7280] font-bold uppercase">Current Session</span>
              <span className="text-[10px] text-[#00D9FF] font-bold uppercase">RACE DAY</span>
          </div>
          <div className="flex justify-between items-end">
              <div>
                  <span className="text-[10px] text-[#6B7280] block">LAP</span>
                  <span className="text-xl font-bold font-mono text-[#00D9FF]">12<span className="text-[#6B7280]">/15</span></span>
              </div>
              <div className="text-right">
                  <span className="text-[10px] text-[#6B7280] block">TEMP</span>
                  <span className="text-xl font-bold font-mono text-[#F97316]">28°C</span>
              </div>
          </div>
      </div>
    </header>
  );
};

export default Header;
