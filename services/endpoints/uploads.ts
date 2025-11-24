import { UploadedSession, UploadResult } from '../../types';
import { uploadResults, uploadedSessions } from '../../data';
import { fetchWithFallback } from '../apiClient';

const persistSession = (session: UploadedSession) => {
  uploadedSessions.push(session);
  if (!uploadResults.find((r) => r.session.id === session.id)) {
    uploadResults.push({
      session,
      leaderboardDelta: -2,
      coaching: ['Brake 5m earlier for Turn 1', 'Blend throttle sooner at mid-corner', 'Hold a smoother steering ramp on exit'],
    });
  }
};

export const uploadsApi = {
  create: (file: File, trackId: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('track_id', trackId);

    return fetchWithFallback<UploadedSession>(
      '/upload-telemetry/',
      async () => {
        const session: UploadedSession = {
          id: `session-${Date.now()}`,
          user: 'demo-user',
          trackId,
          status: 'PROCESSING',
          createdAt: new Date().toISOString(),
          filename: file.name,
        };
        persistSession(session);
        return session;
      },
      {
        method: 'POST',
        body: form,
      },
    );
  },
  status: (sessionId: string) => fetchWithFallback<UploadedSession | undefined>(`/upload-telemetry/${sessionId}/status/`, async () => uploadedSessions.find((s) => s.id === sessionId)),
  result: (sessionId: string) => fetchWithFallback<UploadResult | undefined>(`/upload-telemetry/${sessionId}/results/`, async () => uploadResults.find((r) => r.session.id === sessionId)),
};
