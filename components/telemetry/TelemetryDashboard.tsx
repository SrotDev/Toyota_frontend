
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TelemetryPoint, CoachingSuggestion } from '../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Brain, Layers, AlertCircle, TrendingUp } from 'lucide-react';

const TelemetryDashboard = ({ trackId, navigate }: { trackId: string, navigate: (p: string) => void }) => {
    const [tab, setTab] = useState<'COMPARE' | 'HEATMAP' | 'COACHING'>('COMPARE');
    const [idealData, setIdealData] = useState<TelemetryPoint[]>([]);
    const [userData, setUserData] = useState<TelemetryPoint[]>([]);
    const [suggestions, setSuggestions] = useState<CoachingSuggestion[]>([]);

    useEffect(() => {
        api.telemetry.getIdeal(trackId).then(setIdealData);
        api.telemetry.getUser('last-session').then(setUserData);
        api.telemetry.getCoaching('last-session').then(setSuggestions);
    }, [trackId]);

    // Merge data for chart
    const chartData = idealData.map((ideal, i) => ({
        distance: ideal.distance,
        idealSpeed: ideal.speed,
        userSpeed: userData[i]?.speed || null,
        idealThrottle: ideal.throttle,
        userThrottle: userData[i]?.throttle || null,
        idealBrake: ideal.brake,
        userBrake: userData[i]?.brake || null,
    }));

    return (
        <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-[#0A0A0A] p-4 rounded-xl border border-[#2A2A2A]">
                <div>
                    <h2 className="text-2xl font-bold text-white font-['Orbitron']">TELEMETRY STUDIO</h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">Comparing Session 14 vs Ideal Model</p>
                </div>
                <div className="flex bg-[#111] p-1 rounded-lg border border-[#333]">
                    {['COMPARE', 'HEATMAP', 'COACHING'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setTab(t as any)}
                            className={`px-4 py-2 rounded text-xs font-bold transition-all ${tab === t ? 'bg-[#00D9FF] text-black' : 'text-zinc-500 hover:text-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
                
                {/* Charts Area */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Speed Trace */}
                    <div className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col min-h-[300px]">
                        <h3 className="text-sm font-bold text-zinc-400 mb-2 flex items-center gap-2"><TrendingUp size={16}/> SPEED TRACE</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="gradIdeal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="distance" stroke="#444" tick={false} />
                                <YAxis stroke="#444" width={40} tick={{fill: '#666', fontSize: 10}} />
                                <Tooltip contentStyle={{backgroundColor: '#111', borderColor: '#333', color: '#fff'}} />
                                <Area type="monotone" dataKey="idealSpeed" stroke="#00D9FF" fill="url(#gradIdeal)" strokeWidth={2} name="Ideal" />
                                <Area type="monotone" dataKey="userSpeed" stroke="#EF4444" fill="transparent" strokeWidth={2} name="You" strokeDasharray="4 4" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Inputs Trace */}
                    <div className="h-48 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col">
                        <h3 className="text-sm font-bold text-zinc-400 mb-2 flex items-center gap-2"><Layers size={16}/> INPUTS (THROTTLE / BRAKE)</h3>
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <XAxis dataKey="distance" stroke="#444" tick={{fontSize: 10, fill: '#666'}} label={{value: 'Distance (m)', position: 'insideBottom', offset: -5, fill: '#666', fontSize: 10}} />
                                <YAxis hide />
                                <Tooltip contentStyle={{backgroundColor: '#111', borderColor: '#333', color: '#fff'}} />
                                {/* Throttle */}
                                <Area type="step" dataKey="idealThrottle" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={1} />
                                <Area type="step" dataKey="userThrottle" stroke="#10B981" fill="transparent" strokeWidth={1} strokeDasharray="2 2" />
                                {/* Brake */}
                                <Area type="step" dataKey="idealBrake" stroke="#DC2626" fill="#DC2626" fillOpacity={0.1} strokeWidth={1} />
                                <Area type="step" dataKey="userBrake" stroke="#DC2626" fill="transparent" strokeWidth={1} strokeDasharray="2 2" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sidebar / Coaching */}
                <div className="lg:col-span-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 overflow-y-auto">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Brain className="text-purple-500" />
                        AI COACH
                    </h3>

                    <div className="space-y-4">
                        {suggestions.map((s) => (
                            <div key={s.id} className="bg-[#111] p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">{s.turn}</span>
                                    <span className={`text-[10px] font-bold uppercase ${s.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`}>{s.severity} PRIORITY</span>
                                </div>
                                <p className="text-sm text-zinc-300 leading-snug mb-3">{s.message}</p>
                                <div className="flex items-center gap-2 text-xs text-green-400 font-mono bg-green-900/10 p-2 rounded">
                                    <TrendingUp size={12} /> Potential Gain: -{s.gain}s
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-purple-400 mt-1" size={16} />
                            <div>
                                <h4 className="text-sm font-bold text-purple-400 mb-1">Consistency Check</h4>
                                <p className="text-xs text-zinc-400">Your throttle application in Sector 2 is 15% more aggressive than the optimal line, causing rear instability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TelemetryDashboard;
