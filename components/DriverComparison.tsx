
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DRIVERS, LAP_HISTORY } from '../data';
import { ChevronDown, TrendingUp, Trophy, Activity, Zap, Timer } from 'lucide-react';

const DriverComparison: React.FC = () => {
  const [driver1Id, setDriver1Id] = useState('d01'); // Corrected default
  const [driver2Id, setDriver2Id] = useState('d02'); // Corrected default
  const [hoveredDriver, setHoveredDriver] = useState<string | null>(null);

  const d1 = DRIVERS[driver1Id];
  const d2 = DRIVERS[driver2Id];

  // Comparison Colors - High Contrast Neon
  const COLOR_D1 = '#00D9FF'; // Electric Cyan
  const COLOR_D2 = '#D946EF'; // Neon Fuchsia

  // Process data for comparison
  const chartData = useMemo(() => {
    const d1Laps = LAP_HISTORY.filter(l => l.driverId === driver1Id).sort((a,b) => a.lap - b.lap);
    const d2Laps = LAP_HISTORY.filter(l => l.driverId === driver2Id).sort((a,b) => a.lap - b.lap);
    
    const data = [];
    const maxLaps = Math.min(d1Laps.length, d2Laps.length);
    
    for(let i=0; i<maxLaps; i++) {
        data.push({
            lap: d1Laps[i].lap,
            [d1.code]: d1Laps[i].time,
            [d2.code]: d2Laps[i].time,
            delta: d1Laps[i].time - d2Laps[i].time
        });
    }
    return data;
  }, [driver1Id, driver2Id, d1.code, d2.code]);

  // Calculate summary stats including sectors
  const stats = useMemo(() => {
     const calcStats = (id: string) => {
         const laps = LAP_HISTORY.filter(l => l.driverId === id);
         const best = laps.length ? Math.min(...laps.map(l => l.time)) : 0;
         const avg = laps.length ? laps.reduce((a,b) => a + b.time, 0) / laps.length : 0;
         const s1 = laps.length ? laps.reduce((a,b) => a + b.s1, 0) / laps.length : 0;
         const s2 = laps.length ? laps.reduce((a,b) => a + b.s2, 0) / laps.length : 0;
         const s3 = laps.length ? laps.reduce((a,b) => a + b.s3, 0) / laps.length : 0;
         
         return { 
             best: best.toFixed(3), 
             avg: avg.toFixed(3),
             s1, s2, s3
         };
     };
     return { d1: calcStats(driver1Id), d2: calcStats(driver2Id) };
  }, [driver1Id, driver2Id]);

  // -- Custom Components --

  // Tooltip Logic for Stats Card
  const SectorTooltip = ({ baseStats, compareStats, opponentName }: { baseStats: any, compareStats: any, opponentName: string }) => {
      const getDelta = (v1: number, v2: number) => v1 - v2;
      
      const s1Delta = getDelta(baseStats.s1, compareStats.s1);
      const s2Delta = getDelta(baseStats.s2, compareStats.s2);
      const s3Delta = getDelta(baseStats.s3, compareStats.s3);
      const avgDelta = getDelta(parseFloat(baseStats.avg), parseFloat(compareStats.avg));

      const Row = ({ label, val }: { label: string, val: number }) => (
        <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-bold tracking-wider text-[10px]">{label}</span>
            <span className={`font-mono font-bold ${val <= 0 ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
                {val > 0 ? '+' : ''}{val.toFixed(3)}s
            </span>
        </div>
      );

      return (
          <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-md z-20 p-4 flex flex-col justify-center gap-2 animate-in fade-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">VS {opponentName}</span>
                  <Timer size={12} className="text-zinc-600" />
             </div>
             <div className="space-y-1.5">
                <Row label="SECTOR 1" val={s1Delta} />
                <Row label="SECTOR 2" val={s2Delta} />
                <Row label="SECTOR 3" val={s3Delta} />
             </div>
             <div className="border-t border-zinc-800 pt-2 mt-1">
                 <Row label="AVG LAP DELTA" val={avgDelta} />
             </div>
          </div>
      );
  };

  // Pulsing Neon Dot for Active State
  const CustomActiveDot = (props: any) => {
      const { cx, cy, stroke, fill } = props;
      return (
          <g>
              <circle cx={cx} cy={cy} r={8} fill={fill} fillOpacity={0.2}>
                  <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="fill-opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r={4} stroke="#fff" strokeWidth={2} fill={fill} />
              <filter id={`glow-${fill}`}>
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                  </feMerge>
              </filter>
          </g>
      );
  };

  // Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
          return (
              <div className="bg-[#09090b]/80 border border-white/10 p-4 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-md min-w-[220px]">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">LAP {label}</span>
                      <Activity size={14} className="text-zinc-500" />
                  </div>
                  <div className="space-y-3">
                    {payload.map((p: any, idx: number) => (
                        <div key={p.name} className="flex items-center justify-between gap-4 group">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full shadow-[0_0_8px]" style={{background: p.stroke, boxShadow: `0 0 8px ${p.stroke}`}}></div>
                                <span className={`text-xs font-bold font-mono ${idx === 0 ? 'text-cyan-400' : 'text-fuchsia-400'}`}>{p.name}</span>
                            </div>
                            <span className="text-sm font-mono font-bold text-white">
                                {p.value.toFixed(3)} <span className="text-[10px] text-zinc-500">s</span>
                            </span>
                        </div>
                    ))}
                  </div>
                  {payload.length === 2 && (
                      <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">PACE DELTA</span>
                          <span className="text-xs font-mono font-bold text-white">
                              {Math.abs(payload[0].value - payload[1].value).toFixed(3)}s
                          </span>
                      </div>
                  )}
              </div>
          );
      }
      return null;
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-0 hover:border-[#00D9FF]/30 transition-all duration-500 h-full flex flex-col group overflow-hidden shadow-2xl relative">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        {/* Header Section */}
        <div className="p-5 pb-0 relative z-10">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00D9FF]/10 rounded-lg border border-[#00D9FF]/20 shadow-[0_0_15px_rgba(0,217,255,0.15)]">
                        <TrendingUp size={18} className="text-[#00D9FF]"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-['Orbitron'] text-white tracking-wide">
                            PACE COMPARISON
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Live Telemetry Overlay</p>
                    </div>
                </div>
                
                {/* Driver Selectors */}
                <div className="flex items-center bg-[#111] rounded-lg p-1 border border-[#333] shadow-inner">
                     {/* Driver 1 Selector */}
                     <div className="relative group/select">
                         <select 
                            value={driver1Id} 
                            onChange={e => setDriver1Id(e.target.value)} 
                            className="bg-transparent text-white text-[10px] font-bold rounded px-3 py-1.5 pr-7 appearance-none outline-none hover:text-cyan-400 cursor-pointer transition-colors"
                         >
                             {Object.values(DRIVERS).map(d => <option key={d.id} value={d.id} className="bg-[#1A1A1A]">{d.code}</option>)}
                         </select>
                         <ChevronDown size={10} className="text-zinc-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                         <div className="absolute bottom-0 left-2 right-2 h-[2px] shadow-[0_0_8px_rgba(0,217,255,0.5)]" style={{background: COLOR_D1}}></div>
                     </div>

                     <span className="text-[9px] text-zinc-600 font-bold px-2 font-mono">VS</span>

                     {/* Driver 2 Selector */}
                     <div className="relative group/select">
                         <select 
                            value={driver2Id} 
                            onChange={e => setDriver2Id(e.target.value)} 
                            className="bg-transparent text-white text-[10px] font-bold rounded px-3 py-1.5 pr-7 appearance-none outline-none hover:text-fuchsia-400 cursor-pointer transition-colors"
                         >
                             {Object.values(DRIVERS).map(d => <option key={d.id} value={d.id} className="bg-[#1A1A1A]">{d.code}</option>)}
                         </select>
                         <ChevronDown size={10} className="text-zinc-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                         <div className="absolute bottom-0 left-2 right-2 h-[2px] shadow-[0_0_8px_rgba(217,70,239,0.5)]" style={{background: COLOR_D2}}></div>
                     </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-2">
                {/* Card 1 */}
                <div 
                    className={`relative overflow-hidden bg-[#111] rounded-xl p-3 border transition-all duration-300 cursor-help ${hoveredDriver === d1.code ? 'border-cyan-500/50 bg-cyan-900/10' : 'border-[#222] hover:border-[#333]'}`}
                    onMouseEnter={() => setHoveredDriver(d1.code)}
                    onMouseLeave={() => setHoveredDriver(null)}
                >
                    {hoveredDriver === d1.code && (
                        <SectorTooltip baseStats={stats.d1} compareStats={stats.d2} opponentName={d2.code} />
                    )}

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center overflow-hidden shadow-lg">
                                <img src={d1.headshotUrl} className="w-full h-full object-cover transform scale-125 translate-y-1" alt={d1.code}/>
                             </div>
                             <div>
                                 <div className="text-[9px] text-zinc-500 font-bold">AVG PACE</div>
                                 <div className="text-sm font-mono font-bold text-white">{stats.d1.avg}s</div>
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[9px] text-zinc-500 font-bold flex items-center gap-1 justify-end">
                                BEST <Zap size={8} className="text-cyan-400 fill-cyan-400"/>
                             </div>
                             <div className="text-xs font-mono font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(0,217,255,0.5)]">{stats.d1.best}s</div>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div 
                    className={`relative overflow-hidden bg-[#111] rounded-xl p-3 border transition-all duration-300 cursor-help ${hoveredDriver === d2.code ? 'border-fuchsia-500/50 bg-fuchsia-900/10' : 'border-[#222] hover:border-[#333]'}`}
                    onMouseEnter={() => setHoveredDriver(d2.code)}
                    onMouseLeave={() => setHoveredDriver(null)}
                >
                    {hoveredDriver === d2.code && (
                        <SectorTooltip baseStats={stats.d2} compareStats={stats.d1} opponentName={d1.code} />
                    )}

                     <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center overflow-hidden shadow-lg">
                                <img src={d2.headshotUrl} className="w-full h-full object-cover transform scale-125 translate-y-1" alt={d2.code}/>
                             </div>
                             <div>
                                 <div className="text-[9px] text-zinc-500 font-bold">AVG PACE</div>
                                 <div className="text-sm font-mono font-bold text-white">{stats.d2.avg}s</div>
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[9px] text-zinc-500 font-bold flex items-center gap-1 justify-end">
                                BEST <Zap size={8} className="text-fuchsia-400 fill-fuchsia-400"/>
                             </div>
                             <div className="text-xs font-mono font-bold text-fuchsia-400 drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">{stats.d2.best}s</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 w-full min-h-0 relative mt-4">
            {/* Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradD1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLOR_D1} stopOpacity={0.4}/>
                            <stop offset="70%" stopColor={COLOR_D1} stopOpacity={0.05}/>
                            <stop offset="100%" stopColor={COLOR_D1} stopOpacity={0}/>
                        </linearGradient>
                        <filter id="neonGlowD1" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>

                        <linearGradient id="gradD2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={COLOR_D2} stopOpacity={0.4}/>
                            <stop offset="70%" stopColor={COLOR_D2} stopOpacity={0.05}/>
                            <stop offset="100%" stopColor={COLOR_D2} stopOpacity={0}/>
                        </linearGradient>
                         <filter id="neonGlowD2" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    <CartesianGrid stroke="#222" strokeDasharray="2 4" vertical={false} strokeOpacity={0.5} />
                    
                    <XAxis 
                        dataKey="lap" 
                        stroke="#333" 
                        tick={{fill: '#52525b', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 600}} 
                        tickLine={false} 
                        axisLine={false}
                        interval={5}
                        tickMargin={10}
                    />
                    
                    <YAxis hide domain={['auto', 'auto']} />
                    
                    <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{stroke: '#fff', strokeDasharray: '3 3', strokeOpacity: 0.1, strokeWidth: 1}} 
                        isAnimationActive={false}
                    />
                    
                    <Area 
                        type="monotone" 
                        dataKey={d1.code} 
                        stroke={COLOR_D1} 
                        strokeWidth={3} 
                        fill={`url(#gradD1)`} 
                        fillOpacity={1}
                        filter="url(#neonGlowD1)"
                        activeDot={<CustomActiveDot fill={COLOR_D1} />}
                        animationDuration={1500}
                        animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{
                            opacity: hoveredDriver && hoveredDriver !== d1.code ? 0.1 : 1,
                            transition: 'opacity 0.4s ease-in-out'
                        }}
                    />
                    
                    <Area 
                        type="monotone" 
                        dataKey={d2.code} 
                        stroke={COLOR_D2} 
                        strokeWidth={3} 
                        fill={`url(#gradD2)`} 
                        fillOpacity={1}
                        filter="url(#neonGlowD2)"
                        activeDot={<CustomActiveDot fill={COLOR_D2} />}
                        animationDuration={1500}
                        animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
                        style={{
                            opacity: hoveredDriver && hoveredDriver !== d2.code ? 0.1 : 1,
                            transition: 'opacity 0.4s ease-in-out'
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default DriverComparison;
