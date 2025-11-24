import {
  Lap,
  LapPredictionRequest,
  LeaderboardEntry,
  PredictionResult,
  Sector,
  TelemetryComparison,
  TelemetryPoint,
  Track,
  UploadedSession,
  UploadResult,
} from '../types';
import {
  idealBehaviors,
  idealTelemetry,
  idealTurnTelemetry,
  laps,
  leaderboard,
  sectors,
  tracks,
  uploadResults,
  uploadedSessions,
} from '../data';

const wait = async <T>(data: T, ms: number = 250): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), ms));

const persistSession = (session: UploadedSession) => {
  uploadedSessions.push(session);
  uploadResults.push({ session, leaderboardDelta: -2, coaching: ['Brake 5m earlier for Turn 1', 'Blend throttle sooner at mid-corner', 'Hold a smoother steering ramp on exit'] });
};

export const api = {
  tracks: {
    list: async (): Promise<Track[]> => wait(tracks),
    details: async (id: string): Promise<Track | undefined> => wait(tracks.find((t) => t.id === id)),
    map: async (id: string): Promise<string | undefined> => wait(tracks.find((t) => t.id === id)?.mapImage),
  },
  laps: {
    list: async (trackId: string): Promise<Lap[]> => wait(laps.filter((lap) => lap.trackId === trackId)),
  },
  sectors: {
    list: async (trackId: string): Promise<Sector[]> => wait(sectors.filter((sector) => sector.trackId === trackId)),
  },
  telemetry: {
    ideal: async (trackId: string): Promise<TelemetryPoint[]> => wait(idealTelemetry[trackId] || []),
    idealTurn: async (trackId: string, turnNumber: number): Promise<TelemetryPoint[]> =>
      wait(idealTurnTelemetry[trackId]?.[turnNumber] || []),
    compare: async (trackId: string): Promise<TelemetryComparison> => {
      const ideal = idealTelemetry[trackId] || [];
      const user = ideal.map((point) => ({ ...point, speed: Math.max(80, point.speed - 6 + Math.random() * 4) }));
      return wait({
        turnNumber: 0,
        ideal,
        user,
        summary: 'Overlayed user telemetry vs ideal profile with speed drop penalties applied for errors.',
      });
    },
  },
  uploads: {
    create: async (file: File, trackId: string): Promise<UploadedSession> => {
      const session: UploadedSession = {
        id: `session-${Date.now()}`,
        user: 'demo-user',
        trackId,
        status: 'PROCESSING',
        createdAt: new Date().toISOString(),
        filename: file.name,
      };
      persistSession(session);
      return wait(session, 800);
    },
    status: async (sessionId: string): Promise<UploadedSession | undefined> =>
      wait(uploadedSessions.find((s) => s.id === sessionId)),
    result: async (sessionId: string): Promise<UploadResult | undefined> =>
      wait(uploadResults.find((r) => r.session.id === sessionId)),
  },
  idealBehavior: {
    list: async (trackId: string) => wait(idealBehaviors.filter((b) => b.trackId === trackId)),
  },
  predictions: {
    lapTime: async (payload: LapPredictionRequest): Promise<PredictionResult> => {
      const base = 90 + (payload.driverCategory === 'PRO' ? -2 : payload.driverCategory === 'AM' ? 1 : 4);
      const predictedLapTime = base + (120 - payload.averageSpeed) * 0.18 + payload.mistakes * 0.9;
      return wait({
        predictedLapTime: parseFloat(predictedLapTime.toFixed(3)),
        confidence: 0.78,
        limitingFactor: payload.mistakes > 0 ? 'braking' : 'aero-grip',
      });
    },
  },
  leaderboard: {
    lap: async (): Promise<LeaderboardEntry[]> => wait(leaderboard),
    sector: async (): Promise<LeaderboardEntry[]> => wait(leaderboard),
    driver: async (): Promise<LeaderboardEntry[]> => wait(leaderboard),
  },
};