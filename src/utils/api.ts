export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Disable caching to ensure fresh telemetry / racing line data in server components
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store', headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json();
}

export const api = {
  tracks: () => request<any>('/tracks/'),
  leaderboardLaps: () => request<any>('/leaderboard/lap/'),
  laps: (trackId: string) => request<any>(`/tracks/${trackId}/laps/`),
  sectors: (trackId: string) => request<any>(`/tracks/${trackId}/sectors/`),
  idealTelemetry: (trackId: string) => request<any>(`/tracks/${trackId}/telemetry/ideal/`), // returns array of synthetic telemetry points
  idealBehaviors: (trackId: string) => request<any>(`/tracks/${trackId}/telemetry/ideal/behaviors/`),
  // Alias for racing line view; reuse ideal telemetry endpoint
  idealRacingLine: (trackId: string) => request<any>(`/tracks/${trackId}/telemetry/ideal/`),
  turnRecommendations: (slug: string) => request<any>(`/predictions/${slug}/turn-recommendations/`),
  idealLine: (slug: string) => request<any>(`/predictions/${slug}/ideal-line/`),
  pitWindow: (trackId: string) => request<any>(`/strategy/track/${trackId}/pit-window/`),
  risk: (trackId: string) => request<any>(`/strategy/track/${trackId}/risk/`),
  nextLaps: (trackId: string, count=3) => request<any>(`/strategy/track/${trackId}/next-laps/?count=${count}`),
  behaviorCompare: (trackId: string, curves: any) => request<any>(`/strategy/track/${trackId}/behavior-compare/`, { method: 'POST', body: JSON.stringify({ curves }) }),
  features: (trackId: string) => request<any>(`/strategy/track/${trackId}/features/`),
  undercut: (trackId: string) => request<any>(`/strategy/track/${trackId}/undercut/`),
  competitorStrategy: (trackId: string) => request<any>(`/strategy/track/${trackId}/competitors/strategy/`),
  liveState: (trackId: string) => request<any>(`/strategy/track/${trackId}/live-state/`),
  cautionRecommendations: (trackId: string) => request<any>(`/strategy/track/${trackId}/caution-recommendations/`),
  advancedMLPrediction: (modelType: string, inputData: any) => request<any>(`/predict/advanced-ml/`, {
    method: 'POST',
    body: JSON.stringify({ model_type: modelType, input_data: inputData }),
  }),
};
