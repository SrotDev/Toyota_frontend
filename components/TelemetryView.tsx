
import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateTelemetry, DRIVERS, RACE_RESULTS, LAP_HISTORY } from '../data';
import { Gauge, Map as MapIcon, Timer, ChevronDown, User, Activity, Zap, MousePointer2 } from 'lucide-react';

// Reusable Driver Headshot Component for Dropdowns
const DriverHeadshot = ({ url, alt }: { url?: string, alt: string }) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

    useEffect(() => {
        setImageStatus('loading');
        if (!url) {
            setImageStatus('error');
            return;
        }
        
        const img = new Image();
        img.src = url;
        img.onload = () => setImageStatus('loaded');
        img.onerror = () => setImageStatus('error');
    }, [url]);

    if (imageStatus === 'error') {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#222] text-[#666]">
                <User size={20} />
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            {imageStatus === 'loading' && (
                <div className="absolute inset-0 bg-[#333] animate-pulse rounded-full" />
            )}
            <img 
                src={url} 
                alt={alt}
                className={`w-full h-full object-cover object-top transform scale-125 translate-y-1 transition-all duration-500 group-hover:scale-110 ${imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

// New Reusable Lap Selector Component
const LapSelector = ({ 
    lap, 
    setLap, 
    bestLap, 
    driverId,
    color,
    align = 'left'
}: { 
    lap: number, 
    setLap: (l: number) => void, 
    bestLap: number,
    driverId: string,
    color: string,
    align?: 'left' | 'right'
}) => {
    const lapData = LAP_HISTORY.find(l => l.driverId === driverId && l.lap === lap);
    const time = lapData ? lapData.time.toFixed(3) : '--.--';
    const isPB = lap === bestLap;

    return (
        <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
                 <span className="text-[9px] text-[#6B7280] font-bold uppercase tracking-wider">SELECTED LAP</span>
                 {isPB && <span className="text-[8px] bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded font-bold border border-[#10B981]/20">PB</span>}
            </div>
            <div className={`flex items-center gap-3 bg-[#151515] rounded-lg px-3 py-1.5 border border-[#333] hover:border-zinc-500 transition-colors group min-w-[140px] justify-between`}>
                <div className="relative">
                    <select 
                        value={lap} 
                        onChange={(e) => setLap(Number(e.target.value))}
                        className="bg-transparent text-white text-xs font-mono font-bold focus:outline-none cursor-pointer appearance-none w-16 z-10 relative"
                    >
                        {Array.from({length: 15}, (_, i) => i + 1).map(l => (
                            <option key={l} value={l} className="bg-[#1A1A1A]">Lap {l}</option>
                        ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
                
                <div className="h-4 w-px bg-[#333]"></div>
                
                <span className="text-sm font-mono font-bold" style={{color: color, textShadow: `0 0 10px ${color}40`}}>
                    {time}<span className="text-[9px] text-zinc-500 ml-0.5">s</span>
                </span>
            </div>
            {/* Quick action to set PB if not selected */}
            {!isPB && (
                <button 
                    onClick={() => setLap(bestLap)}
                    className="text-[9px] text-zinc-500 hover:text-[#00D9FF] mt-1 flex items-center gap-1 transition-colors"
                >
                    Load Best Lap <Zap size={8} />
                </button>
            )}
        </div>
    );
};

const TelemetryView: React.FC = () => {
  const [metric, setMetric] = useState<'speed' | 'throttle' | 'brake' | 'rpm'>('speed');
  const [driverId1, setDriverId1] = useState<string>('d01'); 
  const [driverId2, setDriverId2] = useState<string>('d02'); 
  const [mapMode, setMapMode] = useState<'schematic' | '3d' | 'trace'>('trace');
  
  const [lap1, setLap1] = useState<number>(5);
  const [lap2, setLap2] = useState<number>(5);
  const [activeDist, setActiveDist] = useState<number | null>(null);
  const [activePoint, setActivePoint] = useState<any>(null);

  const driver1 = DRIVERS[driverId1];
  const driver2 = DRIVERS[driverId2];

  // Neutral Map Source (Wikimedia)
  const TRACK_MAP_SCHEMATIC = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/1200px-Austin_circuit.svg.png";
  const TRACK_MAP_3D = TRACK_MAP_SCHEMATIC; 

  const getBestLap = (dId: string) => {
      const driverLaps = LAP_HISTORY.filter(l => l.driverId === dId);
      if (driverLaps.length === 0) return 1;
      return driverLaps.reduce((prev, curr) => prev.time < curr.time ? prev : curr).lap;
  };

  const bestLap1 = useMemo(() => getBestLap(driverId1), [driverId1]);
  const bestLap2 = useMemo(() => getBestLap(driverId2), [driverId2]);

  // Set initial laps to PB on load
  useEffect(() => {
      setLap1(bestLap1);
  }, [bestLap1]);
  
  useEffect(() => {
      setLap2(bestLap2);
  }, [bestLap2]);

  const data = useMemo(() => {
    if (!driver1 || !driver2) return [];

    const d1Data = generateTelemetry(driverId1, lap1);
    const d2Data = generateTelemetry(driverId2, lap2);
    
    const length = Math.min(d1Data.length, d2Data.length);
    const combined = [];
    
    for(let i=0; i<length; i++) {
        combined.push({
            distance: d1Data[i].distance,
            [driver1.code]: d1Data[i][metric],
            [driver2.code]: d2Data[i][metric],
            d1Speed: d1Data[i].speed,
            d1Rpm: d1Data[i].rpm,
            d1Gear: d1Data[i].gear,
            d1Throttle: d1Data[i].throttle,
            d1Brake: d1Data[i].brake,
            x: d1Data[i].x,
            y: d1Data[i].y
        });
    }
    return combined;
  }, [driverId1, driverId2, metric, driver1?.code, driver2?.code, lap1, lap2]);

  const mapBounds = useMemo(() => {
      if (data.length === 0) return { minX: 0, minY: 0, width: 100, height: 100 };
      const xs = data.map(d => d.x);
      const ys = data.map(d => d.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const width = maxX - minX;
      const height = maxY - minY;
      const padding = Math.max(width, height) * 0.15;
      return {
          minX: minX - padding,
          minY: minY - padding,
          width: width + (padding * 2),
          height: height + (padding * 2)
      };
  }, [data]);

  const trackPath = useMemo(() => {
      if (data.length === 0) return "";
      return "M" + data.map(p => `${p.x},${p.y}`).join(" L ") + " Z";
  }, [data]);

  const ghostPos = useMemo(() => {
      if (activeDist === null || data.length === 0) return null;
      const closest = data.reduce((prev, curr) => 
        Math.abs(curr.distance - activeDist) < Math.abs(prev.distance - activeDist) ? curr : prev
      );
      return { x: closest.x, y: closest.y };
  }, [activeDist, data]);

  const d1LapData = LAP_HISTORY.find(l => l.driverId === driverId1 && l.lap === lap1) || LAP_HISTORY[0];
  const d2LapData = LAP_HISTORY.find(l => l.driverId === driverId2 && l.lap === lap2) || LAP_HISTORY[0];
  const driversList = RACE_RESULTS.map(r => DRIVERS[r.driverId]);

  const formatDelta = (v1: number, v2: number) => {
      const diff = v1 - v2;
      const absDiff = Math.abs(diff);
      const isFaster = diff < 0;
      const color = isFaster ? 'bg-[#10B981]' : 'bg-[#DC2626]';
      const textColor = isFaster ? 'text-[#10B981]' : 'text-[#DC2626]';
      const sign = diff > 0 ? '+' : '';
      
      const maxDeltaVisual = 1.0; 
      const barWidth = Math.min(100, (absDiff / maxDeltaVisual) * 100);

      return (
        <div className="flex flex-col justify-center w-full">
            <span className={`font-mono font-bold text-xs ${textColor} text-right`}>
                {sign}{diff.toFixed(3)}s
            </span>
            <div className="w-full h-1.5 bg-[#333] rounded-full mt-1 overflow-hidden flex justify-end">
                 <div 
                    className={`h-full ${color} transition-all duration-500`} 
                    style={{ width: `${barWidth}%`, opacity: 0.8, boxShadow: `0 0 8px ${isFaster ? '#10B981' : '#DC2626'}` }}
                 ></div>
            </div>
        </div>
      );
  };

  if (!driver1 || !driver2) return <div>Loading Drivers...</div>;

  // Custom Active Dot with Pulse Effect
  const CustomActiveDot = (props: any) => {
    const { cx, cy, stroke, fill } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={12} stroke={fill} strokeWidth={0} fill={fill} opacity={0.2}>
                <animate attributeName="r" from="8" to="16" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx={cx} cy={cy} r={5} stroke="#fff" strokeWidth={2} fill={fill} />
        </g>
    );
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#09090b]/95 border border-[#333] p-4 rounded-xl backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.9)] min-w-[200px]">
          <div className="flex items-center justify-between border-b border-[#333] pb-2 mb-3">
              <div className="flex items-center gap-2">
                  <Activity size={12} className="text-[#00D9FF]" />
                  <span className="text-[#9CA3AF] text-[10px] font-bold font-mono uppercase">TELEM_DATA</span>
              </div>
              <span className="text-white text-xs font-bold font-mono">{label}m</span>
          </div>
          <div className="space-y-3">
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{background: p.color, boxShadow: `0 0 8px ${p.color}`}}></div>
                        <span className="text-xs font-bold text-zinc-300">{p.name}</span>
                    </div>
                    <span className="text-sm font-mono font-bold" style={{color: p.color, textShadow: `0 0 10px ${p.color}40`}}>
                        {p.value}
                        <span className="text-[9px] text-[#6B7280] ml-1 uppercase">
                            {metric === 'rpm' ? 'RPM' : metric === 'speed' ? 'KM/H' : '%'}
                        </span>
                    </span>
                </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      {/* Controls Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-[#1A1A1A]/95 backdrop-blur border border-[#2A2A2A] p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#00D9FF]/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full xl:w-auto">
            <h2 className="text-2xl font-bold font-['Orbitron'] text-white flex items-center gap-3">
                <Gauge className="text-[#00D9FF]" size={24} />
                TELEMETRY COMPARISON
            </h2>
             <div className="flex bg-[#0F0F0F] p-1 rounded-lg border border-[#333] mt-4 w-fit">
                {(['speed', 'throttle', 'brake', 'rpm'] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMetric(m)}
                        className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                            metric === m 
                            ? 'bg-[#00D9FF] text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]' 
                            : 'text-[#6B7280] hover:text-white hover:bg-[#222]'
                        }`}
                    >
                        {m}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto items-center relative z-10">
             
             <div className="flex items-center gap-6 bg-[#0F0F0F] p-4 rounded-2xl border border-[#333] shadow-inner w-full md:w-auto justify-between md:justify-start">
                {/* Driver 1 Config */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#222] border-2 border-[#333] flex items-center justify-center relative group shadow-lg">
                        <DriverHeadshot url={driver1.headshotUrl} alt={driver1.code} />
                        <div className="absolute bottom-0 left-0 right-0 h-1" style={{background: driver1.teamColor}}></div>
                    </div>
                    <div className="flex flex-col">
                        <div className="relative group mb-1">
                            <select 
                                value={driverId1} 
                                onChange={(e) => setDriverId1(e.target.value)}
                                className="bg-transparent text-white text-base font-bold focus:outline-none cursor-pointer appearance-none pr-6 w-full hover:text-[#00D9FF] transition-colors"
                            >
                                {driversList.map(d => <option key={d.id} value={d.id} className="bg-[#1A1A1A]">{d.name}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                        </div>
                        <LapSelector 
                            lap={lap1} 
                            setLap={setLap1} 
                            bestLap={bestLap1} 
                            driverId={driverId1} 
                            color={driver1.teamColor} 
                        />
                    </div>
                </div>

                <div className="h-16 w-px bg-[#333] mx-2 hidden md:block"></div>
                
                {/* Driver 2 Config */}
                <div className="flex items-center gap-4 flex-row-reverse md:flex-row">
                    <div className="flex flex-col items-end md:items-start">
                        <div className="relative group mb-1 text-right md:text-left w-full">
                            <select 
                                value={driverId2} 
                                onChange={(e) => setDriverId2(e.target.value)}
                                className="bg-transparent text-white text-base font-bold focus:outline-none cursor-pointer appearance-none pr-6 w-full hover:text-[#00D9FF] transition-colors text-right md:text-left"
                                style={{ direction: 'ltr' }}
                            >
                                {driversList.map(d => <option key={d.id} value={d.id} className="bg-[#1A1A1A]">{d.name}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                        </div>
                        <LapSelector 
                            lap={lap2} 
                            setLap={setLap2} 
                            bestLap={bestLap2} 
                            driverId={driverId2} 
                            color={driver2.teamColor}
                            align="right"
                        />
                    </div>
                     <div className="w-12 h-12 rounded-full overflow-hidden bg-[#222] border-2 border-[#333] flex items-center justify-center relative group shadow-lg">
                        <DriverHeadshot url={driver2.headshotUrl} alt={driver2.code} />
                        <div className="absolute bottom-0 left-0 right-0 h-1" style={{background: driver2.teamColor}}></div>
                    </div>
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Main Chart */}
          <div className="xl:col-span-2 bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 min-h-[500px] relative overflow-hidden group hover:border-[#00D9FF] transition-all duration-300 flex flex-col shadow-2xl">
            
            {/* Floating Legend */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-[#0A0A0A]/80 backdrop-blur p-4 rounded-xl border border-[#333] pointer-events-none shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{background: driver1.teamColor, boxShadow: `0 0 8px ${driver1.teamColor}`}}></div>
                    <span className="text-xs font-bold text-white">{driver1.code}</span>
                    <span className="text-[10px] bg-[#222] text-[#9CA3AF] px-1.5 py-0.5 rounded font-mono">L{lap1}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{background: driver2.teamColor, boxShadow: `0 0 8px ${driver2.teamColor}`}}></div>
                    <span className="text-xs font-bold text-white">{driver2.code}</span>
                    <span className="text-[10px] bg-[#222] text-[#9CA3AF] px-1.5 py-0.5 rounded font-mono">L{lap2}</span>
                </div>
            </div>

            {/* Live Gauge Overlay */}
            {activePoint && (
                <div className="absolute top-6 left-6 z-20 flex gap-4">
                    <div className="w-20 h-20 bg-[#0A0A0A]/80 rounded-2xl border border-[#333] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
                        <span className="text-[10px] text-[#6B7280] font-bold uppercase">Speed</span>
                        <span className="text-xl font-bold font-mono text-white">{activePoint.d1Speed}</span>
                        <span className="text-[8px] text-[#4B5563] font-bold">KM/H</span>
                    </div>
                     <div className="w-20 h-20 bg-[#0A0A0A]/80 rounded-2xl border border-[#333] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
                        <span className="text-[10px] text-[#6B7280] font-bold uppercase">Gear</span>
                        <span className="text-2xl font-bold font-mono text-[#00D9FF] drop-shadow-[0_0_5px_rgba(0,217,255,0.5)]">{activePoint.d1Gear}</span>
                    </div>
                     <div className="w-20 h-20 bg-[#0A0A0A]/80 rounded-2xl border border-[#333] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-md relative overflow-hidden">
                         <div className="absolute bottom-0 left-0 right-0 bg-[#00D9FF]/20 h-full transition-all duration-75" style={{height: `${(activePoint.d1Throttle / 100) * 100}%`}}></div>
                        <span className="text-[10px] text-[#6B7280] font-bold uppercase relative z-10">Throttle</span>
                        <span className="text-xl font-bold font-mono text-white relative z-10">{activePoint.d1Throttle}%</span>
                    </div>
                </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                    data={data} 
                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                    onMouseMove={(e: any) => {
                        if (e && e.activeLabel !== undefined && e.activeLabel !== null) {
                            setActiveDist(Number(e.activeLabel));
                            if (e.activePayload && e.activePayload.length > 0) {
                                setActivePoint(e.activePayload[0].payload);
                            }
                        }
                    }}
                    onMouseLeave={() => {
                        setActiveDist(null);
                        setActivePoint(null);
                    }}
                >
                    <defs>
                        <linearGradient id="colorD1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={driver1.teamColor} stopOpacity={0.6}/>
                            <stop offset="95%" stopColor={driver1.teamColor} stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorD2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={driver2.teamColor} stopOpacity={0.6}/>
                            <stop offset="95%" stopColor={driver2.teamColor} stopOpacity={0.05}/>
                        </linearGradient>
                        <filter id="neonGlowD1" height="130%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                            <feFlood floodColor={driver1.teamColor} result="color"/>
                            <feComposite in="color" in2="blur" operator="in" result="shadow"/>
                            <feMerge>
                                <feMergeNode in="shadow"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                         <filter id="neonGlowD2" height="130%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                            <feFlood floodColor={driver2.teamColor} result="color"/>
                            <feComposite in="color" in2="blur" operator="in" result="shadow"/>
                            <feMerge>
                                <feMergeNode in="shadow"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="2 4" stroke="#333" vertical={false} strokeOpacity={0.3} />
                    <XAxis 
                        dataKey="distance" 
                        stroke="#444" 
                        tick={{fill: '#666', fontSize: 10, fontWeight: 600, fontFamily: 'monospace'}} 
                        tickFormatter={(val) => `${val}`}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={60}
                        interval="preserveStartEnd"
                    />
                    <YAxis 
                        stroke="#444" 
                        tick={{fill: '#666', fontSize: 10, fontWeight: 600, fontFamily: 'monospace'}}
                        domain={metric === 'speed' ? [0, 360] : metric === 'rpm' ? [0, 13000] : [0, 100]}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#fff', strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.5 }}
                        isAnimationActive={false}
                    />
                    <Area 
                        type="monotone" 
                        dataKey={driver1.code} 
                        stroke={driver1.teamColor} 
                        fillOpacity={1} 
                        fill="url(#colorD1)" 
                        strokeWidth={3}
                        style={{ filter: `drop-shadow(0 0 6px ${driver1.teamColor})` }}
                        activeDot={<CustomActiveDot />}
                        animationDuration={1000}
                    />
                    <Area 
                        type="monotone" 
                        dataKey={driver2.code} 
                        stroke={driver2.teamColor} 
                        fillOpacity={1} 
                        fill="url(#colorD2)" 
                        strokeWidth={3}
                        style={{ filter: `drop-shadow(0 0 6px ${driver2.teamColor})` }}
                        activeDot={<CustomActiveDot />}
                        animationDuration={1000}
                    />
                </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Track Map & Stats Column */}
          <div className="flex flex-col gap-6">
              
              {/* Map Card with Image Toggle */}
              <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden flex-1 min-h-[350px] flex flex-col hover:border-[#00D9FF] transition-all duration-300">
                  <div className="flex items-center justify-between mb-4 z-10">
                      <h3 className="text-white font-bold font-['Orbitron'] flex items-center gap-2">
                        <MapIcon size={18} className="text-[#00D9FF]" />
                        TRACK VISUALIZATION
                      </h3>
                      <div className="flex bg-[#0F0F0F] rounded-lg p-0.5 border border-[#333]">
                          <button onClick={() => setMapMode('trace')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${mapMode === 'trace' ? 'bg-[#222] text-white shadow-sm' : 'text-[#6B7280] hover:text-white'}`}>Live</button>
                          <button onClick={() => setMapMode('3d')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${mapMode === '3d' ? 'bg-[#222] text-white shadow-sm' : 'text-[#6B7280] hover:text-white'}`}>3D Map</button>
                          <button onClick={() => setMapMode('schematic')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${mapMode === 'schematic' ? 'bg-[#222] text-white shadow-sm' : 'text-[#6B7280] hover:text-white'}`}>Layout</button>
                      </div>
                  </div>
                  
                  <div className="flex-1 relative flex items-center justify-center bg-[#000]/20 rounded-xl">
                       {mapMode === 'trace' && (
                           <svg 
                             viewBox={`${mapBounds.minX} ${mapBounds.minY} ${mapBounds.width} ${mapBounds.height}`} 
                             className="w-full h-full p-4 transition-all duration-500"
                             preserveAspectRatio="xMidYMid meet"
                           >
                              <defs>
                                  <filter id="glowMap" x="-20%" y="-20%" width="140%" height="140%">
                                      <feGaussianBlur stdDeviation="3" result="blur" />
                                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                  </filter>
                                  <linearGradient id="trackGradient" gradientTransform="rotate(90)">
                                      <stop offset="0%" stopColor={driver1.teamColor} />
                                      <stop offset="100%" stopColor={driver2.teamColor} />
                                  </linearGradient>
                              </defs>
                              <path d={trackPath} fill="none" stroke="transparent" strokeWidth={0} />
                              <image href={TRACK_MAP_SCHEMATIC} x={mapBounds.minX} y={mapBounds.minY} width={mapBounds.width} height={mapBounds.height} opacity="0.3" preserveAspectRatio="xMidYMid meet" style={{ filter: 'grayscale(100%) invert(100%)' }} />

                              <path d={trackPath} fill="none" stroke={driver1.teamColor} strokeWidth={mapBounds.width * 0.01} strokeOpacity={0.8} strokeLinecap="round" strokeLinejoin="round" filter="url(#glowMap)"/>
                              <path d={trackPath} fill="none" stroke={driver2.teamColor} strokeWidth={mapBounds.width * 0.01} strokeOpacity={0.8} strokeLinecap="round" strokeLinejoin="round"/>
                              
                              {ghostPos && (
                                  <>
                                    <circle cx={ghostPos.x} cy={ghostPos.y} r={mapBounds.width * 0.03} fill={driver1.teamColor} opacity={0.5} className="animate-ping"/>
                                    <circle cx={ghostPos.x} cy={ghostPos.y} r={mapBounds.width * 0.015} fill="#FFFFFF" stroke={driver1.teamColor} strokeWidth={2} className="shadow-[0_0_15px_white]"/>
                                  </>
                              )}
                           </svg>
                       )}
                       
                       {mapMode === '3d' && (
                           <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
                               <img 
                                    src={TRACK_MAP_3D} 
                                    alt="Circuit 3D" 
                                    className="w-full h-full object-contain grayscale invert"
                                    style={{ filter: 'brightness(1.2) contrast(1.2) grayscale(100%) invert(100%)' }}
                               />
                           </div>
                       )}

                       {mapMode === 'schematic' && (
                           <div className="w-full h-full flex items-center justify-center p-2 overflow-hidden">
                               <img 
                                    src={TRACK_MAP_SCHEMATIC} 
                                    alt="Circuit Schematic" 
                                    className="w-full h-full object-contain grayscale invert"
                                    style={{ filter: 'brightness(1.1) grayscale(100%) invert(100%)' }}
                               />
                           </div>
                       )}
                  </div>
              </div>

              {/* Sector Deltas */}
              <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00D9FF] transition-all duration-300">
                 <h3 className="text-white font-bold font-['Orbitron'] mb-4 flex items-center gap-2">
                     <Timer size={18} className="text-[#00D9FF]" />
                     SECTOR DELTA ANALYSIS
                 </h3>
                 <div className="overflow-hidden rounded-xl border border-[#333]">
                     <table className="w-full text-sm text-left">
                         <thead className="text-xs text-[#6B7280] uppercase bg-[#0F0F0F] font-bold">
                             <tr>
                                 <th className="px-4 py-3">Sector</th>
                                 <th className="px-4 py-3" style={{color: driver1.teamColor}}>{driver1.code} <span className="text-[9px] opacity-70 ml-1">L{lap1}</span></th>
                                 <th className="px-4 py-3" style={{color: driver2.teamColor}}>{driver2.code} <span className="text-[9px] opacity-70 ml-1">L{lap2}</span></th>
                                 <th className="px-4 py-3 text-right">Delta Gap</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-[#222] bg-[#111]">
                             <tr className="hover:bg-[#1A1A1A] transition-colors">
                                 <td className="px-4 py-3 text-[#9CA3AF] font-medium">Sector 1</td>
                                 <td className="px-4 py-3 font-mono font-bold">{d1LapData.s1}</td>
                                 <td className="px-4 py-3 font-mono font-bold">{d2LapData.s1}</td>
                                 <td className="px-4 py-3 w-40">{formatDelta(d1LapData.s1, d2LapData.s1)}</td>
                             </tr>
                             <tr className="hover:bg-[#1A1A1A] transition-colors">
                                 <td className="px-4 py-3 text-[#9CA3AF] font-medium">Sector 2</td>
                                 <td className="px-4 py-3 font-mono font-bold">{d1LapData.s2}</td>
                                 <td className="px-4 py-3 font-mono font-bold">{d2LapData.s2}</td>
                                 <td className="px-4 py-3 w-40">{formatDelta(d1LapData.s2, d2LapData.s2)}</td>
                             </tr>
                             <tr className="hover:bg-[#1A1A1A] transition-colors">
                                 <td className="px-4 py-3 text-[#9CA3AF] font-medium">Sector 3</td>
                                 <td className="px-4 py-3 font-mono font-bold">{d1LapData.s3}</td>
                                 <td className="px-4 py-3 font-mono font-bold">{d2LapData.s3}</td>
                                 <td className="px-4 py-3 w-40">{formatDelta(d1LapData.s3, d2LapData.s3)}</td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default TelemetryView;
