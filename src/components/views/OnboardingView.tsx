import { Rocket, Satellite as SatIcon, ShieldCheck, Activity, Globe } from 'lucide-react';
import { ShaderBackground } from '../ShaderBackground';
import { ThreeSatelliteHero } from '../ThreeSatelliteHero';

interface Props {
  onInitiateLink: () => void;
  onExploreCoverage: () => void;
}

export function OnboardingView({ onInitiateLink, onExploreCoverage }: Props) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#05070A] text-[#dfe2f3] p-4 sm:p-8">
      {/* Background Shader & Starfield */}
      <ShaderBackground className="absolute inset-0 w-full h-full opacity-70" intensity={1.2} />

      {/* Subtle 3D Satellite background floating behind card */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-35 scale-125">
        <ThreeSatelliteHero interactive={false} />
      </div>

      {/* Main Glass Card Container */}
      <main className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Orbital Logo Badge */}
        <div className="mb-8 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl glass-panel flex items-center justify-center p-3 ambient-glow-cyan relative group">
          <div className="w-full h-full rounded-xl bg-[#0f131f] border border-[#00dbe7]/30 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Rocket & Orbital ring SVG */}
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#00dbe7]">
              <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="#8f03ff" strokeWidth="2.5" transform="rotate(-30 50 50)" />
              <ellipse cx="50" cy="50" rx="38" ry="18" fill="none" stroke="#00dbe7" strokeWidth="2.5" transform="rotate(30 50 50)" />
              <path
                d="M50 24 L56 36 L52 48 L56 56 L50 52 L44 56 L48 48 L44 36 Z"
                fill="#00f2ff"
                stroke="#e1fdff"
                strokeWidth="1.5"
              />
            </svg>
            <span className="font-mono font-black text-[10px] tracking-widest text-white mt-1">ORBITAL</span>
          </div>
        </div>

        {/* Typography Cluster */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl ambient-glow-cyan w-full relative overflow-hidden">
          {/* Signal Motif Top Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00dbe7] to-transparent opacity-80"></div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] text-xs font-mono mb-6">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>GLOBAL LEO CONSTELLATION ONLINE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#e1fdff] tracking-tight mb-4 drop-shadow-[0_0_25px_rgba(0,219,231,0.4)]">
            Connect Beyond Boundaries
          </h1>

          <p className="text-base sm:text-lg text-[#b9cacb] max-w-lg mx-auto mb-10 leading-relaxed">
            Experience high-speed satellite communication, mission-critical voice & video telemetry, and encrypted operational productivity anywhere on Earth.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="btn-onboarding-initiate-link"
              onClick={onInitiateLink}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-mono font-bold text-sm rounded-full hover:bg-[#00f2ff] hover:text-black transition-all shadow-[0_0_25px_rgba(0,219,231,0.35)] hover:shadow-[0_0_35px_rgba(0,219,231,0.7)] flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
            >
              <Rocket className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>Initiate Link</span>
            </button>

            <button
              id="btn-onboarding-explore-coverage"
              onClick={onExploreCoverage}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#00dbe7] text-[#00dbe7] font-mono font-bold text-sm rounded-full hover:bg-[#00dbe7]/10 hover:border-[#74f5ff] transition-all flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
            >
              <Globe className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span>Explore Coverage</span>
            </button>
          </div>
        </div>

        {/* Decorative Tech Elements in Bottom corners */}
        <div className="w-full flex justify-between items-center mt-8 text-xs font-mono text-[#849495] px-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse"></span>
            <span className="text-[#00dbe7]">SYS.ONL</span>
            <span>|</span>
            <span>LATENCY: 12MS</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#dab9ff]" />
            <span className="text-[#dab9ff]">ORBITAL_NET_V2</span>
            <span>|</span>
            <span>AES-256 ENCRYPTED</span>
          </div>
        </div>
      </main>
    </div>
  );
}
