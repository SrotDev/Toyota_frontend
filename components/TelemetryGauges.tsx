
import React, { useEffect, useState } from 'react';

const CircularGauge = ({ label, value, unit, max, color }: { label: string, value: number, unit?: string, max: number, color: string }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;

    return (
        <div className="flex flex-col items-center justify-center bg-[#1A1A1A]/95 border border-[#2A2A2A] rounded-2xl p-6 backdrop-blur-sm hover:border-[#00D9FF] transition-all duration-300">
            <div className="relative w-32 h-32 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background track */}
                    <circle cx="64" cy="64" r={radius} stroke="#2A2A2A" strokeWidth="8" fill="transparent" />
                    {/* Progress arc */}
                    <circle 
                        cx="64" 
                        cy="64" 
                        r={radius} 
                        stroke={color} 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold font-mono ${color === '#00D9FF' ? 'text-[#00D9FF]' : 'text-white'}`}>
                        {Math.floor(value)}
                    </span>
                    {unit && <span className="text-xs text-[#6B7280] font-bold mt-1">{unit}</span>}
                </div>
            </div>
            <span className="text-xs font-bold text-white mb-1">{label}</span>
            <span className="text-[10px] text-[#00D9FF] font-bold tracking-wider">REAL-TIME DATA</span>
        </div>
    );
};

const TelemetryGauges: React.FC = () => {
  const [data, setData] = useState({ speed: 179, throttle: 59, brake: 27, gear: 7 });

  useEffect(() => {
      const interval = setInterval(() => {
          setData(prev => ({
              speed: Math.min(340, Math.max(60, prev.speed + (Math.random() * 10 - 5))),
              throttle: Math.min(100, Math.max(0, prev.throttle + (Math.random() * 10 - 5))),
              brake: Math.random() > 0.8 ? Math.random() * 40 : 0,
              gear: 7 // Keeping static as per mock or dynamic if needed
          }));
      }, 100);
      return () => clearInterval(interval);
  }, []);

  return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <CircularGauge label="SPEED" value={data.speed} unit="km/h" max={360} color="#00D9FF" />
          <CircularGauge label="THROTTLE" value={data.throttle} unit="%" max={100} color="#00D9FF" />
          <CircularGauge label="BRAKE PRESSURE" value={data.brake} unit="bar" max={100} color="#00D9FF" />
          <CircularGauge label="GEAR" value={data.gear} max={8} color="#00D9FF" />
      </div>
  );
};

export default TelemetryGauges;
