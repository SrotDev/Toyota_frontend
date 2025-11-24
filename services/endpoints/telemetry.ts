import { IdealBehavior, TelemetryComparison, TelemetryPoint } from '../../types';
import { idealBehaviors, idealTelemetry, idealTurnTelemetry } from '../../data';
import { fetchWithFallback } from '../apiClient';

export const telemetryApi = {
  ideal: (trackId: string) =>
    fetchWithFallback<TelemetryPoint[]>(`/tracks/${trackId}/telemetry/ideal/`, async () => idealTelemetry[trackId] || []),
  idealTurn: (trackId: string, turnNumber: number) =>
    fetchWithFallback<TelemetryPoint[]>(
      `/tracks/${trackId}/telemetry/ideal/${turnNumber}/`,
      async () => idealTurnTelemetry[trackId]?.[turnNumber] || [],
    ),
  compare: (trackId: string) =>
    fetchWithFallback<TelemetryComparison>(
      `/tracks/${trackId}/telemetry/compare/`,
      async () => {
        const ideal = idealTelemetry[trackId] || [];
        const user = ideal.map((point) => ({ ...point, speed: Math.max(80, point.speed - 6 + Math.random() * 4) }));
        return { turnNumber: 0, ideal, user, summary: 'Overlayed user telemetry vs ideal profile with speed-drop penalties.' };
      },
    ),
  idealBehaviors: (trackId: string) =>
    fetchWithFallback<IdealBehavior[]>(`/tracks/${trackId}/telemetry/ideal/behaviors/`, async () => idealBehaviors.filter((b) => b.trackId === trackId)),
};