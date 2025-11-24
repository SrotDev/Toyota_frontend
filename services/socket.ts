
import { DRIVERS, RACE_RESULTS, POLE_LAP, LAP_HISTORY } from '../data';

type EventCallback = (data: any) => void;

export interface LiveEvent {
  id: string;
  type: 'incident' | 'radio' | 'flag' | 'sector';
  message: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'danger' | 'success';
}

/**
 * Data-Driven Replay Engine
 * Parses the static dataset to create a "Live" experience that accurately reflects the race data.
 */
export class MockRaceSocket {
  private listeners: Record<string, EventCallback[]> = {};
  private intervalId: number | null = null;
  private connected: boolean = false;
  private eventQueue: LiveEvent[] = [];

  constructor() {
    this.generateEventTimeline();
  }

  private generateEventTimeline() {
    // 1. RACE START
    this.eventQueue.push(this.createEvent('flag', 'GREEN FLAG - R1 GR CUP UNDERWAY', 'success'));
    this.eventQueue.push(this.createEvent('sector', `Pole Sitter ${DRIVERS[POLE_LAP.driverId].name} leads into Turn 1`, 'info'));

    // 2. REAL FASTEST LAPS (From Results)
    // We scatter these throughout the "feed"
    RACE_RESULTS.forEach((r, idx) => {
        if (r.fastestLap) {
             // Add some variance so they don't all appear at once
             this.eventQueue.push(this.createEvent('sector', `PURPLE SECTOR: ${DRIVERS[r.driverId].code} sets fastest lap - ${r.fastestLap}`, 'success'));
        }
    });

    // 3. STRATEGY CHANGES (From Lap History - Replaces Pit Stops for Spec Series)
    // We detect when pace mode changes in the history data
    const strategyEvents: LiveEvent[] = [];
    const driverIds = Object.keys(DRIVERS);
    
    driverIds.forEach(dId => {
        const laps = LAP_HISTORY.filter(l => l.driverId === dId).sort((a,b) => a.lap - b.lap);
        let currentMode = laps[0]?.paceMode;
        
        laps.forEach(lap => {
            if (lap.paceMode !== currentMode) {
                // Mode changed
                strategyEvents.push(this.createEvent(
                    'radio', 
                    `Lap ${lap.lap}: ${DRIVERS[dId].code} STRATEGY CHANGE - Switching to ${lap.paceMode} PACE`, 
                    'warning'
                ));
                currentMode = lap.paceMode;
            }
        });
    });
    
    // 4. GRID POSITION CHANGES (Overtakes)
    RACE_RESULTS.forEach(r => {
        const gained = r.grid - r.position;
        if (gained > 2) {
            this.eventQueue.push(this.createEvent('incident', `${DRIVERS[r.driverId].name} is on the move! Up ${gained} positions from start.`, 'success'));
        } else if (gained < -2) {
            this.eventQueue.push(this.createEvent('incident', `${DRIVERS[r.driverId].code} struggling with pace, down ${Math.abs(gained)} positions.`, 'danger'));
        }
    });

    // 5. FINISH
    const winner = DRIVERS[RACE_RESULTS[0].driverId];
    this.eventQueue.push(this.createEvent('flag', `CHECKERED FLAG: ${winner.name} wins Round 1!`, 'success'));
    this.eventQueue.push(this.createEvent('radio', `${winner.name}: "Fantastic job team. The car was on rails."`, 'success'));

    // Merge and Shuffle the middle content (Strategy + Fastest Laps) to simulate a race timeline
    const startEvents = this.eventQueue.slice(0, 2);
    const finishEvents = this.eventQueue.slice(this.eventQueue.length - 2);
    
    // Combine dynamic events
    let middleEvents = [...strategyEvents, ...this.eventQueue.slice(2, this.eventQueue.length - 2)];
    
    // Simple shuffle to mix strategy calls and fastest laps
    middleEvents = middleEvents.sort(() => Math.random() - 0.5);

    this.eventQueue = [...startEvents, ...middleEvents, ...finishEvents];
  }

  private createEvent(type: LiveEvent['type'], message: string, severity: LiveEvent['severity'] = 'info'): LiveEvent {
      return {
          id: Math.random().toString(36).substr(2, 9),
          type,
          message,
          timestamp: new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'}),
          severity
      };
  }

  connect() {
    if (this.connected) return;
    this.connected = true;
    
    this.emit('status', { status: 'connected' });

    let eventIndex = 0;

    // Stream events at a readable pace
    this.intervalId = window.setInterval(() => {
        if (eventIndex < this.eventQueue.length) {
            this.emit('message', this.eventQueue[eventIndex]);
            eventIndex++;
        } else {
            // After race is "done", just emit status checks
            this.emit('message', this.createEvent('incident', `Track Status: All Clear. Cars returning to Parc Fermé.`, 'info'));
        }
    }, 3000); // New event every 3 seconds
  }

  disconnect() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.connected = false;
    this.emit('status', { status: 'disconnected' });
  }

  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const raceSocket = new MockRaceSocket();
