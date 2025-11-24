
import { Driver, LapData, RaceResult, TelemetryPoint, DriverStats, WeatherCondition, OvertakingZone, StrategyOption, TrackIncident } from './types';

// Updated to Generic GR Cup Drivers to avoid F1 misattribution in a spec series context
// Headshots updated to procedural avatars to remove F1 artifacts
export const DRIVERS: Record<string, Driver> = {
  d01: { id: 'd01', code: 'JON', number: 22, name: 'Alex Jones', teamColor: '#D90429', teamName: 'TechSport Racing', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=Alex+Jones&background=D90429&color=fff&size=256' },
  d02: { id: 'd02', code: 'SMI', number: 9, name: 'Sam Smith', teamColor: '#D90429', teamName: 'TechSport Racing', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=Sam+Smith&background=D90429&color=fff&size=256' },
  d03: { id: 'd03', code: 'LEE', number: 33, name: 'Chris Lee', teamColor: '#FB8500', teamName: 'Copeland Mspt', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=Chris+Lee&background=FB8500&color=fff&size=256' },
  d04: { id: 'd04', code: 'DAV', number: 12, name: 'Tom Davis', teamColor: '#FB8500', teamName: 'Copeland Mspt', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=Tom+Davis&background=FB8500&color=fff&size=256' },
  d05: { id: 'd05', code: 'WIL', number: 88, name: 'Mike Wilson', teamColor: '#219EBC', teamName: 'Smooge Racing', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=Mike+Wilson&background=219EBC&color=fff&size=256' },
  d06: { id: 'd06', code: 'BRO', number: 44, name: 'Dan Brown', teamColor: '#219EBC', teamName: 'Smooge Racing', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=Dan+Brown&background=219EBC&color=fff&size=256' },
  d07: { id: 'd07', code: 'GARC', number: 5, name: 'L. Garcia', teamColor: '#8ECAE6', teamName: 'Nitro Racing', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=L+Garcia&background=8ECAE6&color=fff&size=256' },
  d08: { id: 'd08', code: 'MAR', number: 7, name: 'P. Martinez', teamColor: '#8ECAE6', teamName: 'Nitro Racing', vehicle: 'Toyota GR86', headshotUrl: 'https://ui-avatars.com/api/?name=P+Martinez&background=8ECAE6&color=fff&size=256' },
};

export const DRIVER_STATS: Record<string, DriverStats> = {
  d01: { speed: 92, consistency: 88, raceCraft: 85, tyreMgmt: 90, stressEstimate: 45, aggression: 90 },
  d02: { speed: 89, consistency: 85, raceCraft: 88, tyreMgmt: 92, stressEstimate: 65, aggression: 82 },
  d03: { speed: 92, consistency: 90, raceCraft: 93, tyreMgmt: 89, stressEstimate: 72, aggression: 88 },
  d04: { speed: 96, consistency: 86, raceCraft: 90, tyreMgmt: 85, stressEstimate: 78, aggression: 92 },
  d05: { speed: 91, consistency: 88, raceCraft: 89, tyreMgmt: 86, stressEstimate: 75, aggression: 87 },
  d06: { speed: 90, consistency: 94, raceCraft: 97, tyreMgmt: 95, stressEstimate: 50, aggression: 95 },
  d07: { speed: 93, consistency: 91, raceCraft: 87, tyreMgmt: 88, stressEstimate: 68, aggression: 90 },
  d08: { speed: 89, consistency: 85, raceCraft: 84, tyreMgmt: 82, stressEstimate: 82, aggression: 85 },
};

export const getDriverStats = (id: string): DriverStats => {
    return DRIVER_STATS[id] || { speed: 82, consistency: 80, raceCraft: 80, tyreMgmt: 80, stressEstimate: 70, aggression: 75 };
};

export const CURRENT_WEATHER: WeatherCondition = {
    airTemp: 27.4,
    trackTemp: 39.5,
    humidity: 64.0,
    windSpeed: 5.0,
    windDirection: '202°',
    pressure: 995.8
};

// Removed DRS, Removed arbitrary percentages
export const OVERTAKING_ZONES: OvertakingZone[] = [
    { id: 1, positionNumber: 1, name: 'Backstraight Draft', difficulty: 'Low', description: 'Longest acceleration zone. Drafting is critical for overtaking.' },
    { id: 2, positionNumber: 2, name: 'Turn 1 Entry', difficulty: 'Moderate', description: 'Uphill entry allows for late braking, but blind apex increases risk.' },
    { id: 3, positionNumber: 3, name: 'Turn 12 Exit', difficulty: 'Moderate', description: 'Traction zone. Overtake depends on better exit speed from hairpin.' },
    { id: 4, positionNumber: 4, name: 'Turn 19 Complex', difficulty: 'High', description: 'Fast left hander. Commitment required to hold outside line.' },
    { id: 5, positionNumber: 5, name: 'Turn 11 Entry', difficulty: 'High', description: 'Tight hairpin. Vulnerable to switchback maneuvers.' }
];

export const TRACK_INCIDENTS: TrackIncident[] = [
    { id: 1, turn: 'Turn 1', count: 12, severity: 'High', description: 'Blind apex uphill - contact common.' },
    { id: 2, turn: 'Turn 19', count: 8, severity: 'Medium', description: 'Track limits violation on exit.' },
    { id: 3, turn: 'Esses (T3-T6)', count: 5, severity: 'High', description: 'High speed instability area.' },
    { id: 4, turn: 'Turn 12', count: 6, severity: 'Safe', description: 'Lock-ups common in braking zone.' }
];

// Pivot to Pace Management instead of Pit/Compound Strategy
export const STRATEGY_OPTIONS: StrategyOption[] = [
    { id: 1, name: 'Full Attack Sprint', phases: ['PUSH', 'PUSH', 'BALANCED'], risk: 'High', advantage: 'Track position' },
    { id: 2, name: 'Balanced Pace', phases: ['BALANCED', 'BALANCED', 'PUSH'], risk: 'Low', advantage: 'Consistency' },
    { id: 3, name: 'Late Charge', phases: ['SAVE', 'BALANCED', 'PUSH'], risk: 'Medium', advantage: 'Tire Advantage Late' },
    { id: 4, name: 'Gap Management', phases: ['PUSH', 'SAVE', 'BALANCED'], risk: 'Medium', advantage: 'Break Tow Early' }
];

export const RACE_RESULTS: RaceResult[] = [
  { position: 1, driverId: 'd01', points: 25, grid: 1, laps: 15, status: 'Finished', time: '35:44.742', fastestLap: '2:16.608', bestLapTime: 136.608 },
  { position: 2, driverId: 'd02', points: 18, grid: 5, laps: 15, status: 'Finished', time: '+2.457', fastestLap: '2:17.123', bestLapTime: 137.123 },
  { position: 3, driverId: 'd03', points: 15, grid: 4, laps: 15, status: 'Finished', time: '+5.110', fastestLap: '2:17.220', bestLapTime: 137.220 },
  { position: 4, driverId: 'd04', points: 12, grid: 2, laps: 15, status: 'Finished', time: '+9.669', fastestLap: '2:17.090', bestLapTime: 137.090 },
  { position: 5, driverId: 'd05', points: 10, grid: 3, laps: 15, status: 'Finished', time: '+12.788', fastestLap: '2:17.350', bestLapTime: 137.350 },
  { position: 6, driverId: 'd06', points: 8, grid: 7, laps: 15, status: 'Finished', time: '+14.458', fastestLap: '2:17.476', bestLapTime: 137.476 },
  { position: 7, driverId: 'd07', points: 6, grid: 9, laps: 15, status: 'Finished', time: '+15.324', fastestLap: '2:17.500', bestLapTime: 137.500 },
  { position: 8, driverId: 'd08', points: 4, grid: 8, laps: 15, status: 'Finished', time: '+16.082', fastestLap: '2:17.760', bestLapTime: 137.760 },
];

export const POLE_LAP = { driverId: 'd01', time: '2:15.179' };

export const CIRCUIT_STATS = {
    lapRecord: "2:15.169",
    turns: 20,
    length: "5.513 KM"
    // removed drsZones
};

export const generateTelemetry = (driverId: string, lap: number = 1): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const trackLength = 5513; 
  const steps = 800; 
  
  const driver = DRIVERS[driverId];
  const result = RACE_RESULTS.find(r => r.driverId === driverId);
  const performanceFactor = result ? 1 - ((result.position - 1) * 0.001) : 0.95;
  
  // No fuel load effect in telemetry generation if data doesn't exist
  // We model degradation purely on lap count
  const tyreDeg = (lap * 0.1); 
  const noise = () => (Math.random() * 4 - 2);

  let cx = 200; 
  let cy = 600; 
  let heading = -90;

  // COTA Geometry (Same)
  const segments = [
      { id: 'main_straight', len: 0.1, dHead: 0, speed: 220 }, // GR86 speeds (lower than F1)
      { id: 't1', len: 0.02, dHead: -110, speed: 65 }, 
      { id: 't2', len: 0.03, dHead: 50, speed: 140 }, 
      { id: 'esses_1', len: 0.03, dHead: -40, speed: 160 }, 
      { id: 'esses_2', len: 0.03, dHead: 40, speed: 160 }, 
      { id: 'esses_3', len: 0.03, dHead: -40, speed: 155 }, 
      { id: 'esses_4', len: 0.03, dHead: 40, speed: 150 }, 
      { id: 't7_t9', len: 0.05, dHead: -80, speed: 130 }, 
      { id: 't10', len: 0.02, dHead: -20, speed: 150 }, 
      { id: 't11', len: 0.03, dHead: -110, speed: 55 }, 
      { id: 'back_straight', len: 0.2, dHead: 0, speed: 230 }, // GR86 Top speed
      { id: 't12', len: 0.03, dHead: -90, speed: 60 }, 
      { id: 'stadium_1', len: 0.03, dHead: 45, speed: 90 }, 
      { id: 'stadium_2', len: 0.03, dHead: -45, speed: 100 }, 
      { id: 'stadium_3', len: 0.03, dHead: -45, speed: 100 }, 
      { id: 'carousel', len: 0.1, dHead: 180, speed: 140 }, 
      { id: 't19', len: 0.04, dHead: -80, speed: 150 }, 
      { id: 't20', len: 0.03, dHead: -90, speed: 80 }, 
      { id: 'finish', len: 0.05, dHead: 0, speed: 200 } 
  ];

  let currentStep = 0;

  for (const seg of segments) {
      const segSteps = Math.floor(seg.len * steps);
      for (let i = 0; i < segSteps; i++) {
          const segProgress = i / segSteps;
          const stepHeadingChange = seg.dHead / segSteps;
          heading += stepHeadingChange;
          
          const rad = heading * Math.PI / 180;
          cx += Math.cos(rad) * 5;
          cy += Math.sin(rad) * 5;

          let speedBase = seg.speed;
          if (Math.abs(seg.dHead) > 30) {
              const apex = 0.5;
              const distFromApex = Math.abs(segProgress - apex);
              speedBase = seg.speed * (0.6 + (distFromApex * 0.4));
          } else {
              speedBase = seg.speed + (segProgress * 30);
          }

          let speed = speedBase * performanceFactor - tyreDeg + noise();
          speed = Math.max(50, Math.min(240, speed)); // Cap at GR86 speeds

          const throttle = speed > 180 ? 100 : Math.max(0, (speed / 200) * 95);
          const brake = speed < 100 && Math.abs(seg.dHead) > 20 ? Math.min(100, (120 - speed) * 2) : 0;
          const gear = Math.min(6, Math.max(1, Math.floor(speed / 35))); // 6 speed gearbox
          const rpm = 5000 + (speed % 30) * 100 + noise() * 100; // Lower RPM range
          const dist = (currentStep / steps) * trackLength;

          points.push({ 
              distance: Math.floor(dist), 
              speed: Math.floor(speed), 
              throttle: Math.floor(throttle), 
              brake: Math.floor(brake), 
              gear, 
              rpm: Math.floor(rpm), 
              driverId,
              x: cx,
              y: cy
          });
          currentStep++;
      }
  }
  return points;
};

const generateLapHistory = (): LapData[] => {
    const history: LapData[] = [];
    const allDriverIds = Object.keys(DRIVERS);
    
    allDriverIds.forEach(dId => {
        const result = RACE_RESULTS.find(r => r.driverId === dId);
        const pos = result?.position || 20;
        const basePace = 137 + ((pos-1) * 0.2); 

        // Strategy is now about Pace Mode (Push vs Save), not compound changes
        // Spec series = everyone on same tire
        
        const totalLaps = 15; // Sprint race length

        for(let lap=1; lap<=totalLaps; lap++) {
            
            // Determine pace mode based on "Strategy"
            let paceMode: 'PUSH' | 'SAVE' | 'BALANCED' = 'BALANCED';
            if (lap < 3 || lap > 13) paceMode = 'PUSH';
            if (lap > 5 && lap < 10) paceMode = 'SAVE';

            const tyreWear = (lap / totalLaps) * 100;
            const degEffect = (tyreWear * 0.02); // 2s drop off over race
            
            let lapTime = basePace + degEffect;
            if (paceMode === 'PUSH') lapTime -= 0.5;
            if (paceMode === 'SAVE') lapTime += 0.8;
            
            lapTime += (Math.random() * 0.4 - 0.2);

            const t = lapTime;
            const s1 = parseFloat((t * 0.27).toFixed(3));
            const s2 = parseFloat((t * 0.35).toFixed(3));
            const s3 = parseFloat((t - s1 - s2).toFixed(3));

            history.push({
                lap,
                driverId: dId,
                time: parseFloat(lapTime.toFixed(3)),
                s1,
                s2,
                s3,
                position: pos, 
                paceMode,
                tyreWear
            });
        }
    });
    return history;
};

export const LAP_HISTORY = generateLapHistory();
