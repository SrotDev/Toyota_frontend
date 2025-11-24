import { LapPredictionRequest, PredictionResult } from '../../types';
import { fetchWithFallback } from '../apiClient';

export const predictionsApi = {
  lapTime: (payload: LapPredictionRequest) =>
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
};