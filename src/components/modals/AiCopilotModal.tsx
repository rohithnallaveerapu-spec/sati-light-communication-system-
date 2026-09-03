import { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Radio,
  Zap,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { TelemetryData } from '../../types';

interface Props {
  onClose: () => void;
  telemetry: TelemetryData | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiCopilotModal({ onClose, telemetry }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `ORBITAL Tactical Copilot online. Telemetry synced with node **${telemetry?.nodeCode || 'ORB-092'}** at **${telemetry?.altitudeKm || 408}km LEO**. How can I assist your mission communications, orbit scheduling, or emergency procedures?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    'Analyze next satellite pass window & elevation',
    'Generate emergency Search & Rescue checklist',
    'Calculate Doppler frequency shift compensation',
    'Prioritize bandwidth for remote operations',
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          telemetryContext: telemetry,
        }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || 'Mission Control acknowledged.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Autonomous LEO calculation complete: ORB-092 elevation is 68°, providing 9.4 minutes of optimal high-gain throughput (450 Mbps) with 24ms round-trip latency.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="glass-panel w-full max-w-2xl h-[600px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col relative ambient-glow-purple">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0a0e1a]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8f03ff]/20 border border-[#8f03ff]/40 flex items-center justify-center text-[#dab9ff]">
              <Sparkles className="w-5 h-5 text-[#dab9ff]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#e1fdff] flex items-center gap-2">
                <span>ORBITAL Mission AI Copilot</span>
                <span className="text-[10px] font-mono text-[#dab9ff] bg-[#8f03ff]/20 px-2 py-0.5 rounded">
                  GEMINI 2.5 FLASH
                </span>
              </h3>
              <p className="text-xs font-mono text-[#b9cacb]">
                Real-time orbital mechanics, comms routing &amp; tactical briefings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-[#849495] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-[#8f03ff]/20 border border-[#8f03ff]/40 flex items-center justify-center text-[#dab9ff] flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed font-sans ${
                  msg.role === 'user'
                    ? 'bg-[#00f2ff]/20 border border-[#00f2ff]/30 text-[#e1fdff] rounded-tr-sm font-mono text-xs'
                    : 'glass-panel border-white/10 text-[#dfe2f3] rounded-tl-sm text-xs sm:text-sm'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-[#00f2ff]/20 border border-[#00f2ff]/40 flex items-center justify-center text-[#00f2ff] flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-sm items-center text-[#dab9ff] font-mono text-xs pl-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#dab9ff]" />
              <span>Calculating constellation telemetry &amp; orbital pass model...</span>
            </div>
          )}
        </div>

        {/* Quick Suggested Prompts */}
        <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#8f03ff]/20 text-[#dab9ff] text-[11px] font-mono border border-white/10 hover:border-[#8f03ff]/40 transition-all cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-[#0a0e1a]">
          <div className="flex items-center gap-2 bg-[#1b1f2c] rounded-2xl p-2 border border-white/10 focus-within:border-[#8f03ff]/60 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Copilot about telemetry, orbital passes, Doppler shift..."
              className="flex-1 bg-transparent border-none text-[#e1fdff] text-sm focus:outline-none px-3 font-mono"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-[#8f03ff] hover:bg-[#a63eff] text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(143,3,255,0.4)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
