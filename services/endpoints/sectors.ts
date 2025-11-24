import { Sector } from '../../types';
import { sectors } from '../../data';
import { fetchWithFallback } from '../apiClient';

export const sectorsApi = {
  list: (trackId: string) =>
    fetchWithFallback<Sector[]>(`/tracks/${trackId}/sectors/`, async () => sectors.filter((sector) => sector.trackId === trackId)),
};
