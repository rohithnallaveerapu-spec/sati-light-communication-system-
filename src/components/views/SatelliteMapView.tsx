import { useState, useRef, useEffect } from 'react';
import { TelemetryData, Satellite } from '../../types';
import {
  Satellite as SatIcon,
  Search,
  CheckCircle,
  Radio,
  Compass,
  Zap,
  Layers,
  MapPin,
  Thermometer,
  Gauge,
  Activity,
  BatteryCharging,
  SunMedium,
  Crosshair,
  Signal,
  Wifi,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  telemetry: TelemetryData | null;
  onSelectSatellite: (satId: string) => Promise<void>;
}

interface EnrichedSatellite extends Satellite {
  pixelX: number;
  pixelY: number;
}

export function SatelliteMapView({ telemetry, onSelectSatellite }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [activeSatFilter, setActiveSatFilter] = useState<'ALL' | 'LEO' | 'MEO' | 'GEO'>('ALL');
  const [hoveredSatId, setHoveredSatId] = useState<string | null>(null);
  const [selectedSatId, setSelectedSatId] = useState<string | null>(null);
  const [timeTick, setTimeTick] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Subtle orbital drifting animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((t) => (t + 1) % 3600);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const defaultSatellites: Satellite[] = [
    {
      id: 'orb-092',
      code: 'ORB-092',
      name: 'Orbital Alpha Node',
      orbitType: 'LEO',
      altitudeKm: 408,
      velocityKmS: 7.66,
      elevationDeg: 68,
      azimuthDeg: 142,
      latencyMs: 24,
      bandwidthMbps: 450,
      signalBars: 4,
      status: 'active',
      operationalStatus: 'Nominal - Primary Beam Locked',
      payloadTempC: 21.4,
      solarArrayOutputW: 1420,
      batteryPercent: 98,
      snrDb: 28.4,
      frequencyGhz: 14.25,
      dopplerShiftKhz: 12.4,
      inclinationDeg: 51.6,
      beamFootprintKm: 850,
      lat: 45.9234,
      lng: -104.2812,
      mapX: 50,
      mapY: 38,
      orbitPathId: 1,
      isCurrentNode: true,
    },
    {
      id: 'orb-a1',
      code: 'ORB-A1',
      name: 'Orbital Polar Relay A1',
      orbitType: 'LEO',
      altitudeKm: 550,
      velocityKmS: 7.58,
      elevationDeg: 45,
      azimuthDeg: 38,
      latencyMs: 32,
      bandwidthMbps: 420,
      signalBars: 4,
      status: 'active',
      operationalStatus: 'Nominal - High Inclination Track',
      payloadTempC: 19.8,
      solarArrayOutputW: 1380,
      batteryPercent: 94,
      snrDb: 26.1,
      frequencyGhz: 14.18,
      dopplerShiftKhz: -8.7,
      inclinationDeg: 97.4,
      beamFootprintKm: 980,
      lat: 52.1245,
      lng: -89.4321,
      mapX: 28,
      mapY: 26,
      orbitPathId: 2,
      isCurrentNode: false,
    },
    {
      id: 'orb-b7',
      code: 'ORB-B7',
      name: 'Orbital Equatorial Node B7',
      orbitType: 'LEO',
      altitudeKm: 620,
      velocityKmS: 7.52,
      elevationDeg: 22,
      azimuthDeg: 210,
      latencyMs: 48,
      bandwidthMbps: 280,
      signalBars: 2,
      status: 'active',
      operationalStatus: 'Nominal - Low Horizon Ascent',
      payloadTempC: 24.2,
      solarArrayOutputW: 1510,
      batteryPercent: 91,
      snrDb: 18.6,
      frequencyGhz: 14.32,
      dopplerShiftKhz: 21.3,
      inclinationDeg: 28.5,
      beamFootprintKm: 1100,
      lat: 12.8712,
      lng: -45.1298,
      mapX: 74,
      mapY: 64,
      orbitPathId: 3,
      isCurrentNode: false,
    },
    {
      id: 'orb-sat-7',
      code: 'ORB-SAT-7',
      name: 'Orbital High-Gain Emergency Relay 7',
      orbitType: 'MEO',
      altitudeKm: 1200,
      velocityKmS: 6.94,
      elevationDeg: 42,
      azimuthDeg: 180,
      latencyMs: 38,
      bandwidthMbps: 350,
      signalBars: 3,
      status: 'standby',
      operationalStatus: 'Standby - Emergency SAR Transponder Ready',
      payloadTempC: 17.6,
      solarArrayOutputW: 1650,
      batteryPercent: 99,
      snrDb: 22.8,
      frequencyGhz: 12.45,
      dopplerShiftKhz: 4.2,
      inclinationDeg: 55.0,
      beamFootprintKm: 1800,
      lat: 38.4412,
      lng: -112.5512,
      mapX: 20,
      mapY: 58,
      orbitPathId: 1,
      isCurrentNode: false,
    },
    {
      id: 'orb-g3',
      code: 'ORB-G3',
      name: 'Orbital Geo Synchronous 3',
      orbitType: 'GEO',
      altitudeKm: 35786,
      velocityKmS: 3.07,
      elevationDeg: 18,
      azimuthDeg: 165,
      latencyMs: 240,
      bandwidthMbps: 150,
      signalBars: 3,
      status: 'active',
      operationalStatus: 'Nominal - Geostationary Constant Lock',
      payloadTempC: 15.3,
      solarArrayOutputW: 2800,
      batteryPercent: 100,
      snrDb: 16.5,
      frequencyGhz: 28.50,
      dopplerShiftKhz: 0.1,
      inclinationDeg: 0.0,
      beamFootprintKm: 6500,
      lat: 0.0,
      lng: -100.0,
      mapX: 86,
      mapY: 20,
      orbitPathId: 2,
      isCurrentNode: false,
    },
  ];

  // Merge server telemetry visible satellites with fallback diagnostic values if missing
  const rawSatellites: Satellite[] = telemetry?.visibleSatellites || defaultSatellites;
  
  const satellites: EnrichedSatellite[] = rawSatellites.map((s, idx) => {
    const fallback = defaultSatellites[idx % defaultSatellites.length];
    const isCurrent = s.code === (telemetry?.nodeCode || 'ORB-092') || s.isCurrentNode;

    // Calculate subtle smooth orbital drift
    const driftAngle = (timeTick * 0.05 + idx * 45) * (Math.PI / 180);
    const driftX = Math.cos(driftAngle) * 1.5;
    const driftY = Math.sin(driftAngle) * 1.2;

    const baseMapX = s.mapX ?? fallback.mapX ?? (20 + (idx * 20) % 65);
    const baseMapY = s.mapY ?? fallback.mapY ?? (25 + (idx * 15) % 55);

    return {
      ...s,
      isCurrentNode: isCurrent,
      operationalStatus: s.operationalStatus || fallback.operationalStatus || 'Nominal - Active Uplink',
      payloadTempC: s.payloadTempC ?? fallback.payloadTempC ?? 21.4,
      solarArrayOutputW: s.solarArrayOutputW ?? fallback.solarArrayOutputW ?? 1420,
      batteryPercent: s.batteryPercent ?? fallback.batteryPercent ?? 96,
      snrDb: s.snrDb ?? fallback.snrDb ?? 28.4,
      frequencyGhz: s.frequencyGhz ?? fallback.frequencyGhz ?? 14.25,
      dopplerShiftKhz: s.dopplerShiftKhz ?? fallback.dopplerShiftKhz ?? 12.4,
      inclinationDeg: s.inclinationDeg ?? fallback.inclinationDeg ?? 53.0,
      beamFootprintKm: s.beamFootprintKm ?? fallback.beamFootprintKm ?? 850,
      pixelX: Math.min(Math.max(baseMapX + driftX, 8), 92),
      pixelY: Math.min(Math.max(baseMapY + driftY, 12), 85),
    };
  });

  const filteredSatellites = satellites.filter(
    (s) => activeSatFilter === 'ALL' || s.orbitType === activeSatFilter
  );

  // Determine which satellite is currently in focus (hovered first, then selected, else current active node)
  const activeFocusSat =
    satellites.find((s) => s.id === hoveredSatId) ||
    satellites.find((s) => s.id === selectedSatId) ||
    satellites.find((s) => s.isCurrentNode) ||
    satellites[0];

  const groundStation = {
    x: 48, // percentage
    y: 54, // percentage
    code: 'STATION ALPHA (MT-01)',
    lat: '45.9234° N',
    lng: '104.2812° W',
  };

  const handleSearchBestConnection = async () => {
    setIsScanning(true);
    setScanMessage('Scanning orbital planes for optimal SNR, highest Elevation & lowest Latency...');

    setTimeout(() => {
      setScanMessage('Calculating Doppler shift compensation & thermal margins across LEO constellations...');
    }, 1000);

    setTimeout(async () => {
      const best = satellites.reduce((prev, curr) => (prev.latencyMs < curr.latencyMs ? prev : curr));
      await onSelectSatellite(best.id);
      setSelectedSatId(best.id);
      setIsScanning(false);
      setScanMessage(`Locked onto ${best.code} (${best.name}) • Latency: ${best.latencyMs}ms • SNR: ${best.snrDb}dB`);
      setTimeout(() => setScanMessage(null), 4000);
    }, 2200);
  };

  const handleSatelliteClick = async (sat: Satellite) => {
    setSelectedSatId(sat.id);
    await onSelectSatellite(sat.id);
  };

  return (
    <div
      ref={mapContainerRef}
      className="relative flex-1 w-full min-h-[calc(100vh-80px)] flex flex-col justify-between overflow-hidden bg-[#05070A] p-4 sm:p-6 lg:p-8 select-none"
    >
      {/* Dynamic Radar Coordinate & Constellation Grid Backdrop */}
      <div className="absolute inset-0 w-full h-full map-radar-grid overflow-hidden pointer-events-none opacity-85">
        {/* Orbital Elliptical Trajectories & Vector Links (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1000 600"
        >
          <defs>
            <linearGradient id="orbitGlowLEO" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00dbe7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#8f03ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00dbe7" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="orbitGlowMEO" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dab9ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00dbe7" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="laserBeamGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#8f03ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Primary Orbital Plane 1 */}
          <path
            d="M -50,380 Q 480,40 1050,480"
            fill="none"
            stroke="url(#orbitGlowLEO)"
            strokeWidth="1.8"
            strokeDasharray="6 6"
            className="opacity-70"
          />

          {/* Primary Orbital Plane 2 */}
          <path
            d="M 50,-50 Q 520,320 950,680"
            fill="none"
            stroke="url(#orbitGlowMEO)"
            strokeWidth="1.4"
            strokeDasharray="4 8"
          />

          {/* Primary Orbital Plane 3 (Equatorial) */}
          <path
            d="M -30,120 Q 500,550 1050,180"
            fill="none"
            stroke="rgba(0,219,231,0.2)"
            strokeWidth="1.2"
            strokeDasharray="8 8"
          />

          {/* High GEO Circular Arc */}
          <ellipse
            cx="500"
            cy="300"
            rx="460"
            ry="240"
            fill="none"
            stroke="rgba(143,3,255,0.15)"
            strokeWidth="1"
            strokeDasharray="12 12"
          />

          {/* Active Target Laser / Uplink Vector from Ground Station to Active/Hovered Satellite */}
          {activeFocusSat && (
            <g>
              <line
                x1={`${groundStation.x * 10}`}
                y1={`${groundStation.y * 6}`}
                x2={`${activeFocusSat.pixelX * 10}`}
                y2={`${activeFocusSat.pixelY * 6}`}
                stroke="url(#laserBeamGrad)"
                strokeWidth="2"
                strokeDasharray="5 5"
                filter="url(#glowEffect)"
                className="animate-pulse"
              />
              {/* Uplink Carrier Wave Signal Pulses */}
              <circle
                r="3"
                fill="#00f2ff"
                cx={`${(groundStation.x + (activeFocusSat.pixelX - groundStation.x) * 0.5) * 10}`}
                cy={`${(groundStation.y + (activeFocusSat.pixelY - groundStation.y) * 0.5) * 6}`}
                className="animate-ping"
              />
            </g>
          )}

          {/* Ground Station Anchor Graphic */}
          <g transform={`translate(${groundStation.x * 10}, ${groundStation.y * 6})`}>
            <circle r="24" fill="rgba(0,242,255,0.06)" />
            <circle r="12" fill="none" stroke="#00f2ff" strokeWidth="1.5" className="pulse-indicator" />
            <circle r="4" fill="#ffffff" />
            <circle r="2" fill="#00dbe7" />
          </g>
        </svg>

        {/* Global World Topographical Compass Grid */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-[82%] h-[72%] rounded-full border border-[#00dbe7]/15 flex items-center justify-center relative">
            <div className="w-[60%] h-[60%] rounded-full border border-[#8f03ff]/20 flex items-center justify-center">
              <Compass
                className="w-80 h-80 text-[#00dbe7]/10 animate-spin"
                style={{ animationDuration: '180s' }}
              />
            </div>
            <div className="absolute top-4 font-mono text-[10px] text-[#00dbe7]/40 tracking-widest">N 00°00'00"</div>
            <div className="absolute bottom-4 font-mono text-[10px] text-[#00dbe7]/40 tracking-widest">S 180°00'00"</div>
            <div className="absolute left-4 font-mono text-[10px] text-[#00dbe7]/40 tracking-widest">W 270°00'00"</div>
            <div className="absolute right-4 font-mono text-[10px] text-[#00dbe7]/40 tracking-widest">E 090°00'00"</div>
          </div>
        </div>
      </div>

      {/* Top Floating Control Bar: Network Summary & Orbit Filters */}
      <div className="relative z-20 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Constellation Orbit Filters */}
        <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-mono border border-white/10 shadow-lg backdrop-blur-xl">
          <div className="flex items-center gap-2 pl-2 pr-1 text-[#00dbe7]">
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-bold text-[#b9cacb] hidden md:inline">ORBITS:</span>
          </div>
          {(['ALL', 'LEO', 'MEO', 'GEO'] as const).map((filter) => (
            <button
              key={filter}
              id={`filter-orbit-${filter.toLowerCase()}`}
              onClick={() => setActiveSatFilter(filter)}
              className={`px-3 py-1.5 rounded-xl transition-all font-mono text-xs cursor-pointer ${
                activeSatFilter === filter
                  ? 'bg-[#00f2ff] text-black font-bold shadow-[0_0_12px_rgba(0,219,231,0.5)]'
                  : 'text-[#b9cacb] hover:text-white hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Global Network Telemetry Overview Card */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 w-full sm:w-80 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] text-[#b9cacb] uppercase tracking-wider flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-[#00f2ff]" />
              GLOBAL CONSTELLATION MESH
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] animate-pulse"></span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-[#00dbe7] tracking-tight drop-shadow-[0_0_12px_rgba(0,219,231,0.5)] font-mono">
              {telemetry?.globalCoveragePercent || 98.4}%
            </div>
            <div className="text-[11px] font-mono text-[#b9cacb]">
              Active Nodes: <span className="text-[#00f2ff] font-bold">{satellites.length}</span>
            </div>
          </div>
          <div className="w-full bg-[#1b1f2c] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#00dbe7] via-[#8f03ff] to-[#00f2ff] h-full rounded-full shadow-[0_0_8px_#00dbe7]"
              style={{ width: `${telemetry?.globalCoveragePercent || 98.4}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Interactive Orbiting Satellite Map Nodes (Clickable & Hoverable) */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto z-10">
        {filteredSatellites.map((sat) => {
          const isHovered = hoveredSatId === sat.id;
          const isSelected = selectedSatId === sat.id;
          const isCurrent = sat.isCurrentNode;
          const isHighlighted = isHovered || isSelected || isCurrent;

          return (
            <div
              key={sat.id}
              id={`map-sat-node-${sat.id}`}
              style={{
                left: `${sat.pixelX}%`,
                top: `${sat.pixelY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredSatId(sat.id)}
              onMouseLeave={() => setHoveredSatId(null)}
              onClick={() => handleSatelliteClick(sat)}
              className="absolute group cursor-pointer p-3"
            >
              {/* Pulse / Beacon Waves when selected or active */}
              {isHighlighted && (
                <div
                  className={`absolute inset-0 rounded-full animate-ping pointer-events-none opacity-40 ${
                    isCurrent ? 'bg-[#00f2ff]' : 'bg-[#8f03ff]'
                  }`}
                  style={{ animationDuration: isCurrent ? '1.8s' : '2.5s' }}
                />
              )}

              {/* Reticle / Radar Target Frame */}
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  isHighlighted
                    ? 'scale-125 bg-[#05070a]/90 border-2 border-[#00f2ff] shadow-[0_0_20px_rgba(0,219,231,0.6)]'
                    : 'scale-100 bg-[#0d121d]/80 border border-white/20 hover:border-[#00dbe7] shadow-lg'
                }`}
              >
                {/* Target Crosshairs on hover */}
                {isHighlighted && (
                  <Crosshair className="absolute w-12 h-12 text-[#00f2ff]/60 animate-spin" style={{ animationDuration: '20s' }} />
                )}

                <SatIcon
                  className={`w-5 h-5 transition-colors ${
                    isCurrent
                      ? 'text-[#00f2ff]'
                      : isHovered
                      ? 'text-white'
                      : sat.orbitType === 'GEO'
                      ? 'text-[#dab9ff]'
                      : 'text-[#849495]'
                  }`}
                />

                {/* Status Dot */}
                <div
                  className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#05070A] ${
                    sat.status === 'active'
                      ? 'bg-[#00f2ff] shadow-[0_0_6px_#00f2ff]'
                      : 'bg-[#ff9900] shadow-[0_0_6px_#ff9900]'
                  }`}
                />
              </div>

              {/* Floating Satellite Code & Altitude Mini Label */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-11 px-2 py-0.5 rounded-md font-mono text-[10px] whitespace-nowrap transition-all duration-200 pointer-events-none flex items-center gap-1.5 border ${
                  isHighlighted
                    ? 'bg-[#00f2ff] text-black font-bold border-[#00f2ff] shadow-[0_0_10px_rgba(0,219,231,0.4)]'
                    : 'bg-black/70 text-[#b9cacb] border-white/10'
                }`}
              >
                <span>{sat.code}</span>
                <span className="opacity-75">[{sat.elevationDeg}&deg;]</span>
                {isCurrent && <span className="text-[9px] font-bold uppercase">&bull; LOCK</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ground Station Center Identifier */}
      <div
        style={{
          left: `${groundStation.x}%`,
          top: `${groundStation.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        className="absolute z-10 pointer-events-none hidden md:flex flex-col items-center"
      >
        <div className="mt-8 px-3 py-1 rounded-xl bg-black/80 border border-[#00f2ff]/30 text-[10px] font-mono text-[#00f2ff] shadow-xl flex items-center gap-1.5 backdrop-blur-md">
          <MapPin className="w-3 h-3 text-[#00f2ff]" />
          <span>{groundStation.code} ({groundStation.lat})</span>
        </div>
      </div>

      {/* Floating Center Feedback Banner (Scanning feedback) */}
      {scanMessage && (
        <div className="relative z-30 mx-auto my-3 glass-panel px-6 py-3 rounded-2xl border border-[#00f2ff] text-xs font-mono text-[#00f2ff] flex items-center gap-3 animate-pulse shadow-[0_0_30px_rgba(0,219,231,0.3)] backdrop-blur-xl">
          <Radio className="w-4 h-4 animate-spin text-[#00f2ff]" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Interactive Diagnostics HUD Tooltip / Hover Telemetry Card */}
      <AnimatePresence>
        {activeFocusSat && (
          <motion.div
            key={activeFocusSat.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-30 self-center md:self-end my-2 w-full max-w-xl glass-panel rounded-2xl p-5 border border-[#00f2ff]/40 shadow-[0_10px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(0,219,231,0.15)] backdrop-blur-2xl"
          >
            {/* Header: Identity, Orbit Type, Operational Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 shadow-[0_0_12px_rgba(0,219,231,0.2)]">
                  <SatIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-white tracking-wide">
                      {activeFocusSat.code}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#8f03ff]/25 text-[#dab9ff] border border-[#8f03ff]/40 font-semibold">
                      {activeFocusSat.orbitType} ORBIT
                    </span>
                    {activeFocusSat.isCurrentNode && (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 font-bold">
                        <CheckCircle className="w-3 h-3" /> ACTIVE LINK
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#b9cacb] font-medium">{activeFocusSat.name}</div>
                </div>
              </div>

              {/* Operational Status Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeFocusSat.status === 'active'
                      ? 'bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]'
                      : 'bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]'
                  } animate-pulse`}
                />
                <span className="font-mono text-[11px] font-semibold text-[#e1fdff]">
                  {activeFocusSat.operationalStatus || 'Nominal - Active Uplink'}
                </span>
              </div>
            </div>

            {/* Core Diagnostics Grid (Velocity, Payload Temp, Altitude, SNR, Power) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3.5">
              {/* 1. Current Orbital Velocity */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00dbe7]/30 transition-colors">
                <div className="flex items-center justify-between text-[#b9cacb] mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-[#00f2ff]" /> VELOCITY
                  </span>
                  <Activity className="w-3 h-3 text-[#00f2ff]/70" />
                </div>
                <div className="font-mono text-lg font-bold text-[#00dbe7] tracking-tight">
                  {activeFocusSat.velocityKmS} <span className="text-xs font-normal text-[#b9cacb]">km/s</span>
                </div>
                <div className="font-mono text-[10px] text-[#849495] mt-0.5">
                  ~{(activeFocusSat.velocityKmS * 3600).toLocaleString()} km/h
                </div>
              </div>

              {/* 2. Payload Temperature */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00dbe7]/30 transition-colors">
                <div className="flex items-center justify-between text-[#b9cacb] mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-[#00f2ff]" /> PAYLOAD TEMP
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      (activeFocusSat.payloadTempC || 20) < 30 ? 'bg-[#00f2ff]' : 'bg-[#ff9900]'
                    }`}
                  />
                </div>
                <div className="font-mono text-lg font-bold text-[#e1fdff] tracking-tight">
                  +{activeFocusSat.payloadTempC || 21.4}&deg;C
                </div>
                <div className="font-mono text-[10px] text-[#00f2ff] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Thermal Nominal
                </div>
              </div>

              {/* 3. Altitude & Elevation */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00dbe7]/30 transition-colors">
                <div className="flex items-center justify-between text-[#b9cacb] mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Crosshair className="w-3 h-3 text-[#00f2ff]" /> ALT / ELEV
                  </span>
                </div>
                <div className="font-mono text-lg font-bold text-[#e1fdff] tracking-tight">
                  {activeFocusSat.altitudeKm.toLocaleString()} <span className="text-xs font-normal text-[#b9cacb]">km</span>
                </div>
                <div className="font-mono text-[10px] text-[#dab9ff] mt-0.5">
                  Elev: {activeFocusSat.elevationDeg}&deg; &bull; Az: {activeFocusSat.azimuthDeg}&deg;
                </div>
              </div>

              {/* 4. Telemetry Link: SNR & Latency */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00dbe7]/30 transition-colors">
                <div className="flex items-center justify-between text-[#b9cacb] mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-[#00f2ff]" /> LINK SNR
                  </span>
                </div>
                <div className="font-mono text-lg font-bold text-[#00dbe7] tracking-tight">
                  {activeFocusSat.snrDb || 28.4} <span className="text-xs font-normal text-[#b9cacb]">dB</span>
                </div>
                <div className="font-mono text-[10px] text-[#b9cacb] mt-0.5">
                  Latency: {activeFocusSat.latencyMs}ms
                </div>
              </div>
            </div>

            {/* Sub-Telemetry Bar: Power, Frequency, Doppler Shift & Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2.5 border-t border-white/10 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-4 text-[#b9cacb]">
                <div className="flex items-center gap-1.5">
                  <SunMedium className="w-3.5 h-3.5 text-[#ffc83b]" />
                  <span>Solar: <strong className="text-white">{activeFocusSat.solarArrayOutputW || 1420} W</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#00f2ff]" />
                  <span>Battery: <strong className="text-white">{activeFocusSat.batteryPercent || 98}%</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#dab9ff]" />
                  <span>Freq: <strong className="text-white">{activeFocusSat.frequencyGhz || 14.25} GHz</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#00dbe7]" />
                  <span>Doppler: <strong className="text-white">{(activeFocusSat.dopplerShiftKhz || 0) > 0 ? `+${activeFocusSat.dopplerShiftKhz}` : activeFocusSat.dopplerShiftKhz} kHz</strong></span>
                </div>
              </div>

              {!activeFocusSat.isCurrentNode && (
                <button
                  id={`btn-connect-sat-${activeFocusSat.id}`}
                  onClick={() => handleSatelliteClick(activeFocusSat)}
                  className="w-full sm:w-auto px-4 py-1.5 bg-[#00f2ff] hover:bg-[#74f5ff] text-black font-bold font-mono text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(0,219,231,0.4)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>Lock Transponder Beam</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Floating Control Shelf: Visible Satellites List & Search Best Connection Button */}
      <div className="relative z-20 w-full flex flex-col md:flex-row gap-4 items-end justify-between pt-2">
        {/* Visible Satellites List */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 w-full md:w-96 flex-shrink-0 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-mono text-xs font-bold text-[#b9cacb] uppercase tracking-wider flex items-center gap-2">
              <SatIcon className="w-4 h-4 text-[#00dbe7]" />
              <span>Visible Constellation ({filteredSatellites.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-[#00f2ff]">HOVER / SELECT NODE</span>
          </div>

          <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
            {filteredSatellites.map((sat) => {
              const isCurrent = sat.isCurrentNode;
              const isHovered = hoveredSatId === sat.id;

              return (
                <div
                  key={sat.id}
                  id={`list-sat-item-${sat.id}`}
                  onMouseEnter={() => setHoveredSatId(sat.id)}
                  onMouseLeave={() => setHoveredSatId(null)}
                  onClick={() => handleSatelliteClick(sat)}
                  className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border ${
                    isHovered
                      ? 'bg-[#00f2ff]/20 border-[#00f2ff] shadow-[0_0_15px_rgba(0,219,231,0.25)]'
                      : isCurrent
                      ? 'bg-[#00f2ff]/10 border-[#00f2ff]/40 shadow-[inset_0_0_12px_rgba(0,219,231,0.15)]'
                      : 'bg-white/5 border-transparent hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isCurrent || isHovered ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'bg-white/5 text-[#849495]'
                      }`}
                    >
                      <SatIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-[#e1fdff] flex items-center gap-2">
                        <span>{sat.code}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#dab9ff] font-normal">
                          {sat.orbitType}
                        </span>
                        {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-[#00f2ff]" />}
                      </div>
                      <div className="font-mono text-[10px] text-[#b9cacb]">
                        Vel: {sat.velocityKmS} km/s &bull; Temp: +{sat.payloadTempC}&deg;C
                      </div>
                    </div>
                  </div>

                  {/* Signal Bars visualization */}
                  <div className="flex items-end gap-1 h-5">
                    {[1, 2, 3, 4].map((bar) => {
                      const isLit = bar <= sat.signalBars;
                      return (
                        <div
                          key={bar}
                          style={{ height: `${bar * 4 + 2}px` }}
                          className={`w-1 rounded-sm transition-all ${
                            isLit
                              ? 'bg-[#00dbe7] shadow-[0_0_6px_#00dbe7]'
                              : 'bg-[#262a37]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Button: Search Best Connection */}
        <div className="w-full md:w-auto flex flex-col gap-2">
          <button
            id="btn-search-best-connection"
            disabled={isScanning}
            onClick={handleSearchBestConnection}
            className="w-full md:w-auto px-8 py-4 bg-white hover:bg-[#00f2ff] text-black font-mono font-bold text-sm rounded-2xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(0,219,231,0.6)] flex items-center justify-center gap-3 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Search className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Orbit Planes...' : 'Search Best Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
