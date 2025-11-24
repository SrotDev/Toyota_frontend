import { Lap } from '../../types';
import { laps } from '../../data';
import { fetchWithFallback } from '../apiClient';

export const lapsApi = {
  list: (trackId: string) => fetchWithFallback<Lap[]>(`/tracks/${trackId}/laps/`, async () => laps.filter((lap) => lap.trackId === trackId)),
};