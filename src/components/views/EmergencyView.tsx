import { useState } from 'react';
import { TelemetryData } from '../../types';
import {
  AlertTriangle,
  Radio,
  MapPin,
  ShieldAlert,
  Send,
  CheckCircle2,
  PhoneCall,
  Activity,
  ArrowLeft,
  XCircle,
} from 'lucide-react';

interface Props {
  telemetry: TelemetryData | null;
  emergencyActive: boolean;
  onTriggerSos: (payload: { emergencyType: string; notes?: string }) => Promise<void>;
  onCancelSos: () => Promise<void>;
  onBack: () => void;
}

export function EmergencyView({
  telemetry,
  emergencyActive,
  onTriggerSos,
  onCancelSos,
  onBack,
}: Props) {
  const [emergencyType, setEmergencyType] = useState('Medical & Search & Rescue');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const emergencyTypes = [
    'Medical & Search & Rescue',
    'Vessel Breakdown / Mechanical Failure',
    'Extreme Weather / Natural Hazard',
    'Critical Ground Station Isolation',
  ];

  const handleActivate = async () => {
    setIsSubmitting(true);
    await onTriggerSos({ emergencyType, notes });
    setIsSubmitting(false);
  };

  const handleDeactivate = async () => {
    setIsSubmitting(true);
    await onCancelSos();
    setIsSubmitting(false);
    setShowConfirmCancel(false);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs font-mono text-[#b9cacb] hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#93000a]/40 border border-[#ffb4ab]/40 text-[#ffdad6] text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse text-[#ffb4ab]" />
          <span>COSPAS-SARSAT 406.040 MHz PRIORITY LINK</span>
        </div>
      </div>

      {/* Main Alert Container */}
      <div
        className={`glass-panel rounded-3xl p-6 sm:p-10 flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 ${
          emergencyActive
            ? 'border-2 border-[#ffb4ab] bg-[#93000a]/25 ambient-glow-red shadow-[0_0_50px_rgba(255,180,171,0.3)]'
            : 'border border-white/10'
        }`}
      >
        {/* Animated Scan line */}
        {emergencyActive && <div className="scanning-line"></div>}

        {/* Big Alert Icon */}
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mb-6 transition-all ${
            emergencyActive
              ? 'bg-[#ffb4ab] text-[#690005] shadow-[0_0_40px_#ffb4ab] pulse-red scale-110'
              : 'bg-[#93000a]/30 text-[#ffb4ab] border border-[#ffb4ab]/30'
          }`}
        >
          <AlertTriangle className="w-12 h-12" />
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#ffdad6] tracking-tight mb-3">
          {emergencyActive ? 'EMERGENCY BEACON TRANSMITTING' : 'Satellite Emergency Comms'}
        </h2>

        <p className="text-sm sm:text-base text-[#ffdad6]/80 max-w-xl mb-8 leading-relaxed">
          {emergencyActive
            ? 'Priority distress telemetry and coordinate beacons are broadcasting across all visible LEO/MEO constellation relays to international rescue dispatch.'
            : 'Instantaneous override clears all satellite transponder bandwidth to establish a dedicated distress channel for remote personnel.'}
        </p>

        {/* Geolocation & Telemetry Card */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 text-left">
          <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#b9cacb] mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#ffb4ab]" />
              <span>COORDINATES</span>
            </div>
            <div className="font-mono text-sm font-bold text-[#e1fdff]">
              45.9234° N, 104.2812° W
            </div>
            <span className="text-[10px] font-mono text-[#00f2ff]">GPS Lock: 8 Sats</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#b9cacb] mb-1">
              <Radio className="w-3.5 h-3.5 text-[#ffb4ab]" />
              <span>RELAY NODE</span>
            </div>
            <div className="font-mono text-sm font-bold text-[#00dbe7]">
              {telemetry?.nodeCode || 'ORB-092'} (LEO)
            </div>
            <span className="text-[10px] font-mono text-[#dab9ff]">Elevation: 68°</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#b9cacb] mb-1">
              <Activity className="w-3.5 h-3.5 text-[#ffb4ab]" />
              <span>BEACON STATUS</span>
            </div>
            <div
              className={`font-mono text-sm font-bold ${
                emergencyActive ? 'text-[#ffb4ab] animate-pulse' : 'text-[#849495]'
              }`}
            >
              {emergencyActive ? 'ACTIVE BROADCAST' : 'ARMED / STANDBY'}
            </div>
            <span className="text-[10px] font-mono text-[#849495]">Power: 100% Reserve</span>
          </div>
        </div>

        {/* SOS Action Controls */}
        {!emergencyActive ? (
          <div className="w-full max-w-xl flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs font-mono text-[#ffdad6]/80 block mb-1.5">
                Select Distress Nature
              </label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full bg-[#1b1f2c] border border-[#ffb4ab]/30 rounded-xl px-4 py-3 text-sm text-[#ffdad6] focus:border-[#ffb4ab] outline-none font-mono"
              >
                {emergencyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#ffdad6]/80 block mb-1.5">
                Distress Notes / Medical Status (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe current situation, number of persons, medical urgency..."
                rows={3}
                className="w-full bg-[#1b1f2c] border border-white/10 rounded-xl p-3 text-sm text-[#e1fdff] focus:border-[#ffb4ab] outline-none font-mono resize-none placeholder:text-[#849495]/50"
              />
            </div>

            <button
              id="btn-broadcast-emergency-sos"
              disabled={isSubmitting}
              onClick={handleActivate}
              className="w-full py-4 bg-[#ffb4ab] hover:bg-[#ffdad6] text-[#690005] font-mono font-black text-base rounded-2xl transition-all shadow-[0_0_35px_rgba(255,180,171,0.5)] flex items-center justify-center gap-3 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <ShieldAlert className="w-6 h-6 text-[#690005]" />
              <span>BROADCAST EMERGENCY SOS OVERRIDE</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl flex flex-col gap-4">
            {/* Live Dispatch Transmission Log */}
            <div className="glass-panel p-4 rounded-2xl bg-black/60 border border-[#ffb4ab]/30 text-left font-mono text-xs space-y-2 text-[#ffdad6]">
              <div className="flex items-center gap-2 text-[#00f2ff]">
                <CheckCircle2 className="w-4 h-4 text-[#00f2ff]" />
                <span>[00:01] 406 MHz Emergency Beacon Synced with ORB-092</span>
              </div>
              <div className="flex items-center gap-2 text-[#00f2ff]">
                <CheckCircle2 className="w-4 h-4 text-[#00f2ff]" />
                <span>[00:03] GPS Coordinates Broadcast to International SAR Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-[#ffb4ab] animate-pulse">
                <Radio className="w-4 h-4 text-[#ffb4ab]" />
                <span>[00:07] Voice &amp; Data Channel Reserved &bull; Monitoring SAR Response</span>
              </div>
            </div>

            {/* Deactivation confirmation */}
            {!showConfirmCancel ? (
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-[#e1fdff] font-mono font-bold text-xs border border-white/20 transition-all cursor-pointer"
              >
                Stand Down / Cancel Emergency Beacon
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-[#1b1f2c] border border-white/20 flex flex-col gap-3">
                <p className="font-mono text-xs text-[#b9cacb]">
                  Are you sure you want to cancel the emergency override? Search and rescue ground control will be notified.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowConfirmCancel(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-[#b9cacb] hover:bg-white/10"
                  >
                    Keep Transmitting
                  </button>
                  <button
                    onClick={handleDeactivate}
                    className="px-5 py-2 rounded-xl bg-[#00f2ff] text-black font-mono font-bold text-xs hover:bg-[#74f5ff]"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
