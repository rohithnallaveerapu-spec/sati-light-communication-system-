import { useState } from 'react';
import { TelemetryData, ActiveTab } from '../../types';
import { ThreeSatelliteHero } from '../ThreeSatelliteHero';
import {
  PhoneCall,
  Video,
  Lock,
  CheckCircle2,
  Satellite as SatIcon,
  AlertTriangle,
  Radio,
  ArrowRight,
  Globe,
  Mic,
  Activity,
  Zap,
} from 'lucide-react';

interface Props {
  telemetry: TelemetryData | null;
  onNavigate: (tab: ActiveTab) => void;
  onOpenCall: (type: 'voice' | 'video') => void;
  onOpenEmergency: () => void;
}

export function DashboardView({ telemetry, onNavigate, onOpenCall, onOpenEmergency }: Props) {
  const [activeTimeframe, setActiveTimeframe] = useState<'24H' | '7D' | '30D'>('24H');
  const [hoverPoint, setHoverPoint] = useState<number | null>(null);

  const history = telemetry?.history24h || [
    { hour: '00:00', valueGb: 2.4, throughputMbps: 380 },
    { hour: '04:00', valueGb: 4.1, throughputMbps: 420 },
    { hour: '08:00', valueGb: 3.6, throughputMbps: 390 },
    { hour: '12:00', valueGb: 7.8, throughputMbps: 680 },
    { hour: '16:00', valueGb: 4.2, throughputMbps: 450 },
    { hour: '20:00', valueGb: 9.9, throughputMbps: 840 },
    { hour: 'NOW', valueGb: 10.0, throughputMbps: 840 },
  ];

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Hero Banner / 3D Satellite Node */}
      <section
        id="hero-satellite-node-card"
        className="relative w-full h-[320px] sm:h-[390px] lg:h-[430px] rounded-2xl overflow-hidden glass-panel flex items-center justify-center border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {/* Background cosmic radial lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a]/90 via-[#05070A]/80 to-[#171b28]/60 z-0"></div>

        {/* 3D WebGL Satellite */}
        <div className="absolute inset-0 z-10">
          <ThreeSatelliteHero nodeCode={telemetry?.nodeCode || 'ORB-092'} interactive={true} />
        </div>

        {/* Node Overlay Badge */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#0a0e1a]/60 backdrop-blur-md rounded-2xl border border-white/10 max-w-md mx-auto shadow-[0_0_50px_rgba(0,219,231,0.15)] pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff] animate-ping"></span>
            <span className="font-mono text-xs font-bold tracking-widest text-[#00dbe7] uppercase">
              TRANSMITTING
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-[#e1fdff] tracking-tight drop-shadow-[0_0_20px_rgba(0,219,231,0.6)]">
            {telemetry?.nodeCode || 'ORB-092'}
          </h2>
          <p className="font-mono text-xs text-[#b9cacb] uppercase tracking-[0.25em] mt-2">
            ACTIVE ORBIT &bull; {telemetry?.visibleSatellites?.length || 5} CONSTEL NODES
          </p>
        </div>

        {/* Bottom Telemetry Chip */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 glass-panel px-4 py-2 rounded-xl border-l-2 border-l-[#00dbe7] text-xs font-mono text-[#b9cacb]">
          <span>Telemetry </span>
          <span className="text-[#e1fdff] font-semibold ml-1">
            Alt: {telemetry?.altitudeKm || 408}km / Vel: {telemetry?.velocityKmS || 7.66}km/s
          </span>
        </div>

        {/* Right Corner Constellation Switcher shortcut */}
        <button
          onClick={() => onNavigate('map')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 glass-panel hover:bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-[#00dbe7] flex items-center gap-2 transition-all cursor-pointer"
        >
          <SatIcon className="w-3.5 h-3.5" />
          <span>Switch Node</span>
        </button>
      </section>

      {/* Grid Row: Connection Status & Quick Actions + Emergency Override */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        {/* Connection Status Card */}
        <div className="md:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between ambient-glow-cyan">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#e1fdff] tracking-tight">Connection Status</h3>
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="w-3 h-3 rounded-full bg-[#00f2ff] shadow-[0_0_12px_#00f2ff]"></div>
                  <span className="font-mono text-sm text-[#00f2ff] font-bold">
                    Connected: {telemetry?.nodeCode || 'SAT-092'}
                  </span>
                </div>
              </div>
              <span className="p-2 rounded-xl bg-[#00f2ff]/10 text-[#00dbe7] animate-pulse">
                <SatIcon className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-4">
              <div className="data-chip rounded-xl p-3.5 flex flex-col gap-1">
                <span className="font-mono text-[11px] text-[#b9cacb] uppercase tracking-wider">LATENCY</span>
                <span className="font-mono text-xl font-bold text-[#efdbff] drop-shadow-[0_0_8px_rgba(239,219,255,0.4)]">
                  {telemetry?.latencyMs || 24}ms
                </span>
                <span className="text-[10px] font-mono text-[#00dbe7]">&plusmn; 0.4ms jitter</span>
              </div>

              <div className="data-chip rounded-xl p-3.5 flex flex-col gap-1">
                <span className="font-mono text-[11px] text-[#b9cacb] uppercase tracking-wider">BANDWIDTH</span>
                <span className="font-mono text-xl font-bold text-[#efdbff] drop-shadow-[0_0_8px_rgba(239,219,255,0.4)]">
                  {telemetry?.bandwidthMbps || 450}Mbps
                </span>
                <span className="text-[10px] font-mono text-[#dab9ff]">QoS Priority L1</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/5 flex justify-between items-center text-xs font-mono text-[#849495]">
            <span>Beam Elevation: 68&deg;</span>
            <span className="text-[#00dbe7]">Signal: 100% (4/4 Bars)</span>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="md:col-span-7 glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#e1fdff] tracking-tight">Quick Actions</h3>
            <span className="text-xs font-mono text-[#849495]">REMOTE COMMS DISPATCH</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 h-full">
            {/* Voice Call */}
            <button
              id="quick-action-voice-call"
              onClick={() => onOpenCall('voice')}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1b1f2c]/50 border border-white/5 hover:border-[#00dbe7]/60 hover:bg-[#00dbe7]/10 transition-all duration-200 group shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#262a37] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(0,219,231,0.4)] text-[#00dbe7]">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-semibold text-[#b9cacb] group-hover:text-[#00dbe7]">
                Voice Call
              </span>
            </button>

            {/* Video Call */}
            <button
              id="quick-action-video-call"
              onClick={() => onOpenCall('video')}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1b1f2c]/50 border border-white/5 hover:border-[#00dbe7]/60 hover:bg-[#00dbe7]/10 transition-all duration-200 group shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#262a37] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(0,219,231,0.4)] text-[#00dbe7]">
                <Video className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-semibold text-[#b9cacb] group-hover:text-[#00dbe7]">
                Video Call
              </span>
            </button>

            {/* Secure Msg */}
            <button
              id="quick-action-secure-msg"
              onClick={() => onNavigate('chat')}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1b1f2c]/50 border border-white/5 hover:border-[#00dbe7]/60 hover:bg-[#00dbe7]/10 transition-all duration-200 group shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#262a37] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(0,219,231,0.4)] text-[#00dbe7]">
                <Lock className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-semibold text-[#b9cacb] group-hover:text-[#00dbe7]">
                Secure Msg
              </span>
            </button>

            {/* Task Center */}
            <button
              id="quick-action-task-center"
              onClick={() => onNavigate('tasks')}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#1b1f2c]/50 border border-white/5 hover:border-[#00dbe7]/60 hover:bg-[#00dbe7]/10 transition-all duration-200 group shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#262a37] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(0,219,231,0.4)] text-[#00dbe7]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="font-mono text-xs font-semibold text-[#b9cacb] group-hover:text-[#00dbe7]">
                Task Center
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Data Telemetry Chart & Emergency Comms & Network Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Data Telemetry Graph */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-2xl flex flex-col justify-between ambient-glow-cyan">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#e1fdff] tracking-tight">Data Telemetry</h3>
              <p className="text-xs font-mono text-[#b9cacb]">REAL-TIME THROUGHPUT &amp; CONSTELLATION FLUX</p>
            </div>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              {(['24H', '7D', '30D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTimeframe === tf ? 'bg-[#00f2ff] text-black font-bold' : 'text-[#849495] hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Telemetry Curve */}
          <div className="relative h-48 sm:h-56 w-full border-b border-l border-white/15 flex items-end px-2 pt-6 pb-1">
            {/* Y Axis Labels */}
            <div className="absolute left-[-24px] bottom-0 h-full flex flex-col justify-between text-[10px] font-mono text-[#849495] py-2 pointer-events-none">
              <span>10G</span>
              <span>5G</span>
              <span>0</span>
            </div>

            {/* SVG Path */}
            <div className="w-full h-full relative overflow-hidden flex items-end">
              <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(0,219,231,0.4)]" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00dbe7" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#00dbe7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <path d="M0,100 L0,60 Q15,40 25,50 T50,30 T75,40 T90,20 T100,10 L100,100 Z" fill="url(#chartGradient)" />

                {/* Main Stroke */}
                <path
                  d="M0,60 Q15,40 25,50 T50,30 T75,40 T90,20 T100,10"
                  fill="none"
                  stroke="#00dbe7"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />

                {/* Interactive Points */}
                <circle cx="25" cy="50" fill="#00dbe7" r="2.5" className="opacity-80" />
                <circle cx="50" cy="30" fill="#00dbe7" r="2.5" className="opacity-80" />
                <circle cx="75" cy="40" fill="#00dbe7" r="2.5" className="opacity-80" />
                <circle cx="90" cy="20" fill="#00dbe7" r="2.5" className="opacity-80" />
                {/* Current Value Pulsing Dot */}
                <circle cx="100" cy="10" fill="#00f2ff" r="3.5" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Bottom Time Marks */}
          <div className="flex justify-between text-[11px] font-mono text-[#849495] mt-3 pt-2 border-t border-white/5">
            {history.map((h, i) => (
              <span key={i} className={i === history.length - 1 ? 'text-[#00f2ff] font-bold' : ''}>
                {h.hour}
              </span>
            ))}
          </div>
        </div>

        {/* Emergency Override & Network Performance Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Emergency Comms Box */}
          <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-[#ffb4ab] bg-[#93000a]/15 flex flex-col justify-between ambient-glow-red">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 rounded-xl bg-[#93000a]/40 text-[#ffb4ab]">
                <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
              </span>
              <div>
                <h3 className="font-bold text-[#ffb4ab] text-base">Emergency Comms</h3>
                <span className="text-[10px] font-mono text-[#ffdad6]/70">COSPAS-SARSAT 406 MHz</span>
              </div>
            </div>

            <p className="text-xs text-[#ffdad6]/80 mb-4 leading-relaxed">
              Immediate priority channel override for critical ground stations and search-and-rescue beacons.
            </p>

            <button
              id="btn-dash-initiate-override"
              onClick={onOpenEmergency}
              className="w-full bg-[#ffb4ab] hover:bg-[#ffdad6] text-[#690005] font-mono font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,180,171,0.4)] flex justify-center items-center gap-2 cursor-pointer active:scale-95"
            >
              <Radio className="w-4 h-4 text-[#690005]" />
              <span>Initiate Override</span>
            </button>
          </div>

          {/* Network Performance */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#e1fdff] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00dbe7]" />
                <span>Network Performance</span>
              </h3>
              <span className="text-[10px] font-mono text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded">LEO 840M</span>
            </div>

            <div className="space-y-4">
              {/* Downlink */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#b9cacb]">Downlink</span>
                  <span className="text-[#e1fdff] font-bold">{telemetry?.downlinkMbps || 840} Mbps</span>
                </div>
                <div className="h-1.5 bg-[#1b1f2c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00dbe7] to-[#74f5ff] w-[85%] rounded-full shadow-[0_0_10px_rgba(0,219,231,0.5)]"></div>
                </div>
              </div>

              {/* Uplink */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-[#b9cacb]">Uplink</span>
                  <span className="text-[#e1fdff] font-bold">{telemetry?.uplinkMbps || 120} Mbps</span>
                </div>
                <div className="h-1.5 bg-[#1b1f2c] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8f03ff] w-[40%] rounded-full opacity-80 shadow-[0_0_8px_#8f03ff]"></div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex justify-between text-xs font-mono text-[#b9cacb]">
                <span>Global Latency Avg:</span>
                <span className="text-[#00f2ff] font-bold">18ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tiles Row: Coverage Map Tile, Comms Hub, Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Coverage Map Tile */}
        <div
          id="tile-coverage-map"
          onClick={() => onNavigate('map')}
          className="glass-panel rounded-2xl p-6 ambient-glow-cyan group cursor-pointer hover:border-[#00dbe7]/50 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1b1f2c] rounded-xl text-[#00dbe7] group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#e1fdff] text-base">Coverage Map</h3>
                <span className="text-xs font-mono text-[#b9cacb]">Constellation Global Reach</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#849495] group-hover:text-[#00dbe7] group-hover:translate-x-1 transition-all" />
          </div>

          <div className="h-24 bg-[#0a0e1a] rounded-xl overflow-hidden relative mb-3 border border-white/5 map-radar-grid flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#00f2ff] pulse-indicator"></div>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#00dbe7] bg-[#0a0e1a]/80 px-2 py-0.5 rounded border border-[#00dbe7]/30">
              98.4% Global Coverage
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-[#b9cacb]">
            <span>Active Constellation Nodes</span>
            <span className="text-[#e1fdff] font-bold">42 Nodes</span>
          </div>
        </div>

        {/* Comms Hub Tile */}
        <div
          id="tile-comms-hub"
          onClick={() => onNavigate('chat')}
          className="glass-panel rounded-2xl p-6 ambient-glow-cyan group cursor-pointer hover:border-[#00dbe7]/50 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1b1f2c] rounded-xl text-[#00dbe7] group-hover:scale-110 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#e1fdff] text-base">Comms Hub</h3>
                <span className="text-xs font-mono text-[#b9cacb]">Encrypted Channels</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#849495] group-hover:text-[#00dbe7] group-hover:translate-x-1 transition-all" />
          </div>

          <div className="flex flex-col gap-2.5 mb-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1b1f2c]/60 border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#8f03ff]/20 flex items-center justify-center text-[#efdbff]">
                  <Mic className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono text-[#e1fdff]">Ground Control Alpha</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse"></span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1b1f2c]/30 border border-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#849495]">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono text-[#b9cacb]">Station Alpha-4 Feed</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#849495]"></span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-[#b9cacb]">
            <span>Active Session</span>
            <span className="text-[#00dbe7] font-semibold">Secure Key Locked</span>
          </div>
        </div>

        {/* Productivity & Analytics Tile */}
        <div
          id="tile-productivity-analytics"
          onClick={() => onNavigate('tasks')}
          className="glass-panel rounded-2xl p-6 ambient-glow-cyan group cursor-pointer hover:border-[#00dbe7]/50 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#1b1f2c] rounded-xl text-[#00dbe7] group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#e1fdff] text-base">Analytics</h3>
                <span className="text-xs font-mono text-[#b9cacb]">Efficiency &amp; Load</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#849495] group-hover:text-[#00dbe7] group-hover:translate-x-1 transition-all" />
          </div>

          {/* Bar sparkline */}
          <div className="flex items-end gap-2 h-20 mb-3 pb-2 border-b border-white/5">
            <div className="flex-1 bg-white/10 rounded-t-sm h-[30%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[50%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[40%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-[#00dbe7]/40 rounded-t-sm h-[80%] relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[#00dbe7]">PEAK</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-t-sm h-[60%] hover:bg-[#00dbe7]/40 transition-colors"></div>
            <div className="flex-1 bg-[#00f2ff] rounded-t-sm h-[95%] shadow-[0_0_12px_#00f2ff]"></div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-[#b9cacb]">
            <span>Data Throughput</span>
            <span className="text-[#00f2ff] font-bold">+12.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
