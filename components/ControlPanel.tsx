
import React, { useState, useEffect } from 'react';
import { Pause, Play, Upload, BarChart2, Activity, Check, Wifi, Zap, Database, Cpu } from 'lucide-react';

const ControlPanel: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [highFreqMode, setHighFreqMode] = useState(false);
  const [hexStream, setHexStream] = useState<string[]>([]);

  // Generate random hex stream for visual effect
  useEffect(() => {
      if (isUploading) {
          const interval = setInterval(() => {
              const newHex = Array.from({length: 8}, () => 
                  `0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0')}`
              );
              setHexStream(newHex);
          }, 100);
          return () => clearInterval(interval);
      }
  }, [isUploading]);

  const handleUpload = () => {
      setIsUploading(true);
      setUploadSuccess(false);
      
      // Sequence duration extended to 4.5s for the full "Magical" GIF effect
      setTimeout(() => {
          setIsUploading(false);
          setUploadSuccess(true);
          setHighFreqMode(true); // "Something new" appears - Dashboard Upgrade
          setTimeout(() => setUploadSuccess(false), 3000);
      }, 4500);
  };

  return (
    <>
        {/* CSS for the Magic Animation */}
        <style>{`
            @keyframes scanline {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
            @keyframes glitch {
                0% { clip-path: inset(40% 0 61% 0); }
                20% { clip-path: inset(92% 0 1% 0); }
                40% { clip-path: inset(43% 0 1% 0); }
                60% { clip-path: inset(25% 0 58% 0); }
                80% { clip-path: inset(54% 0 7% 0); }
                100% { clip-path: inset(58% 0 43% 0); }
            }
            .cyber-glitch {
                animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
            }
            @keyframes pulse-ring {
                0% { transform: scale(0.8); opacity: 0.5; }
                100% { transform: scale(2); opacity: 0; }
            }
        `}</style>

        {/* FULL SCREEN HOLOGRAPHIC OVERLAY WITH GIF */}
        {isUploading && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
                
                {/* Background GIF Layer - UPDATED SOURCE */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://drive.google.com/uc?export=download&id=1dvLREVf-bvl" 
                        className="w-full h-full object-cover opacity-90"
                        alt="Data Sync Simulation"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center w-full max-w-4xl p-10">
                    
                    {/* Status Text */}
                    <h2 className="text-6xl font-bold font-['Orbitron'] text-white mb-4 tracking-widest cyber-glitch drop-shadow-[0_0_30px_rgba(0,217,255,0.8)] text-center">
                        SYNCING DATA
                    </h2>
                    <div className="flex flex-wrap justify-center gap-2 mt-8 w-full opacity-80">
                        {hexStream.slice(0, 4).map((hex, i) => (
                            <div key={i} className="text-xs font-mono text-[#00D9FF] font-bold tracking-[0.2em] bg-black/80 border border-[#00D9FF]/30 px-4 py-2 rounded backdrop-blur-md">
                                ESTABLISHING_CONNECTION_ID::{hex}
                            </div>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-2xl h-2 bg-[#1A1A1A] border border-[#333] rounded-full mt-12 overflow-hidden relative box-content shadow-[0_0_20px_rgba(0,0,0,1)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent w-full animate-shimmer"></div>
                        <div className="h-full bg-[#00D9FF] animate-loading-bar shadow-[0_0_20px_#00D9FF]"></div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-3 animate-pulse">
                         <Wifi size={14} className="text-[#10B981]" />
                         <span className="text-xs text-[#10B981] font-mono tracking-widest uppercase">Strictly Connected to Pit Wall</span>
                    </div>

                    <p className="text-[10px] text-zinc-400 mt-8 font-mono bg-black/50 px-3 py-1 rounded">SECURE ENCRYPTION KEY VERIFIED</p>
                </div>
            </div>
        )}

        <div className={`h-16 border-b transition-colors duration-700 ${highFreqMode ? 'bg-[#0a0a0a] border-[#00D9FF]/20' : 'bg-[#0F0F0F] border-[#2A2A2A]'} px-6 flex items-center justify-between relative z-40 shadow-lg`}>
            {/* Left Controls */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setIsPaused(!isPaused)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 active:scale-95 ${isPaused ? 'bg-[#10B981] hover:bg-[#059669] shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#DC2626] hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)]'} text-white`}
                >
                    {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                    <span className="text-xs font-bold tracking-wider">{isPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}</span>
                </button>
                <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className={`group relative overflow-hidden flex items-center gap-2 px-4 py-2 border text-[#FFFFFF] rounded-md transition-all duration-300 active:scale-95 disabled:opacity-80 disabled:cursor-wait ${
                        uploadSuccess 
                        ? 'bg-[#10B981]/20 border-[#10B981] text-[#10B981]' 
                        : 'bg-[#1A1A1A] hover:bg-[#252525] border-[#2A2A2A] hover:border-[#00D9FF]'
                    }`}
                >
                    {/* Button Glare Effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>

                    {isUploading ? (
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : uploadSuccess ? (
                        <Check size={14} />
                    ) : (
                        <Upload size={14} className="group-hover:text-[#00D9FF] transition-colors" />
                    )}
                    <span className="text-xs font-bold tracking-wider group-hover:text-[#00D9FF] transition-colors">
                        {isUploading ? 'SYNCING...' : uploadSuccess ? 'DATA LINKED' : 'UPLOAD DATA'}
                    </span>
                </button>
                <div className={`flex items-center gap-2 px-3 py-1.5 bg-[#10B981]/20 border border-[#10B981]/50 rounded-full ml-2 transition-all duration-500 ${isPaused ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                    <div className={`w-2 h-2 bg-[#10B981] rounded-full ${!isPaused && 'animate-pulse'}`}></div>
                    <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">CONNECTED</span>
                </div>
            </div>

            {/* Right Controls - This Updates Post-Upload */}
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-md">
                    <BarChart2 size={14} className="text-[#DC2626]" />
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider">20 DRIVERS ACTIVE</span>
               </div>
               
               {/* THE NEW DASHBOARD INDICATORS: Reveals after upload */}
               {highFreqMode ? (
                   <>
                       <div className="animate-in zoom-in duration-500 flex items-center gap-2 px-3 py-1.5 bg-[#A855F7]/20 border border-[#A855F7] rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                            <Cpu size={14} className="text-[#A855F7] animate-pulse" />
                            <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider">AI PREDICTION: ACTIVE</span>
                       </div>
                       <div className="animate-in slide-in-from-top-4 duration-700 flex items-center gap-2 px-3 py-1.5 bg-[#00D9FF] border border-[#00D9FF] rounded-md shadow-[0_0_25px_rgba(0,217,255,0.6)]">
                            <Zap size={14} className="text-black fill-black animate-bounce" />
                            <span className="text-[10px] font-bold text-black uppercase tracking-wider">HIGH FREQUENCY (100Hz)</span>
                       </div>
                   </>
               ) : (
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00D9FF]/10 border border-[#00D9FF]/30 rounded-md">
                        <Activity size={14} className="text-[#00D9FF]" />
                        <span className="text-[10px] font-bold text-[#00D9FF] uppercase tracking-wider">REAL-TIME DATA</span>
                   </div>
               )}
               
               {highFreqMode && (
                   <div className="animate-in fade-in duration-1000 text-[9px] font-mono text-[#6B7280] ml-2">
                       v.3.1.0-PRO
                   </div>
               )}
            </div>
        </div>
    </>
  );
};

export default ControlPanel;
