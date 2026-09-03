import { useState, useEffect } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  ShieldCheck,
  Radio,
  Maximize2,
} from 'lucide-react';
import { TelemetryData } from '../../types';

interface Props {
  type: 'voice' | 'video';
  onClose: () => void;
  telemetry: TelemetryData | null;
}

export function CallModal({ type, onClose, telemetry }: Props) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(type === 'voice');
  const [callQuality, setCallQuality] = useState('Excellent (99.8% SNR)');

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="glass-panel w-full max-w-3xl rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col relative ambient-glow-cyan">
        {/* Top Call Info Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0a0e1a]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00f2ff] animate-ping"></div>
            <div>
              <h3 className="font-bold text-sm text-[#e1fdff] tracking-wide flex items-center gap-2">
                <span>Station Alpha-4 &bull; Ground Control</span>
                <span className="text-[10px] font-mono text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded">
                  {type === 'video' ? 'HD VIDEO LINK' : 'VOICE TRANSCEIVER'}
                </span>
              </h3>
              <span className="text-xs font-mono text-[#b9cacb]">
                Relay: {telemetry?.nodeCode || 'ORB-092'} (LEO 408km) &bull; Latency: {telemetry?.latencyMs || 24}ms
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-[#00f2ff] font-bold">
              {formatTimer(callDuration)}
            </div>
          </div>
        </div>

        {/* Call Stage Area */}
        <div className="relative w-full h-[360px] sm:h-[420px] bg-[#05070A] flex items-center justify-center overflow-hidden">
          {type === 'video' && !isVideoOff ? (
            /* Simulated Remote Satellite Video Stream */
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1517976487507-5b3a4a06d203?w=1000&auto=format&fit=crop&q=80"
                alt="Satellite Mission Video Feed"
                className="w-full h-full object-cover opacity-85"
              />
              {/* Scanline CRT overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

              {/* Picture in picture for self feed */}
              <div className="absolute bottom-4 right-4 w-32 sm:w-40 h-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#00dbe7] shadow-xl bg-black">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                  alt="Commander View"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-2 text-[9px] font-mono text-white bg-black/60 px-1 rounded">
                  YOU
                </span>
              </div>
            </div>
          ) : (
            /* Simulated Voice Transceiver Visualizer */
            <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-[#1b1f2c] border-2 border-[#00dbe7] flex items-center justify-center relative z-10 shadow-[0_0_35px_rgba(0,219,231,0.3)]">
                  <Radio className="w-12 h-12 text-[#00f2ff] animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border border-[#00f2ff] animate-ping opacity-30"></div>
                <div className="absolute -inset-4 rounded-full border border-[#8f03ff] animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-[#e1fdff] tracking-tight">Mission Control Alpha</h4>
                <p className="text-xs font-mono text-[#00f2ff] mt-1">
                  OPUS 12KBPS LOW-BITRATE VOICE CODEC ACTIVE
                </p>
              </div>

              {/* Animated Audio Equalizer Waveform */}
              <div className="flex items-end gap-1.5 h-10">
                {[40, 70, 90, 60, 30, 80, 100, 50, 60, 90, 40, 70, 30, 80].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%`, animationDuration: `${0.6 + (i % 4) * 0.2}s` }}
                    className="w-1.5 bg-gradient-to-t from-[#00dbe7] to-[#8f03ff] rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Telemetry Overlay Badges on Video/Audio */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 font-mono text-[10px] text-[#e1fdff] bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 pointer-events-none">
            <div className="flex items-center gap-1.5 text-[#00f2ff]">
              <ShieldCheck className="w-3 h-3" />
              <span>AES-256 E2EE SAT LINK</span>
            </div>
            <div>BEAM SNR: 28.4 dB (99.9% UPTIME)</div>
            <div>CODEC: OPUS ULTRA-LOW DELAY</div>
          </div>
        </div>

        {/* Bottom Call Controls Toolbar */}
        <div className="px-6 py-5 bg-[#0a0e1a] border-t border-white/10 flex justify-center items-center gap-4 sm:gap-6">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all cursor-pointer ${
              isMuted
                ? 'bg-[#93000a] text-[#ffdad6]'
                : 'bg-white/10 hover:bg-white/20 text-[#e1fdff]'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full transition-all cursor-pointer ${
              isVideoOff
                ? 'bg-white/5 text-[#849495]'
                : 'bg-white/10 hover:bg-white/20 text-[#e1fdff]'
            }`}
            title={isVideoOff ? 'Enable Camera' : 'Disable Camera'}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="p-4 rounded-full bg-[#ba1a1a] hover:bg-[#ffb4ab] text-white hover:text-black transition-all shadow-[0_0_25px_rgba(186,26,26,0.6)] cursor-pointer"
            title="Terminate Satellite Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
