
import React from 'react';
import { Thermometer, Wind, Droplet, Gauge, Compass, AlertTriangle } from 'lucide-react';
import { CURRENT_WEATHER } from '../data';

const WeatherConditions: React.FC = () => {
  return (
    <div className="bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#00D9FF] transition-all duration-300 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold font-['Orbitron'] text-white">WEATHER CONDITIONS</h3>
            <AlertTriangle size={18} className="text-[#DC2626]" />
        </div>
        <div className="grid grid-cols-3 gap-4">
             {/* Row 1 */}
             <div className="bg-[#0F0F0F] p-3 rounded-lg border border-[#222]">
                 <div className="flex items-center gap-2 mb-1">
                    <Thermometer size={14} className="text-[#DC2626]" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">AIR TEMP</span>
                 </div>
                 <div className="text-lg font-bold font-mono text-white">{CURRENT_WEATHER.airTemp}°C</div>
             </div>
             <div className="bg-[#0F0F0F] p-3 rounded-lg border border-[#222]">
                 <div className="flex items-center gap-2 mb-1">
                    <Droplet size={14} className="text-[#3B82F6]" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">HUMIDITY</span>
                 </div>
                 <div className="text-lg font-bold font-mono text-white">{CURRENT_WEATHER.humidity}%</div>
             </div>
             <div className="bg-[#0F0F0F] p-3 rounded-lg border border-[#222]">
                 <div className="flex items-center gap-2 mb-1">
                    <Wind size={14} className="text-[#00D9FF]" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">WIND</span>
                 </div>
                 <div className="text-lg font-bold font-mono text-white">{CURRENT_WEATHER.windSpeed} <span className="text-xs">km/h</span></div>
             </div>

             {/* Row 2 */}
             <div className="bg-[#0F0F0F] p-3 rounded-lg border border-[#222]">
                 <div className="flex items-center gap-2 mb-1">
                    <Thermometer size={14} className="text-[#F97316]" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">TRACK TEMP</span>
                 </div>
                 <div className="text-lg font-bold font-mono text-white">{CURRENT_WEATHER.trackTemp}°C</div>
             </div>
             <div className="bg-[#0F0F0F] p-3 rounded-lg border border-[#222]">
                 <div className="flex items-center gap-2 mb-1">
                    <Gauge size={14} className="text-[#FFFFFF]" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">PRESSURE</span>
                 </div>
                 <div className="text-lg font-bold font-mono text-white">{CURRENT_WEATHER.pressure} hPa</div>
             </div>
             <div className="bg-[#0F0F0F] p-3 rounded-lg border border-[#222]">
                 <div className="flex items-center gap-2 mb-1">
                    <Compass size={14} className="text-[#9CA3AF]" />
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase">WIND DIR</span>
                 </div>
                 <div className="text-lg font-bold font-mono text-white">{CURRENT_WEATHER.windDirection}</div>
             </div>
        </div>
    </div>
  );
};

export default WeatherConditions;
