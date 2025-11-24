import { LeaderboardEntry } from '../../types';
import { leaderboard } from '../../data';
import { fetchWithFallback } from '../apiClient';

export const leaderboardApi = {
  lap: () => fetchWithFallback<LeaderboardEntry[]>('/leaderboard/lap/', async () => leaderboard),
  sector: () => fetchWithFallback<LeaderboardEntry[]>('/leaderboard/sector/', async () => leaderboard),
  driver: () => fetchWithFallback<LeaderboardEntry[]>('/leaderboard/driver/', async () => leaderboard),
};