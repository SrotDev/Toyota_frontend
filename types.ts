
export interface Track {
  id: string;
  name: string;
  location: string;
  map_image: string;
  total_laps: number;
  length_km: number;
  turns: number;
}

export interface Sector {
  id: string;
  lapId: string;
  sector_number: number;
  sector_time: number;
  entry_speed: number;
  exit_speed: number;
  avg_steering_angle: number;
  status: 'PURPLE' | 'GREEN' | 'YELLOW'; // Helper for UI
}

export interface Lap {
  id: string;
  trackId: string;
  lap_number: number;
  driver_category: string;
  lap_time: number; // seconds
  avg_speed: number;
  max_speed: number;
  mistakes: number;
  timestamp: string;
  sectors: Sector[];
  is_personal_best?: boolean;
}

export interface TelemetryPoint {
  id?: string;
  sectorId?: string;
  timestamp?: number; // relative time in ms
  distance: number; // meters from start
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
  steering?: number;
  gps_x?: number;
  gps_y?: number;
  rpm?: number;
  driverId?: string;
  x?: number;
  y?: number;
}

export interface IdealBehavior {
  trackId: string;
  turn_number: number;
  optimal_brake_point: number; // distance
  optimal_throttle_curve: { t: number, val: number }[];
  optimal_steering_curve: { t: number, val: number }[];
  optimal_racing_line: { x: number, y: number }[];
}

export interface UploadedSession {
  id: string;
  userId: string;
  trackId: string;
  created_at: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  filename: string;
}

export interface CoachingSuggestion {
  id: string;
  turn: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  gain: number; // seconds
}

export interface Driver {
    id: string;
    code: string;
    number: number;
    name: string;
    teamColor: string;
    teamName: string;
    vehicle: string;
    headshotUrl: string;
}

export interface DriverStats {
    speed: number;
    consistency: number;
    raceCraft: number;
    tyreMgmt: number;
    stressEstimate: number;
    aggression: number;
}

export interface WeatherCondition {
    airTemp: number;
    trackTemp: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
}

export interface OvertakingZone {
    id: number;
    positionNumber: number;
    name: string;
    difficulty: 'Low' | 'Moderate' | 'High';
    description: string;
}

export interface TrackIncident {
    id: number;
    turn: string;
    count: number;
    severity: 'High' | 'Medium' | 'Safe' | 'Low';
    description: string;
}

export interface StrategyOption {
    id: number;
    name: string;
    phases: string[];
    risk: 'High' | 'Medium' | 'Low';
    advantage: string;
}

export interface RaceResult {
    position: number;
    driverId: string;
    points: number;
    grid: number;
    laps: number;
    status: string;
    time: string;
    fastestLap: string;
    bestLapTime: number;
}

export interface LapData {
    lap: number;
    driverId: string;
    time: number;
    s1: number;
    s2: number;
    s3: number;
    position: number;
    paceMode: 'PUSH' | 'SAVE' | 'BALANCED';
    tyreWear: number;
}
