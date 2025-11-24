export interface Track {
  id: string;
  name: string;
  location: string;
  mapImage: string;
  totalLaps: number;
  lengthKm: number;
  turns: number;
}

export interface Lap {
  id: string;
  trackId: string;
  lapNumber: number;
  driverCategory: 'PRO' | 'AM' | 'ROOKIE';
  lapTime: number;
  avgSpeed: number;
  maxSpeed: number;
  mistakes: number;
  timestamp: string;
}

export interface Sector {
  id: string;
  lapId: string;
  trackId: string;
  sectorNumber: number;
  sectorTime: number;
  entrySpeed: number;
  exitSpeed: number;
  avgSteeringAngle: number;
}

export interface TelemetryPoint {
  id: string;
  sectorId: string;
  trackId: string;
  timestamp: number;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
  steering: number;
  gpsX: number;
  gpsY: number;
}

export interface IdealBehavior {
  id: string;
  trackId: string;
  turnNumber: number;
  optimalBrakePoint: number;
  optimalThrottleCurve: number[];
  optimalSteeringCurve: number[];
  optimalRacingLineJson: { x: number; y: number; intensity?: number }[];
}

export interface UploadedSession {
  id: string;
  user: string;
  trackId: string;
  createdAt: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  filename?: string;
}

export interface TelemetryComparison {
  turnNumber: number;
  ideal: TelemetryPoint[];
  user?: TelemetryPoint[];
  summary: string;
}

export interface LeaderboardEntry {
  trackId: string;
  driver: string;
  bestLap: number;
  category: 'PRO' | 'AM' | 'ROOKIE';
}

export interface LapPredictionRequest {
  trackId: string;
  driverCategory: 'PRO' | 'AM' | 'ROOKIE';
  averageSpeed: number;
  mistakes: number;
}

export interface PredictionResult {
  predictedLapTime: number;
  confidence: number;
  limitingFactor: string;
}

export interface UploadResult {
  session: UploadedSession;
  leaderboardDelta: number;
  coaching: string[];
}