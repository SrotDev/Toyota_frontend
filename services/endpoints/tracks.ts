
import { Track } from '../../types';
import { tracks } from '../../data';
import { fetchWithFallback } from '../apiClient';

export const tracksApi = {
  list: () => fetchWithFallback<Track[]>('/tracks/', async () => tracks),
  details: (id: string) => fetchWithFallback<Track | undefined>(`/tracks/${id}/details/`, async () => tracks.find((t) => t.id === id)),
  map: (id: string) => fetchWithFallback<string | undefined>(`/tracks/${id}/map/`, async () => tracks.find((t) => t.id === id)?.mapImage),
};