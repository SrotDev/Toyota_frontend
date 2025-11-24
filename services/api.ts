
import { Track, Lap, IdealBehavior, UploadedSession, TelemetryPoint, CoachingSuggestion } from '../types';

// --- MOCK DATABASE ---

const TRACKS: Track[] = [
    {
        id: 't01',
        name: 'Circuit of the Americas',
        location: 'Austin, TX, USA',
        map_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/1200px-Austin_circuit.svg.png',
        total_laps: 56,
        length_km: 5.513,
        turns: 20
    },
    {
        id: 't02',
        name: 'Silverstone Circuit',
        location: 'Silverstone, UK',
        map_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Silverstone_Circuit_2020.png/1200px-Silverstone_Circuit_2020.png',
        total_laps: 52,
        length_km: 5.891,
        turns: 18
    },
    {
        id: 't03',
        name: 'Suzuka Circuit',
        location: 'Suzuka, Japan',
        map_image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Suzuka_circuit_map_2005.svg/1200px-Suzuka_circuit_map_2005.svg.png',
        total_laps: 53,
        length_km: 5.807,
        turns: 18
    }
];

// Helper to generate mock laps
const generateLaps = (trackId: string, count: number): Lap[] => {
    return Array.from({ length: count }).map((_, i) => {
        const baseTime = 105; // 1:45.000
        const variation = (Math.random() * 4) - 2;
        const time = baseTime + variation;
        
        return {
            id: `l${i}-${trackId}`,
            trackId,
            lap_number: i + 1,
            driver_category: 'PRO',
            lap_time: parseFloat(time.toFixed(3)),
            avg_speed: 180 + Math.random() * 20,
            max_speed: 310 + Math.random() * 20,
            mistakes: Math.random() > 0.8 ? 1 : 0,
            timestamp: new Date().toISOString(),
            is_personal_best: false, // set later
            sectors: [
                { id: `s1-${i}`, lapId: `l${i}`, sector_number: 1, sector_time: time * 0.3, entry_speed: 200, exit_speed: 150, avg_steering_angle: 15, status: 'GREEN' as const },
                { id: `s2-${i}`, lapId: `l${i}`, sector_number: 2, sector_time: time * 0.4, entry_speed: 160, exit_speed: 180, avg_steering_angle: 45, status: 'YELLOW' as const },
                { id: `s3-${i}`, lapId: `l${i}`, sector_number: 3, sector_time: time * 0.3, entry_speed: 220, exit_speed: 250, avg_steering_angle: 10, status: 'GREEN' as const }
            ]
        };
    }).sort((a,b) => a.lap_time - b.lap_time).map((l, i) => i === 0 ? { ...l, is_personal_best: true } : l).sort((a, b) => a.lap_number - b.lap_number);
};

const LAPS_STORE: Record<string, Lap[]> = {
    't01': generateLaps('t01', 20),
    't02': generateLaps('t02', 15),
    't03': generateLaps('t03', 10),
};

// Generate high-res telemetry for visualization
export const generateMockTelemetry = (lapId: string): TelemetryPoint[] => {
    const points: TelemetryPoint[] = [];
    const steps = 200;
    
    for (let i = 0; i < steps; i++) {
        const progress = i / steps;
        // Simple harmonic motion simulation for curves
        const speed = 150 + Math.sin(progress * Math.PI * 4) * 100 + (Math.random() * 5);
        
        points.push({
            id: `tp-${lapId}-${i}`,
            timestamp: i * 50,
            distance: i * 20,
            speed: Math.floor(speed),
            throttle: speed > 200 ? 100 : Math.max(0, speed / 2),
            brake: speed < 100 ? 80 : 0,
            gear: Math.min(8, Math.floor(speed / 40) + 1),
            steering: Math.sin(progress * Math.PI * 6) * 90,
            gps_x: Math.cos(progress * Math.PI * 2) * 500 + 500,
            gps_y: Math.sin(progress * Math.PI * 2) * 500 + 500
        });
    }
    return points;
};

// --- API ENDPOINTS (MOCKED) ---

export const api = {
    tracks: {
        list: async (): Promise<Track[]> => {
            return new Promise(resolve => setTimeout(() => resolve(TRACKS), 500));
        },
        get: async (id: string): Promise<Track | undefined> => {
            return new Promise(resolve => setTimeout(() => resolve(TRACKS.find(t => t.id === id)), 300));
        }
    },
    laps: {
        list: async (trackId: string): Promise<Lap[]> => {
            return new Promise(resolve => setTimeout(() => resolve(LAPS_STORE[trackId] || []), 400));
        }
    },
    telemetry: {
        getIdeal: async (trackId: string): Promise<TelemetryPoint[]> => {
             // Mock ideal as a clean run
             return new Promise(resolve => setTimeout(() => resolve(generateMockTelemetry('ideal')), 600));
        },
        getUser: async (sessionId: string): Promise<TelemetryPoint[]> => {
             // Mock user as a slightly noisy run
             return new Promise(resolve => setTimeout(() => resolve(generateMockTelemetry(sessionId)), 600));
        },
        getCoaching: async (sessionId: string): Promise<CoachingSuggestion[]> => {
             return [
                 { id: '1', turn: 'Turn 1', severity: 'HIGH', message: 'Braking too late causing missed apex.', gain: 0.35 },
                 { id: '2', turn: 'Turn 11', severity: 'MEDIUM', message: 'Throttle application delayed on exit.', gain: 0.15 },
                 { id: '3', turn: 'Turn 19', severity: 'LOW', message: 'Steering input inconsistent mid-corner.', gain: 0.05 },
             ]
        }
    },
    sessions: {
        upload: async (file: File, trackId: string): Promise<UploadedSession> => {
            return new Promise(resolve => setTimeout(() => resolve({
                id: `sess-${Date.now()}`,
                userId: 'user-1',
                trackId: trackId,
                created_at: new Date().toISOString(),
                status: 'COMPLETED',
                filename: file.name
            }), 2000));
        }
    }
};
