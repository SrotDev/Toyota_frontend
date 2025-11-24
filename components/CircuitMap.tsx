
import React, { useState, useMemo } from 'react';
import { OVERTAKING_ZONES, CIRCUIT_STATS, generateTelemetry } from '../data';
import { Map as MapIcon, Zap, X, Target, Flag, Crosshair, MousePointer2 } from 'lucide-react';

const ZONE_RANGES: Record<number, { start: number, end: number }> = {
    1: { start: 0.42, end: 0.62 }, // Backstraight
    2: { start: 0.11, end: 0.15 }, // T1
    3: { start: 0.62, end: 0.66 }, // T12
    4: { start: 0.88, end: 0.92 }, // T19
    5: { start: 0.38, end: 0.42 }, // T11
};

// Neutral Map Source (Wikimedia)
const TRACK_MAP_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/1200px-Austin_circuit.svg.png";

const CircuitMap: React.FC = () => {
  const [activeSector, setActiveSector] = useState<'ALL' | 'S1' | 'S2' | 'S3'>('ALL');
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);
  const [mapMode, setMapMode] = useState<'trace' | '3d' | 'schematic'>('trace');

  const displayZoneId = hoveredZoneId !== null ? hoveredZoneId : selectedZoneId;
  const displayZone = OVERTAKING_ZONES.find(z => z.id === displayZoneId);
  
  // Use generic GR cup driver ID
  const mapData = useMemo(() => generateTelemetry('d01', 1), []);

  const bounds = useMemo(() => {
      const xs = mapData.map(p => p.x);
      const ys = mapData.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const padding = 50;
      return {
          minX: minX - padding,
          minY: minY - padding,
          width: (maxX - minX) + (padding * 2),
          height: (maxY - minY) + (padding * 2)
      };
  }, [mapData]);

  const fullTrackPath = useMemo(() => {
      return "M" + mapData.map(p => `${p.x},${p.y}`).join(" L ") + " Z";
  }, [mapData]);

  const getZonePath = (startPct: number, endPct: number) => {
      const startIndex = Math.floor(startPct * mapData.length);
      const endIndex = Math.floor(endPct * mapData.length);
      const segment = mapData.slice(startIndex, endIndex + 1);
      if (segment.length === 0) return "";
      return "M" + segment.map(p => `${p.x},${p.y}`).join(" L ");
  };

  const getZoneCenter = (startPct: number, endPct: number) => {
      const midIndex = Math.floor(((startPct + endPct) / 2) * mapData.length);
      return mapData[midIndex] || mapData[0];
  };

  const visibleZones = OVERTAKING_ZONES.filter(z => {
      if (activeSector === 'ALL') return true;
      if (activeSector === 'S1' && [2].includes(z.id)) return true;
      if (activeSector === 'S2' && [1, 5].includes(z.id)) return true;
      if (activeSector === 'S3' && [3, 4].includes(z.id)) return true;
      return false;
  });

  const getOvertakeDelta = (difficulty: string) => {
      switch(difficulty) {
          case 'Low': return { val: '> 0.3s', color: 'text-[#10B981]' };
          case 'Moderate': return { val: '> 0.5s', color: 'text-[#FBBF24]' };
          case 'High': return { val: '> 0.8s', color: 'text-[#DC2626]' };
          default: return { val: 'N/A', color: 'text-gray-400' };
      }
  };

  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] backdrop-blur-sm rounded-2xl flex flex-col hover:border-[#00D9FF] transition-all duration-300 relative overflow-hidden h-full shadow-2xl">
      
      <div className="p-6 pb-2 flex justify-between items-start z-10 relative">
        <div>
            <h3 className="text-lg font-bold font-['Orbitron'] text-white flex items-center gap-2">
                <MapIcon size={18} className="text-[#00D9FF]" />
                TACTICAL MAP - COTA
            </h3>
            <p className="text-xs text-[#6B7280] font-bold tracking-wider mt-1 flex items-center gap-2">
                <span>{CIRCUIT_STATS.length}</span> • <span>{CIRCUIT_STATS.turns} TURNS</span> • <span>GR CUP</span>
            </p>
        </div>
        
        <div className="flex gap-2 bg-[#0F0F0F] p-1 rounded-lg border border-[#333] shadow-inner">
             {(['ALL', 'S1', 'S2', 'S3'] as const).map((sec) => (
                 <button 
                    key={sec}
                    onClick={() => setActiveSector(sec)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 ${
                        activeSector === sec 
                        ? sec === 'S1' ? 'bg-[#DC2626] text-white' : sec === 'S2' ? 'bg-[#3B82F6] text-white' : sec === 'S3' ? 'bg-[#FBBF24] text-black' : 'bg-white text-black'
                        : 'text-[#6B7280] hover:text-white'
                    }`}
                 >
                     {sec}
                 </button>
             ))}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-20 flex gap-2">
          <div className="flex bg-[#0F0F0F] rounded-lg p-0.5 border border-[#333] shadow-lg">
              <button onClick={() => setMapMode('trace')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${mapMode === 'trace' ? 'bg-[#222] text-white' : 'text-[#6B7280] hover:text-white'}`}>Live</button>
              <button onClick={() => setMapMode('schematic')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${mapMode === 'schematic' ? 'bg-[#222] text-white' : 'text-[#6B7280] hover:text-white'}`}>Map</button>
          </div>
      </div>

      <div className="flex-1 relative w-full h-full overflow-hidden bg-[#0A0A0A] group/map cursor-grab active:cursor-grabbing">
        
        <div className="absolute inset-0 flex items-center justify-center p-4 select-none z-0 animate-in fade-in duration-700">
            <img 
                src={TRACK_MAP_IMAGE} 
                className={`w-full h-full object-contain transition-all duration-500 ${mapMode === 'trace' ? 'opacity-100 filter brightness-110 grayscale invert' : 'opacity-100 grayscale invert'}`}
                alt="Circuit Background" 
                style={{ maxWidth: '95%', maxHeight: '95%' }}
            />
        </div>

        {mapMode === 'trace' && (
            <div className="absolute inset-0 flex items-center justify-center animate-in fade-in duration-500 z-10">
                 <svg 
                     viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`} 
                     className="w-full h-full relative z-10"
                     preserveAspectRatio="xMidYMid meet"
                 >
                    <defs>
                        <filter id="glowZone" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <path d={fullTrackPath} fill="none" stroke="transparent" strokeWidth={0} />

                    {visibleZones.map(zone => {
                        const range = ZONE_RANGES[zone.id];
                        if (!range) return null;
                        const center = getZoneCenter(range.start, range.end);
                        const color = zone.difficulty === 'High' ? '#DC2626' : zone.difficulty === 'Moderate' ? '#FBBF24' : '#10B981';
                        const isSelected = displayZoneId === zone.id;
                        const isHovered = hoveredZoneId === zone.id;
                        const isActive = isSelected || isHovered;

                        return (
                            <g key={zone.id}>
                                 <path 
                                    d={getZonePath(range.start, range.end)} 
                                    fill="none" 
                                    stroke={color}
                                    strokeWidth={isActive ? bounds.width * 0.015 : bounds.width * 0.01} 
                                    strokeOpacity={isActive ? 1 : 0.6}
                                    strokeLinecap="round"
                                    className="transition-all duration-300 ease-out"
                                    filter={isActive ? "url(#glowZone)" : ""}
                                />
                                
                                <g 
                                    onClick={() => setSelectedZoneId(zone.id)}
                                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                                    onMouseLeave={() => setHoveredZoneId(null)}
                                    className="cursor-pointer"
                                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                                >
                                    {/* Pulse Animation */}
                                    <circle cx={center.x} cy={center.y} r={bounds.width * 0.04} fill={color} opacity={0}>
                                        {isActive && <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />}
                                        {isActive && <animate attributeName="r" from={bounds.width * 0.02} to={bounds.width * 0.05} dur="1.5s" repeatCount="indefinite" />}
                                    </circle>
                                    
                                    {/* Solid Background for Number */}
                                    <circle 
                                        cx={center.x} 
                                        cy={center.y} 
                                        r={bounds.width * 0.018} 
                                        fill="#111" 
                                        stroke={color} 
                                        strokeWidth={isActive ? 3 : 1.5}
                                        className="transition-all duration-300"
                                    />
                                    
                                    {/* Number Text */}
                                    <text 
                                        x={center.x} 
                                        y={center.y} 
                                        dy="0.35em" 
                                        textAnchor="middle" 
                                        fill="white" 
                                        fontSize={bounds.width * 0.012} 
                                        fontWeight="bold"
                                        fontFamily="monospace"
                                        pointerEvents="none"
                                    >
                                        {zone.positionNumber}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                 </svg>
            </div>
        )}

        {(mapMode === 'schematic' || mapMode === '3d') && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-[10px] text-zinc-400 z-20">
                Static View • Switch to Live for Interactive Markers
            </div>
        )}

        {displayZone && mapMode === 'trace' && (
            <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-[#0A0A0A]/95 border border-[#00D9FF]/30 p-0 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-in slide-in-from-bottom-4 zoom-in-95 z-30 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#00D9FF] via-white to-[#00D9FF]"></div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]`}></span>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wide">{displayZone.name}</h4>
                            </div>
                            <p className="text-[10px] text-[#9CA3AF] leading-relaxed">{displayZone.description}</p>
                        </div>
                        {selectedZoneId === displayZone.id && (
                            <button onClick={(e) => { e.stopPropagation(); setSelectedZoneId(null); }} className="text-[#6B7280] hover:text-white p-1.5 bg-[#222] hover:bg-[#333] rounded-lg">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#111] rounded-lg p-2 border border-[#222] flex flex-col items-center justify-center">
                            <div className="text-[8px] text-[#6B7280] uppercase font-bold mb-1">DIFFICULTY</div>
                            <div className={`text-xs font-bold ${displayZone.difficulty === 'Low' ? 'text-[#10B981]' : displayZone.difficulty === 'High' ? 'text-[#DC2626]' : 'text-[#FBBF24]'}`}>
                                {displayZone.difficulty.toUpperCase()}
                            </div>
                        </div>
                         <div className="bg-[#111] rounded-lg p-2 border border-[#222] flex flex-col items-center justify-center">
                            <div className="text-[8px] text-[#6B7280] uppercase font-bold mb-1">DELTA REQ.</div>
                            <div className={`text-xs font-bold ${getOvertakeDelta(displayZone.difficulty).color}`}>
                                {getOvertakeDelta(displayZone.difficulty).val}
                            </div>
                        </div>
                        <div className="bg-[#111] rounded-lg p-2 border border-[#222] flex flex-col justify-center items-center">
                            <div className="text-[8px] text-[#6B7280] uppercase font-bold mb-1">ACTION</div>
                            <div className="flex items-center gap-1 text-[#F97316] text-xs font-bold"><Target size={12}/> BRAKE</div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-[#2A2A2A] flex justify-between items-center bg-[#0F0F0F]/80 backdrop-blur text-[10px] font-bold relative z-10">
            <div className="flex items-center gap-2">
                <Flag size={12} className="text-[#9CA3AF]" />
                <span className="text-[#9CA3AF]">LAP RECORD: <span className="text-white font-mono tracking-wider">{CIRCUIT_STATS.lapRecord}</span></span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]">
                <MousePointer2 size={12} />
                <span>HOVER ZONES FOR DATA</span>
            </div>
      </div>
    </div>
  );
};

export default CircuitMap;
