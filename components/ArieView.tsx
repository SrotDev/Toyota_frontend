
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Brain, Cpu, Zap, ShieldAlert, TrendingUp, Activity, CheckCircle2, AlertTriangle, Layers, Target, BarChart2 } from 'lucide-react';
import { DRIVERS, RACE_RESULTS } from '../data';
import { 
    runMultiScenarioSimulation, 
    generateStrategyMatrix, 
    analyzeDriverSignature, 
    detectDriverFatigue, 
    forecastOpponentRisks, 
    analyzeTrackState,
    StrategyOptionV2
} from '../services/arie';

const ArieView: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState('d01');
  const driver = DRIVERS[selectedDriver];
  
  // Fetch ARIE-V2 Data
  const simulations = runMultiScenarioSimulation(selectedDriver);
  const strategyMatrix = generateStrategyMatrix(selectedDriver);
  const signature = analyzeDriverSignature(selectedDriver);
  const fatigue = detectDriverFatigue(selectedDriver);
  const alerts = forecastOpponentRisks(selectedDriver);
  const trackState = analyzeTrackState();

  // Format Chart Data: Combine scenarios into one dataset
  const chartData = simulations[1].laps.map((lap, idx) => ({
      lap: lap.lap,
      optimistic: simulations[0].laps[idx].time,
      realistic: simulations[1].laps[idx].time,
      pessimistic: simulations[2].laps[idx].time,
  }));

  // Format Radar Data
  const radarData = [
      { subject: 'Braking', A: signature.brakingAggression, fullMark: 100 },
      { subject: 'Throttle', A: signature.throttleSmoothness, fullMark: 100 },
      { subject: 'Stability', A: signature.corneringStability, fullMark: 100 },
      { subject: 'Consistency', A: 100 - fatigue.consistencyScore, fullMark: 100 }, // Invert score for chart
      { subject: 'Focus', A: 100 - signature.errorTendency, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
        
        {/* HEADER: ARIE V2 STATUS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A0A0A] p-6 rounded-2xl border border-zinc-800 relative overflow-hidden group">
             {/* Holographic Background Effect */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
             
             <div className="relative z-10">
                 <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-['Orbitron']">
                     <Brain className="text-indigo-500 animate-pulse" size={32} />
                     ARIE <span className="text-indigo-400">V2</span>
                 </h2>
                 <p className="text-zinc-500 mt-1 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                     Adaptive Race Intelligence Engine • Online
                 </p>
             </div>

             <div className="flex items-center gap-4 relative z-10">
                 <div className="flex flex-col items-end">
                     <span className="text-[10px] text-zinc-500 font-bold uppercase mb-1">TARGET DRIVER</span>
                     <select 
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        className="bg-[#111] text-white border border-zinc-700 rounded px-3 py-1.5 text-sm font-bold focus:border-indigo-500 outline-none cursor-pointer min-w-[150px]"
                     >
                         {Object.values(DRIVERS).map(d => <option key={d.id} value={d.id}>{d.code} - {d.name}</option>)}
                     </select>
                 </div>
                 <div className="w-12 h-12 rounded-full border-2 border-indigo-500 p-0.5 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                     <img src={driver.headshotUrl} className="w-full h-full object-cover rounded-full bg-zinc-800" alt={driver.code} />
                 </div>
             </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-12 gap-6">

            {/* COL 1: MSSS & STRATEGY (8 cols) */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">
                
                {/* 1. MSSS CHART */}
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-white font-bold font-['Orbitron'] flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-400" />
                                MSSS SIMULATION
                            </h3>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Multi-Scenario Simulation System • 5 Lap Projection</p>
                        </div>
                        <div className="flex gap-4">
                            {simulations.map(sim => (
                                <div key={sim.type} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ background: sim.color }}></div>
                                    <span className="text-[10px] font-bold text-zinc-400">{sim.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradOpt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#FBBF24" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="gradPess" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="lap" stroke="#444" tick={{fill: '#666', fontSize: 10}} label={{ value: 'PREDICTED LAPS', position: 'insideBottom', offset: -5, fill: '#444', fontSize: 10 }} />
                                <YAxis domain={['auto', 'auto']} stroke="#444" tick={{fill: '#666', fontSize: 10}} width={40} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#333', color: '#fff' }}
                                    itemStyle={{ fontSize: 12, fontFamily: 'monospace' }}
                                    formatter={(val: number) => [`${val.toFixed(3)}s`, 'Pace']}
                                    labelFormatter={(label) => `Lap ${label}`}
                                />
                                <Area type="monotone" dataKey="optimistic" stroke="#10B981" fill="url(#gradOpt)" strokeWidth={2} strokeDasharray="4 4" />
                                <Area type="monotone" dataKey="realistic" stroke="#FBBF24" fill="url(#gradReal)" strokeWidth={3} />
                                <Area type="monotone" dataKey="pessimistic" stroke="#EF4444" fill="url(#gradPess)" strokeWidth={2} strokeDasharray="4 4" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. LSCM MATRIX */}
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold font-['Orbitron'] flex items-center gap-2 mb-4">
                        <Layers size={18} className="text-blue-400" />
                        LIVE STRATEGY CONFIDENCE MATRIX (LSCM)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {strategyMatrix.map((opt) => (
                            <div 
                                key={opt.id} 
                                className={`
                                    p-4 rounded-xl border-2 transition-all relative overflow-hidden group
                                    ${opt.recommendation === 'RECOMMENDED' ? 'bg-blue-900/10 border-blue-500' : 
                                      opt.recommendation === 'AVOID' ? 'bg-red-900/5 border-red-900/30 opacity-60' : 
                                      'bg-zinc-900/50 border-zinc-800'}
                                `}
                            >
                                {opt.recommendation === 'RECOMMENDED' && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl">ARIE PICK</div>
                                )}
                                
                                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{opt.recommendation}</div>
                                <div className="text-lg font-bold text-white mb-2">{opt.name}</div>
                                
                                <div className="flex justify-between items-center mb-3 text-xs">
                                    <span className="text-zinc-400">Gain/Loss</span>
                                    <span className="font-mono font-bold text-white">{opt.gainLoss}</span>
                                </div>
                                
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500">
                                        <span>Confidence</span>
                                        <span>{opt.confidence}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${opt.confidence > 80 ? 'bg-green-500' : opt.confidence > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${opt.confidence}%`}}></div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-zinc-400 leading-tight border-t border-zinc-800 pt-2 mt-2">
                                    {opt.reasoning}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* COL 2: INTELLIGENCE & ALERTS (4 cols) */}
            <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

                {/* 3. CDBM DRIVER SIGNATURE */}
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-bold font-['Orbitron'] flex items-center gap-2">
                            <Cpu size={18} className="text-purple-400" />
                            DRIVER SIGNATURE
                        </h3>
                        <span className="text-[10px] bg-purple-900/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
                            {signature.profileType.toUpperCase()}
                        </span>
                    </div>

                    <div className="h-[250px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                             <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                 <PolarGrid stroke="#333" />
                                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
                                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                 <Radar name={driver.code} dataKey="A" stroke="#A855F7" strokeWidth={2} fill="#A855F7" fillOpacity={0.3} />
                             </RadarChart>
                         </ResponsiveContainer>
                         <div className="absolute bottom-0 right-0 text-right">
                             <div className="text-[10px] text-zinc-500 uppercase font-bold">SFPD STATUS</div>
                             <div className={`text-sm font-bold ${fatigue.level === 'OPTIMAL' ? 'text-green-500' : 'text-red-500'}`}>
                                 {fatigue.level}
                             </div>
                         </div>
                    </div>
                </div>

                {/* 4. TRACK STATE (TSL) */}
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-6">
                     <h3 className="text-white font-bold font-['Orbitron'] flex items-center gap-2 mb-4">
                        <Activity size={18} className="text-orange-400" />
                        TRACK STATE (TSL)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-center">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase">CONDITION</div>
                            <div className="text-white font-bold mt-1">{trackState.condition.replace('_', ' ')}</div>
                        </div>
                         <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-center">
                            <div className="text-[10px] text-zinc-500 font-bold uppercase">GRIP TREND</div>
                            <div className="text-orange-400 font-bold mt-1">{trackState.gripTrend}</div>
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] text-zinc-400 flex items-center gap-2">
                        <AlertTriangle size={12} className="text-orange-400" />
                        Critical Sector: {trackState.criticalSector}
                    </div>
                </div>

                {/* 5. INTELLIGENCE FEED (OBF) */}
                <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl p-6 flex-1 min-h-[300px] flex flex-col">
                    <h3 className="text-white font-bold font-['Orbitron'] flex items-center gap-2 mb-4">
                        <ShieldAlert size={18} className="text-red-400" />
                        INTELLIGENCE FEED
                    </h3>
                    
                    <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar pr-2">
                        {alerts.length === 0 ? (
                            <div className="text-center text-zinc-600 text-xs py-10 italic">No critical anomalies detected.</div>
                        ) : (
                            alerts.map(alert => (
                                <div key={alert.id} className="bg-zinc-900/80 p-3 rounded-lg border-l-2 border-red-500">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-red-400 bg-red-900/20 px-1.5 rounded">{alert.type}</span>
                                        <span className="text-[9px] text-zinc-500 font-mono">NOW</span>
                                    </div>
                                    <p className="text-xs text-zinc-300 leading-snug">{alert.message}</p>
                                </div>
                            ))
                        )}
                        {/* Static Example alerts if feed empty for demo */}
                        {alerts.length === 0 && (
                             <div className="bg-zinc-900/30 p-3 rounded-lg border-l-2 border-zinc-700 opacity-50">
                                <span className="text-[9px] font-bold text-zinc-500">SYSTEM</span>
                                <p className="text-xs text-zinc-500">Scanning for opponent patterns...</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div>
    </div>
  );
};

export default ArieView;
