import { leaderboardApi } from './endpoints/leaderboard';
import { lapsApi } from './endpoints/laps';
import { predictionsApi } from './endpoints/predictions';
import { sectorsApi } from './endpoints/sectors';
import { telemetryApi } from './endpoints/telemetry';
import { tracksApi } from './endpoints/tracks';
import { uploadsApi } from './endpoints/uploads';
export const api = {
  tracks: tracksApi,
  laps: lapsApi,
  sectors: sectorsApi,
  telemetry: telemetryApi,
  uploads: uploadsApi,
  predictions: predictionsApi,
  leaderboard: leaderboardApi,
};