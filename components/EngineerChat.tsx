
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic } from 'lucide-react';
import { getRaceEngineerResponse } from '../services/gemini';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const EngineerChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
      { role: 'model', text: "Radio check. I'm online and reading the data from Round 1. What do you need to know?" }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
      if (!input.trim()) return;
      
      const userMsg = { role: 'user' as const, text: input };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      const responseText = await getRaceEngineerResponse(
          input, 
          messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          't01' // Default trackId
      );

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Context */}
        <div className="hidden lg:block bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Bot size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Race Engineer AI</h3>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Connected to Pit Wall
                    </p>
                </div>
            </div>
            
            <div className="space-y-4 text-sm text-zinc-400">
                <p>I have access to all R1 data including:</p>
                <ul className="list-disc pl-4 space-y-2 text-zinc-300">
                    <li>Lap-by-lap telemetry</li>
                    <li>Tyre compound history</li>
                    <li>Gap analysis</li>
                    <li>Weather conditions</li>
                </ul>
            </div>

            <div className="mt-8">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-3">Suggested Queries</h4>
                <div className="space-y-2">
                    {["Who was faster in Sector 2?", "Did the strategy change work for TechSport?", "Analyze Jones's tyre degradation"].map((q) => (
                        <button 
                            key={q}
                            onClick={() => setInput(q)}
                            className="block w-full text-left p-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 transition-colors text-sm"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-zinc-700' : 'bg-indigo-600'}`}>
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                            m.role === 'user' 
                            ? 'bg-zinc-800 text-white rounded-tr-none' 
                            : 'bg-indigo-600/10 text-indigo-100 border border-indigo-500/20 rounded-tl-none'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                            <Bot size={14} />
                        </div>
                        <div className="flex items-center gap-1 bg-indigo-600/10 px-4 py-3 rounded-2xl rounded-tl-none border border-indigo-500/20">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about the race strategy..."
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder-zinc-500"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EngineerChat;
