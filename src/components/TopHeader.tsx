import { Battery, Sparkles, Brain, AlertOctagon, PhoneCall, Video } from 'lucide-react';
import { TelemetryData } from '../types';

interface Props {
  telemetry: TelemetryData | null;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenCall: (type: 'voice' | 'video') => void;
  onOpenEmergency: () => void;
  onOpenAiAssist: () => void;
  emergencyActive?: boolean;
}

export function TopHeader({
  telemetry,
  focusMode,
  onToggleFocus,
  onOpenCall,
  onOpenEmergency,
  onOpenAiAssist,
  emergencyActive = false,
}: Props) {
  return (
    <header
      id="main-top-app-bar"
      className="sticky top-0 z-40 w-full bg-[#0f131f]/70 dark:bg-[#1b1f2c]/60 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] px-4 sm:px-8 py-3.5 flex justify-between items-center transition-all"
    >
      {/* Left side: Avatar + App Title + Signal indicators */}
      <div className="flex items-center gap-3.5">
        <div className="lg:hidden relative">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
            alt="Commander Profile"
            className="w-8 h-8 rounded-full border border-[#00dbe7]/60 object-cover"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#00f2ff]"></span>
        </div>

        {/* Signal Bars Indicator */}
        <div className="hidden sm:flex items-end gap-1 h-5 px-2 py-0.5 rounded bg-white/5 border border-white/10" title="Satellite Link Signal Strength">
          <div className="w-1 bg-[#00dbe7] rounded-sm h-2 animate-signal-1"></div>
          <div className="w-1 bg-[#00dbe7] rounded-sm h-3 animate-signal-2"></div>
          <div className="w-1 bg-[#00dbe7] rounded-sm h-4 animate-signal-3"></div>
          <div className="w-1 bg-[#00dbe7] rounded-sm h-5 animate-signal-4 shadow-[0_0_8px_#00dbe7]"></div>
        </div>

        {/* App Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl sm:text-2xl text-[#e1fdff] tracking-tight drop-shadow-[0_0_15px_rgba(0,219,231,0.4)] flex items-center gap-2">
              <span>Orbital</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20 font-bold">
                SatCom v2.4
              </span>
            </h1>
          </div>
          <p className="hidden md:block text-[11px] font-mono text-[#b9cacb]">
            ACTIVE NODE: <span className="text-[#00f2ff] font-semibold">{telemetry?.nodeCode || 'ORB-092'}</span> (LEO {telemetry?.altitudeKm || 408}km @ {telemetry?.velocityKmS || 7.66}km/s)
          </p>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Tactical Copilot button */}
        <button
          id="btn-top-ai-copilot"
          onClick={onOpenAiAssist}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8f03ff]/20 border border-[#8f03ff]/40 text-[#efdbff] hover:bg-[#8f03ff]/30 text-xs font-mono transition-all duration-200 shadow-[0_0_15px_rgba(143,3,255,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#dab9ff] animate-pulse" />
          <span className="hidden sm:inline">AI COPILOT</span>
        </button>

        {/* Quick Call Actions */}
        <button
          id="btn-top-voice-call"
          onClick={() => onOpenCall('voice')}
          className="p-2 rounded-full glass-panel hover:border-[#00dbe7]/50 text-[#00dbe7] hover:bg-[#00dbe7]/10 transition-all"
          title="Voice Call via Satellite"
        >
          <PhoneCall className="w-4 h-4" />
        </button>
        <button
          id="btn-top-video-call"
          onClick={() => onOpenCall('video')}
          className="p-2 rounded-full glass-panel hover:border-[#00dbe7]/50 text-[#00dbe7] hover:bg-[#00dbe7]/10 transition-all"
          title="Video Link Station Alpha-4"
        >
          <Video className="w-4 h-4" />
        </button>

        {/* Focus Mode Toggle */}
        <button
          id="btn-top-focus-toggle"
          onClick={onToggleFocus}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
            focusMode
              ? 'bg-[#8f03ff]/30 border border-[#dab9ff] text-[#dab9ff] shadow-[0_0_20px_rgba(143,3,255,0.3)]'
              : 'glass-panel text-[#b9cacb] hover:text-[#e1fdff] hover:border-white/20'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{focusMode ? 'FOCUS: ON' : 'FOCUS MODE'}</span>
        </button>

        {/* Emergency SOS Shortcut if not active */}
        {!emergencyActive && (
          <button
            id="btn-top-emergency-sos"
            onClick={onOpenEmergency}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#93000a]/30 border border-[#ffb4ab]/40 text-[#ffdad6] hover:bg-[#93000a]/60 text-xs font-mono font-bold transition-all"
            title="Emergency Priority Satellite Override"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-[#ffb4ab]" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        )}

        {/* Battery Telemetry */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#b9cacb]">
          <span>{telemetry?.batteryPercent || 98}%</span>
          <Battery className="w-4 h-4 text-[#00f2ff]" />
        </div>
      </div>
    </header>
  );
}
