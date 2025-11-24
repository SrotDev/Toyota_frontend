
import React, { useState, useEffect } from 'react';
import { TRACK_INCIDENTS } from '../data';
import { AlertTriangle, Flag, Activity, FileText, ShieldAlert, CheckCircle2, Siren, ChevronRight } from 'lucide-react';

type FeedMessage = {
    id: string;
    time: string;
    message: string;
    category: 'FLAG' | 'INCIDENT' | 'PENALTY' | 'INFO';
    status?: 'OPEN' | 'CLOSED' | 'NOTED';
};

const TrackIncidents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'FEED' | 'RISK'>('FEED');
  const [trackStatus, setTrackStatus] = useState<'GREEN' | 'YELLOW' | 'VSC' | 'SC' | 'RED'>('GREEN');
  const [messages, setMessages] = useState<FeedMessage[]>([
      { id: 'msg-0', time: '14:02', message: 'RACE STARTED - ROUND 1', category: 'INFO' },
      { id: 'msg-1', time: '14:05', message: 'DRS ENABLED', category: 'INFO' }
  ]);

  // Simulate incoming race control messages
  useEffect(() => {
      const possibleMessages = [
          { msg: "TURN 1 - INCIDENT INVOLVING CAR 1 (VER) AND CAR 16 (LEC) - NOTED", cat: 'INCIDENT' },
          { msg: "CAR 55 (SAI) - TRACK LIMITS - TURN 19 - LAP TIME DELETED", cat: 'PENALTY' },
          { msg: "TURN 12 - YELLOW FLAG", cat: 'FLAG', status: 'YELLOW' },
          { msg: "TURN 12 - CLEAR", cat: 'FLAG', status: 'GREEN' },
          { msg: "CAR 63 (RUS) - 5 SECOND TIME PENALTY - SPEEDING IN PIT LANE", cat: 'PENALTY' },
          { msg: "TURN 4 - SLIPPERY SURFACE", cat: 'INFO' }
      ];

      const interval = setInterval(() => {
          const randomMsg = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          
          setMessages(prev => [{
              id: `msg-${Date.now()}`,
              time: timeString,
              message: randomMsg.msg,
              category: randomMsg.cat as any
          }, ...prev].slice(0, 50)); // Keep last 50

          // Update track status based on message
          if (randomMsg.status === 'YELLOW') setTrackStatus('YELLOW');
          if (randomMsg.status === 'GREEN') setTrackStatus('GREEN');

      }, 8000); // New message every 8 seconds

      return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
      switch(trackStatus) {
          case 'GREEN': return 'bg-[#10B981] shadow-[0_0_15px_#10B981]';
          case 'YELLOW': return 'bg-[#EAB308] shadow-[0_0_15px_#EAB308]';
          case 'RED': return 'bg-[#DC2626] shadow-[0_0_15px_#DC2626]';
          default: return 'bg-[#F97316] shadow-[0_0_15px_#F97316]'; // VSC/SC
      }
  };

  const getSeverityColor = (severity: string) => {
      switch(severity) {
          case 'High': return 'text-[#DC2626] border-[#DC2626]';
          case 'Medium': return 'text-[#F97316] border-[#F97316]';
          case 'Safe': return 'text-[#10B981] border-[#10B981]';
          default: return 'text-[#FBBF24] border-[#FBBF24]';
      }
  };

  const getSeverityBar = (severity: string, count: number) => {
      const max = 15;
      const pct = (count / max) * 100;
      const color = severity === 'High' ? 'bg-[#DC2626]' : severity === 'Medium' ? 'bg-[#F97316]' : 'bg-[#10B981]';
      
      return (
          <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden mt-2">
              <div className={`h-full ${color}`} style={{width: `${pct}%`}}></div>
          </div>
      );
  };

  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl flex flex-col hover:border-[#00D9FF] transition-all duration-300 backdrop-blur-sm h-full overflow-hidden">
        
        {/* Header Section */}
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold font-['Orbitron'] text-white flex items-center gap-2">
                    <Siren size={18} className="text-[#DC2626] animate-pulse" />
                    RACE CONTROL
                </h3>
                <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                    System Online
                </p>
            </div>
            
            {/* Status Indicator */}
            <div className={`px-4 py-1.5 rounded-md flex items-center gap-2 border border-white/10 ${getStatusColor()}`}>
                <Flag size={14} className="text-black fill-black" />
                <span className="text-xs font-black text-black tracking-widest">{trackStatus} FLAG</span>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#2A2A2A]">
            <button 
                onClick={() => setActiveTab('FEED')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'FEED' ? 'bg-[#222] text-white border-b-2 border-[#00D9FF]' : 'text-[#6B7280] hover:text-zinc-400'}`}
            >
                <FileText size={12} /> Live Feed
            </button>
            <button 
                onClick={() => setActiveTab('RISK')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'RISK' ? 'bg-[#222] text-white border-b-2 border-[#00D9FF]' : 'text-[#6B7280] hover:text-zinc-400'}`}
            >
                <ShieldAlert size={12} /> Risk Analysis
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
            
            {/* LIVE FEED VIEW */}
            {activeTab === 'FEED' && (
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {messages.map((msg, idx) => (
                        <div key={msg.id} className={`p-3 rounded border border-[#2A2A2A] bg-[#0F0F0F] hover:bg-[#151515] transition-colors flex gap-3 animate-in slide-in-from-left-2 duration-300 ${idx === 0 ? 'border-l-2 border-l-[#00D9FF]' : ''}`}>
                            <div className="flex flex-col items-center min-w-[40px]">
                                <span className="text-[10px] text-[#6B7280] font-mono mb-1">{msg.time}</span>
                                {msg.category === 'FLAG' && <Flag size={14} className="text-[#EAB308]" />}
                                {msg.category === 'PENALTY' && <AlertTriangle size={14} className="text-[#DC2626]" />}
                                {msg.category === 'INCIDENT' && <Activity size={14} className="text-[#F97316]" />}
                                {msg.category === 'INFO' && <CheckCircle2 size={14} className="text-[#3B82F6]" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold text-white font-mono leading-relaxed">
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* RISK ANALYSIS VIEW */}
            {activeTab === 'RISK' && (
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {TRACK_INCIDENTS.map((inc) => (
                        <div key={inc.id} className="group">
                            <div className="flex justify-between items-end mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white font-mono">{inc.turn}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold ${getSeverityColor(inc.severity)}`}>
                                        {inc.severity}
                                    </span>
                                </div>
                                <span className="text-[10px] text-[#6B7280] font-mono">{inc.count} REPO</span>
                            </div>
                            
                            {getSeverityBar(inc.severity, inc.count)}
                            
                            <div className="flex items-start gap-2 mt-2">
                                <ChevronRight size={12} className="text-[#6B7280] mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] text-[#9CA3AF] leading-tight group-hover:text-white transition-colors">
                                    {inc.description}
                                </p>
                            </div>
                            <div className="w-full h-px bg-[#222] mt-3"></div>
                        </div>
                    ))}
                    <div className="text-center pt-2">
                        <span className="text-[9px] text-[#444] font-mono uppercase">Historical Data / 2024 Season</span>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default TrackIncidents;
