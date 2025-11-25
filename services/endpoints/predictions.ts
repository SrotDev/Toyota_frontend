import {
  LapPredictionRequest,
  PredictionResult,
  LapTimePredictionResponse,
  SectorTimePredictionResponse,
  BehaviorPredictionResponse,
  SimulateLapResponse,
  StoredLapPredictions,
  StoredSectorPredictions,
  StoredBehaviorPredictions,
  StoredIdealLine,
  StoredTurnRecommendations,
} from '../../types';
import { fetchWithFallback } from '../apiClient';

export const predictionsApi = {
  // Existing mock-driven client prediction (kept for backward compatibility)
  lapTimeMock: (payload: LapPredictionRequest) =>
    fetchWithFallback<PredictionResult>(
      '/predict/lap-time/',
      async () => {
        const base = 90 + (payload.driverCategory === 'PRO' ? -2 : payload.driverCategory === 'AM' ? 1 : 4);
        const predictedLapTime = base + (120 - payload.averageSpeed) * 0.18 + payload.mistakes * 0.9;
        return {
          predictedLapTime: parseFloat(predictedLapTime.toFixed(3)),
          confidence: 0.78,
          limitingFactor: payload.mistakes > 0 ? 'braking' : 'aero-grip',
        };
      },
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),

  lapTimeReal: (payload: { track: string; features: Record<string, number> }) =>
    fetchWithFallback<LapTimePredictionResponse>(
      '/predict/lap-time/',
      async () => ({ track: payload.track, lap_time_pred: 0 }),
      { method: 'POST', body: JSON.stringify(payload) },
    ),

  sectorTimeReal: (payload: { track: string; features: Record<string, number> }) =>
    fetchWithFallback<SectorTimePredictionResponse>(
      '/predict/sector-time/',
      async () => ({ track: payload.track, sector_time_pred: 0 }),
      { method: 'POST', body: JSON.stringify(payload) },
    ),

  behaviorReal: (payload: { track: string; driver_state: Record<string, number> }) =>
    fetchWithFallback<BehaviorPredictionResponse>(
      '/predict/telemetry-behavior/',
      async () => ({ track: payload.track, behavior_cluster_distribution: [] }),
      { method: 'POST', body: JSON.stringify(payload) },
    ),

  simulateLap: (payload: { track: string; sectors: { features: Record<string, number> }[] }) =>
    fetchWithFallback<SimulateLapResponse>(
      '/simulate-lap/',
      async () => ({ track: payload.track, sectors: [], total_time: 0 }),
      { method: 'POST', body: JSON.stringify(payload) },
    ),

  // Stored artifact retrieval
  storedLap: (track: string) =>
    fetchWithFallback<StoredLapPredictions>(
      `/predictions/${track}/lap/`,
      async () => ({ error: 'fallback', track }),
    ),
  storedSector: (track: string) =>
    fetchWithFallback<StoredSectorPredictions>(
      `/predictions/${track}/sector/`,
      async () => ({ error: 'fallback', track }),
    ),
  storedBehavior: (track: string) =>
    fetchWithFallback<StoredBehaviorPredictions>(
      `/predictions/${track}/behavior/`,
      async () => ({ error: 'fallback', track }),
    ),
  storedIdealLine: (track: string) =>
    fetchWithFallback<StoredIdealLine>(
      `/predictions/${track}/ideal-line/`,
      async () => ({ error: 'fallback', track }),
    ),
  storedTurnRecommendations: (track: string) =>
    fetchWithFallback<StoredTurnRecommendations>(
      `/predictions/${track}/turn-recommendations/`,
      async () => ({ error: 'fallback', track }),
    ),
};