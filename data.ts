import { IdealBehavior, Lap, LeaderboardEntry, Sector, TelemetryPoint, Track, UploadedSession, UploadResult } from './types';

export const tracks: Track[] = [
  {
    id: 'cota',
    name: 'Circuit of the Americas',
    location: 'Austin, USA',
    mapImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/1200px-Austin_circuit.svg.png',
    totalLaps: 56,
    lengthKm: 5.513,
    turns: 20,
  },
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
  {
    id: 'suzuka',
    name: 'Suzuka Circuit',
    location: 'Suzuka, Japan',
    mapImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Suzuka_circuit_map_2005.svg/1200px-Suzuka_circuit_map_2005.svg.png',
    totalLaps: 53,
    lengthKm: 5.807,
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

buildLapSet('cota', 137.2);
buildLapSet('silverstone', 100.4);
buildLapSet('suzuka', 95.8);

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
  silverstone: buildTelemetrySeries('silverstone', 'silverstone-ideal', 6),
  suzuka: buildTelemetrySeries('suzuka', 'suzuka-ideal', 3),
};

export const idealTurnTelemetry: Record<string, Record<number, TelemetryPoint[]>> = {
  cota: {
    4: buildTelemetrySeries('cota', 'cota-turn-4', -6),
    11: buildTelemetrySeries('cota', 'cota-turn-11', 4),
    16: buildTelemetrySeries('cota', 'cota-turn-16', 2),
  },
  silverstone: {
    4: buildTelemetrySeries('silverstone', 'silverstone-turn-4', -2),
    11: buildTelemetrySeries('silverstone', 'silverstone-turn-11', 3),
    16: buildTelemetrySeries('silverstone', 'silverstone-turn-16', 5),
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

export { laps, sectors };