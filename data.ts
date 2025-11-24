import { IdealBehavior, Lap, LeaderboardEntry, Sector, TelemetryPoint, Track, UploadedSession, UploadResult } from './types';

export const tracks: Track[] = [
  
  {
    id: 'barber',
    name: 'Barber Motorsports Park',
    location: 'Barber Motorsports Park',
    mapImage:
      'https://upload.wikimedia.org/wikipedia/commons/6/60/Barber_Circuit_Map.png?20251124212421',
    totalLaps: 52,
    lengthKm: 5.891,
    turns: 18,
  },
  
];

const laps: Lap[] = [];
const sectors: Sector[] = [];

const buildLapSet = (trackId: string, baseTime: number) => {
  for (let i = 1; i <= 8; i++) {
    const lapTime = baseTime + (Math.random() * 2 - 1);
    const lapId = `${trackId}-lap-${i}`;

    laps.push({
      id: lapId,
      trackId,
      lapNumber: i,
      driverCategory: i < 3 ? 'PRO' : i < 6 ? 'AM' : 'ROOKIE',
      lapTime: parseFloat(lapTime.toFixed(3)),
      avgSpeed: 175 + Math.random() * 10,
      maxSpeed: 280 + Math.random() * 12,
      mistakes: i % 3 === 0 ? 1 : 0,
      timestamp: new Date(Date.now() - i * 600000).toISOString(),
    });

    const splits = [lapTime * 0.31, lapTime * 0.37, lapTime * 0.32];
    splits.forEach((sectorTime, idx) => {
      sectors.push({
        id: `${lapId}-s${idx + 1}`,
        lapId,
        trackId,
        sectorNumber: idx + 1,
        sectorTime: parseFloat(sectorTime.toFixed(3)),
        entrySpeed: 180 - idx * 12 + Math.random() * 8,
        exitSpeed: 190 - idx * 8 + Math.random() * 10,
        avgSteeringAngle: 22 + idx * 8 + Math.random() * 6,
      });
    });
  }
};

buildLapSet('barber', 100.4);


const makeCurve = (turnNumber: number, amplitude: number) =>
  Array.from({ length: 12 }).map((_, idx) =>
    parseFloat((amplitude + Math.sin((idx / 12) * Math.PI * 2) * amplitude * 0.35 - idx * 0.1).toFixed(2)),
  );

export const idealBehaviors: IdealBehavior[] = tracks.flatMap((track) =>
  [4, 11, 16].map((turn) => ({
    id: `${track.id}-ideal-${turn}`,
    trackId: track.id,
    turnNumber: turn,
    optimalBrakePoint: parseFloat((35 + turn * 0.5).toFixed(1)),
    optimalThrottleCurve: makeCurve(turn, 82),
    optimalSteeringCurve: makeCurve(turn, 24).reverse(),
    optimalRacingLineJson: Array.from({ length: 14 }).map((_, i) => ({
      x: i,
      y: Math.sin(i / 2) * 6 + turn,
      intensity: Math.random(),
    })),
  })),
);

const buildTelemetrySeries = (trackId: string, sectorId: string, speedOffset = 0): TelemetryPoint[] => {
  return Array.from({ length: 40 }).map((_, idx) => {
    const progress = idx / 39;
    const baseSpeed = 120 + Math.sin(progress * Math.PI) * 80 + speedOffset;
    return {
      id: `${sectorId}-${idx}`,
      sectorId,
      trackId,
      timestamp: idx * 60,
      speed: Math.round(baseSpeed + Math.random() * 4 - 2),
      throttle: Math.max(0, Math.min(100, 50 + progress * 50 + speedOffset * 0.05)),
      brake: progress < 0.3 ? Math.round((0.3 - progress) * 220) : 0,
      gear: Math.min(8, 2 + Math.round(progress * 6)),
      steering: Math.round(Math.sin(progress * Math.PI * 2) * 28),
      gpsX: Math.round(progress * 1200),
      gpsY: Math.round(Math.cos(progress * Math.PI) * 350 + 400),
    };
  });
};

export const idealTelemetry: Record<string, TelemetryPoint[]> = {
  cota: buildTelemetrySeries('cota', 'cota-ideal', 0),
  barber: buildTelemetrySeries('barber', 'barber-ideal', 6),
  suzuka: buildTelemetrySeries('suzuka', 'suzuka-ideal', 3),
};

export const idealTurnTelemetry: Record<string, Record<number, TelemetryPoint[]>> = {
  cota: {
    4: buildTelemetrySeries('cota', 'cota-turn-4', -6),
    11: buildTelemetrySeries('cota', 'cota-turn-11', 4),
    16: buildTelemetrySeries('cota', 'cota-turn-16', 2),
  },
  barber: {
    4: buildTelemetrySeries('barber', 'barber-turn-4', -2),
    11: buildTelemetrySeries('barber', 'barber-turn-11', 3),
    16: buildTelemetrySeries('barber', 'barber-turn-16', 5),
    },
  suzuka: {
    4: buildTelemetrySeries('suzuka', 'suzuka-turn-4', 0),
    11: buildTelemetrySeries('suzuka', 'suzuka-turn-11', 2),
    16: buildTelemetrySeries('suzuka', 'suzuka-turn-16', 1),
  },
};

export const leaderboard: LeaderboardEntry[] = tracks.map((track) => {
  const lapsForTrack = laps.filter((lap) => lap.trackId === track.id);
  const bestLap = lapsForTrack.reduce((best, current) => (current.lapTime < best.lapTime ? current : best), lapsForTrack[0]);
  return {
    trackId: track.id,
    driver: bestLap.driverCategory === 'PRO' ? 'Pro Factory' : bestLap.driverCategory === 'AM' ? 'AM Club' : 'Rookie School',
    bestLap: bestLap.lapTime,
    category: bestLap.driverCategory,
  };
});

export const uploadedSessions: UploadedSession[] = [];

export const uploadResults: UploadResult[] = [];

export const DRIVERS: Record<string, { id: string; code: string; name: string; vehicle: string; teamColor: string; headshot?: string }> = {
  d01: { id: 'd01', code: 'ALP', name: 'Alex Parker', vehicle: 'GT3 Evo', teamColor: '#00D9FF' },
  d02: { id: 'd02', code: 'RAV', name: 'Ravi Patel', vehicle: 'GT3 Evo', teamColor: '#F97316' },
  d03: { id: 'd03', code: 'LIA', name: 'Lia Chen', vehicle: 'GT3 Evo', teamColor: '#A855F7' },
};

const buildLapHistory = (driverId: string, base: number) =>
  Array.from({ length: 15 }).map((_, idx) => ({
    driverId,
    lap: idx + 1,
    time: parseFloat((base + Math.sin(idx * 0.6) * 0.6 + idx * 0.02).toFixed(3)),
  }));

export const LAP_HISTORY = [...buildLapHistory('d01', 90.4), ...buildLapHistory('d02', 91.1), ...buildLapHistory('d03', 92.3)];

export const RACE_RESULTS = [
  { driverId: 'd01', position: 1, fastestLap: '1:30.412' },
  { driverId: 'd02', position: 2, fastestLap: '1:30.998' },
  { driverId: 'd03', position: 3, fastestLap: '1:31.203' },
];

export const POLE_LAP = { driverId: 'd01', time: '1:30.201' };

export const TRACK_INCIDENTS = [
  { lap: 3, driverId: 'd03', type: 'off-track', severity: 'minor', note: 'Wide at Turn 1' },
  { lap: 7, driverId: 'd02', type: 'spin', severity: 'major', note: 'Looped at Turn 11' },
];

export const CURRENT_WEATHER = {
  airTemp: 26,
  trackTemp: 31,
  windSpeed: 9,
  condition: 'Partly Cloudy',
};

export const generateTelemetry = (driverId: string, lap: number) => {
  return Array.from({ length: 120 }).map((_, idx) => {
    const progress = idx / 119;
    return {
      distance: parseFloat((progress * 5.5).toFixed(2)),
      speed: 120 + Math.sin(progress * Math.PI) * 60 + (driverId === 'd01' ? 6 : 0) - lap * 0.15,
      throttle: Math.max(0, Math.min(100, 50 + progress * 50)),
      brake: progress < 0.25 ? Math.round((0.25 - progress) * 240) : 0,
      rpm: 6200 + Math.sin(progress * Math.PI) * 2200,
      gear: Math.min(8, 2 + Math.floor(progress * 6)),
      x: Math.round(Math.cos(progress * Math.PI * 2) * 420 + 500),
      y: Math.round(Math.sin(progress * Math.PI * 2) * 320 + 400),
    };
  });
};

export const getDriverStats = (driverId: string) => {
  const history = LAP_HISTORY.filter((lap) => lap.driverId === driverId);
  const average = history.reduce((sum, lap) => sum + lap.time, 0) / history.length;
  const consistency = Math.max(1, 10 - history.reduce((sum, lap) => sum + Math.abs(lap.time - average), 0) / history.length);
  return {
    speed: Math.round(90 + (driverId === 'd01' ? 8 : driverId === 'd02' ? 4 : 0)),
    consistency: parseFloat(consistency.toFixed(1)),
    stressEstimate: 40 + (driverId === 'd02' ? 8 : 0),
  };
};

export { laps, sectors };