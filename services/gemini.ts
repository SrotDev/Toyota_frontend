
import { GoogleGenAI } from "@google/genai";
import { api } from './api';
import { Lap, Track } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_MODEL = 'gemini-2.5-flash';
const CHAT_MODEL = 'gemini-2.5-flash';

export const getRaceEngineerResponse = async (userQuery: string, history: any[], trackId: string) => {
  const track = await api.tracks.get(trackId);
  const laps = await api.laps.list(trackId);
  
  const bestLap = laps.find(l => l.is_personal_best);
  const consistency = laps.reduce((acc, lap) => acc + lap.mistakes, 0);

  const systemInstruction = `You are a world-class Race Engineer using the Racemind 3D Telemetry System.
  
  Current Context:
  - Track: ${track?.name || 'Unknown'}
  - Best Lap: ${bestLap?.lap_time || 'N/A'}s (Lap ${bestLap?.lap_number})
  - Total Laps Analyzed: ${laps.length}
  - Major Mistakes: ${consistency} detected across session.
  
  Your Capabilities:
  - Analyze telemetry trends (braking points, throttle maps).
  - Suggest racing line improvements.
  - Explain complex vehicle dynamics terms.
  
  Tone: Professional, concise, data-driven. Use motorsport terminology (understeer, trail braking, apex, rotation).
  `;

  try {
    const chat = ai.chats.create({
      model: CHAT_MODEL,
      config: { systemInstruction },
      history: history,
    });
    
    const response = await chat.sendMessage({ message: userQuery });
    return response.text;
  } catch (error) {
      console.error("Chat Error", error);
      return "Telemetry link unstable. Repeat request.";
  }
};
