import React from 'react';
import { Activity, Flame, Layers, Route } from 'lucide-react';

const TelemetryDashboard = ({ trackId, navigate }: { trackId: string; navigate: (p: string) => void }) => {
  const links = [
    { label: 'Ideal curves', path: `/tracks/${trackId}/telemetry/ideal`, description: 'Braking, throttle, steering from ideal laps', icon: Activity },
    { label: 'Compare user vs ideal', path: `/tracks/${trackId}/telemetry/compare`, description: 'Overlay uploaded telemetry against ideal', icon: Layers },
    { label: 'Heatmap', path: `/tracks/${trackId}/telemetry/heatmap`, description: 'Mistake intensity per turn', icon: Flame },
    { label: 'Racing line', path: `/tracks/${trackId}/telemetry/racing-line`, description: 'Visualize optimal path', icon: Route },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link) => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className="bg-[#0b0f1a] border border-[#1f2a44] rounded-xl p-5 text-left hover:border-[#72E8FF] transition-colors"
        >
          <div className="flex items-center gap-3 text-[#8fb5ff] text-xs font-semibold uppercase">
            <link.icon size={14} /> {link.label}
          </div>
          <p className="text-sm text-zinc-300 mt-2">{link.description}</p>
        </button>
      ))}
    </div>
  );
};

export default TelemetryDashboard;