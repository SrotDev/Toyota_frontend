
import React from 'react';
import CircuitMap from './CircuitMap';
import DriverAnalysis from './DriverAnalysis';
import LiveStandings from './LiveStandings';
import TelemetryGauges from './TelemetryGauges';
import WeatherConditions from './WeatherConditions';
import DriverComparison from './DriverComparison';
import DeltaAnalysis from './DeltaAnalysis';
import TrackIncidents from './TrackIncidents';
import AttackZones from './AttackZones';
import StrategyWindows from './StrategyWindows';

const DashboardView: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-700">
        
        {/* COLUMN 1: LEFT PANEL (3 cols) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
            {/* 4. DRIVER ANALYSIS */}
            <div className="h-[500px]">
                <DriverAnalysis />
            </div>
            
            {/* 12. LIVE STANDINGS */}
            <div className="flex-1 min-h-[450px]">
                <LiveStandings />
            </div>
        </div>

        {/* COLUMN 2: CENTER PANEL (6 cols) */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-6">
             
             {/* 3. CIRCUIT MAP */}
             <div className="h-[450px]">
                 <CircuitMap />
             </div>

             {/* 11. TELEMETRY GAUGES */}
             <TelemetryGauges />

             {/* 6. DRIVER COMPARISON & 7. DELTA ANALYSIS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
                 <DriverComparison />
                 <DeltaAnalysis />
             </div>
             
             {/* 10. STRATEGY WINDOWS */}
             <div>
                 <StrategyWindows />
             </div>
        </div>

        {/* COLUMN 3: RIGHT PANEL (3 cols) */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
            
            {/* 5. WEATHER CONDITIONS */}
            <div>
                <WeatherConditions />
            </div>

            {/* 8. TRACK INCIDENTS */}
            <div>
                <TrackIncidents />
            </div>

            {/* 9. ATTACK ZONES */}
            <div className="flex-1 min-h-[400px]">
                 <AttackZones />
            </div>

        </div>

    </div>
  );
};

export default DashboardView;
